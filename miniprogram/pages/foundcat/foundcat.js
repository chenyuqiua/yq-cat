import {
  shuffle,
  regReplace,
  getDeltaHours,
} from "../../utils";
import {
  getAvatar,
  getVisitedDate
} from "../../cat";
import {
  getCatCommentCount
} from "../../comment";
import { getUserInfo } from "../../user";
import cache from "../../cache";
import config from "../../config";
import { loadFilter, getGlobalSettings, showTab } from "../../page";
import { cloud } from "../../cloudAccess";

const default_png = undefined;

var catsStep = 1;
var loadingLock = 0; // 用于下滑刷新加锁

var pageLoadingLock = true; // 用于点击按钮刷新加锁

const tipInterval = 24; // 提示间隔时间 hours

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cats: [],

    filters: [],
    filters_sub: 0, // 过滤器子菜单
    filters_legal: true, // 这组过滤器是否合法
    filters_show: false, // 是否显示过滤器
    filters_input: '', // 输入的内容，目前只用于挑选名字
    filters_show_shadow: false, // 滚动之后才显示阴影
    filters_empty: true, // 过滤器是否为空

    // 高度，单位为px（后面会覆盖掉）
    heights: {
      filters: 40,
    },
    // 总共有多少只猫
    catsMax: 0,

    // 加载相关
    loading: false, // 正在加载
    loadnomore: false, // 没有再多了

    // 领养状态
    adopt_desc: config.cat_status_adopt,
    // 寻找领养的按钮
    adopt_count: 0,

    text_cfg: config.text,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("options", options);
    // 从缓存里读取options
    var fcampus = options.fcampus;
    if (!fcampus) {
      fcampus = this.getFCampusCache();
    }
    // 从分享点进来，到跳转到其他页面
    if (options.toPath) {
      wx.navigateTo({
        url: decodeURIComponent(options.toPath),
      });
    }
    // 从扫描二维码扫进来，目前只用于猫猫二维码跳转
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      console.log("scene:", scene);
      if (scene.startsWith('toC=')) {
        const cat_No = scene.substr(4);
        const db = cloud.database();
        // var cat_res = await db.collection('found_cat').where({
        var cat_res = await db.collection('cat').where({
          _no: cat_No
        }).field({
          _no: true
        }).get()

        if (!cat_res.data.length) {
          return;
        }
        const _id = cat_res.data[0]._id;
        this.clickCatCard(_id, true);
      }
    }
    // 开始加载页面
    const settings = await getGlobalSettings('genealogy');
    // 先把设置拿到
    catsStep = settings['catsStep'];
    // 启动加载
    this.loadFilters(fcampus);

    this.setData({
      main_lower_threshold: settings['main_lower_threshold'],
      adStep: settings['adStep'],
      photoPopWeight: settings['photoPopWeight'] || 10
    });
  },

  onShow: function () {
    showTab(this);
  },

  loadFilters: async function (fcampus) {
    // 下面开始加载filters
    var res = await loadFilter();
    var filters = [];
    var area_item = {
      key: 'area',
      cateKey: 'campus',
      name: '校区',
      category: []
    };
    area_item.category.push({
      name: '全部校区',
      items: [], // '全部校区'特殊处理
      all_active: true
    });
    // 用个object当作字典，把area分下类
    var classifier = {};
    for (let i = 0, len = res.campuses.length; i < len; ++i) {
      classifier[res.campuses[i]] = {
        name: res.campuses[i],
        items: [], // 记录属于这个校区的area
        all_active: false
      };
    }
    for (let k = 0, len = res.area.length; k < len; ++k) {
      classifier[res.area[k].campus].items.push(res.area[k]);
    }
    for (let i = 0, len = res.campuses.length; i < len; ++i) {
      area_item.category.push(classifier[res.campuses[i]]);
    }
    // 把初始fcampus写入，例如"011000"
    if (fcampus) {
      for (let i = 0; i < fcampus.length; i++) {
        const active = fcampus[i] == "1";
        area_item.category[i].all_active = active;
      }
    }
    filters.push(area_item);

    var colour_item = {
      key: 'colour',
      name: '花色',
      category: [{
        name: '全部花色',
        items: res.colour.map(name => {
          return {
            name: name
          };
        }),
        all_active: true
      }]
    }
    filters.push(colour_item);

    var adopt_status = [{
      name: "未知",
      value: null
    }];
    adopt_status = adopt_status.concat(config.cat_status_adopt.map((name, i) => {
      return {
        name: name,
        value: i, // 数据库里存的
      };
    }));

    var adopt_item = {
      key: 'adopt',
      name: '领养',
      category: [{
        name: '全部状态',
        items: adopt_status,
        all_active: true
      }]
    }
    filters.push(adopt_item);

    // 默认把第一个先激活了
    filters[0].active = true;
    console.log(filters);
    this.newUserTip();
    await this.setData({
      filters: filters,
    });
    await this.reloadCats();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getHeights();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    await this.loadMoreCats();
  },


  checkNeedLoad() {
    if (this.data.cats.length >= this.data.catsMax) {
      this.setData({
        loadnomore: true
      });
      pageLoadingLock = false;
      return false;
    }
    return true;
  },

  async reloadCats() {
    // 增加lock
    loadingLock++;
    const nowLoadingLock = loadingLock;
    const db = cloud.database();
    // const cat = db.collection('found_cat');
    const cat = db.collection('cat');
    const query = this.fGet();
    const cat_count = (await cat.where(query).count()).total;

    if (loadingLock != nowLoadingLock) {
      // 说明过期了
      return false;
    }
    this.setData({
      cats: [],
      catsMax: cat_count,
      loadnomore: false,
      filters_empty: Object.keys(query).length === 0,
    });
    await Promise.all([
      this.loadMoreCats(),
      // 加载待领养
      // this.countWaitingAdopt(),
      // 刷新cache一下
      this.setFCampusCache()
    ]);

    this.unlockBtn();
  },

  // 加载更多的猫猫
  async loadMoreCats() {
    // 加载lock
    const nowLoadingLock = loadingLock;
    if (!this.checkNeedLoad() || this.data.loading) {
      return false;
    }

    await this.setData({
      loading: true,
    });

    var cats = this.data.cats;
    var step = catsStep;
    const db = cloud.database();
    const cat = db.collection('cat');
    const _ = db.command;
    const query = this.fGet();
    var new_cats = (await cat.where({
      popularity: _.gt(10),
      ...query
    }).orderBy('mphoto', 'desc').orderBy('popularity', 'desc').skip(cats.length).limit(step).get()).data
    new_cats = shuffle(new_cats);

    if (loadingLock != nowLoadingLock) {
      // 说明过期了
      console.log(`过期了 ${loadingLock}, ${nowLoadingLock}`)
      return false;
    }
    console.log("0------------------");
    console.log(new_cats);
    for (var d of new_cats) {
      d.photo = default_png;
      d.characteristics_string = [(d.colour || '') + ''].concat(d.characteristics || []).join('，');
      if (!d.mphoto) {
        d.mphoto_new = false;
        continue;
      }

      const today = new Date();
      const modified_date = new Date(d.mphoto);
      const delta_date = today - modified_date; // milliseconds

      // 小于7天
      d.mphoto_new = ((delta_date / 1000 / 3600 / 24) < 7);

      // 是否最近看过了
      const visit_date = getVisitedDate(d._id);
      if (visit_date >= modified_date) {
        d.mphoto_new = false;
      }
    }
    new_cats = cats.concat(new_cats);
    await this.setData({
      cats: new_cats,
      loading: false,
      loadnomore: Boolean(new_cats.length === this.data.catsMax)
    });
    await this.loadCatsPhoto();
  },

  async loadCatsPhoto() {
    // 加载lock
    const nowLoadingLock = loadingLock;

    const cats = this.data.cats;

    var cat2photos = {};
    var cat2commentCount = {};
    for (var cat of cats) {
      if (cat.photo === default_png) {
        cat2photos[cat._id] = await getAvatar(cat._id, cat.photo_count_best);
        if (!cat2photos[cat._id]) {
          continue;
        }
        if (!cat2photos[cat._id].userInfo) {
          cat2photos[cat._id].userInfo = (await getUserInfo(cat2photos[cat._id]._openid)).userInfo;
        }
        cat2commentCount[cat._id] = await getCatCommentCount(cat._id);
      }
    }

    if (loadingLock != nowLoadingLock) {
      console.log("过期了，照片数量：" + cats.length);
      // 说明过期了
      return false;
    }

    // 这里重新获取一遍，因为可能已经刷新了
    var new_cats = this.data.cats;
    for (var c of new_cats) {
      if (cat2photos[c._id]) {
        c.photo = cat2photos[c._id];
        c.comment_count = cat2commentCount[c._id];
      }
    }

    await this.setData({
      cats: new_cats
    });
  },

  // 开始计算各个东西高度
  getHeights() {
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        this.setData({
          "heights.filters": res.screenHeight * 0.065,
          "heights.screenHeight": res.screenHeight,
          "heights.windowHeight": res.windowHeight,
          "heights.statusBarHeight": res.statusBarHeight,
          "heights.rpx2px": res.windowWidth / 750,
        });
      }
    });
  },

  fGet: function () {
    const db = cloud.database();
    const _ = db.command;
    const filters = this.data.filters;
    var res = []; // 先把查询条件全部放进数组，最后用_.and包装，这样方便跨字段使用or逻辑
    // 这些是点击选择的filters
    for (const mainF of filters) {
      // 把数据库要用的key拿出来
      const key = mainF.key;
      var selected = []; // 储存已经选中的项
      const cateFilter = Boolean(mainF.cateKey);
      if (cateFilter) { // 如果分类的名字也会作为筛选内容，这种筛选可能是因为不同类间key字段可能重名
        var cateKey = mainF.cateKey;
        var cateSelected = [];
      }

      // 下面开始遍历每个分类下的子项
      if (mainF.category[0].all_active) continue; // 选择了'全部', 不用管这个类

      for (const category of mainF.category) {
        let cateKeyPushed = false; // 一个category只用push一次，记一下
        for (const item of category.items) {
          if (category.all_active || item.active) {
            var choice = item.name;
            if (item.value === null) {
              choice = _.exists(false); // 判断字段不存在
            } else if (item.value != undefined) {
              choice = item.value;
            }
            selected.push(choice);
            if (cateFilter && !cateKeyPushed) {
              cateSelected.push(category.name);
              cateKeyPushed = true;
            }
          }
        }
      }

      // console.log(key, selected);
      res.push({
        [key]: _.in(selected)
      });
      if (cateFilter) res.push({
        [cateKey]: _.in(cateSelected)
      });
    }
    // 判断一下filters生效没有

    this.setData({
      filters_active: res.length > 0
    });

    // 如果用户还输入了东西，也要一起搜索
    const filters_input = regReplace(this.data.filters_input);
    if (filters_input.length) {

      var search_str = '';
      for (const n of filters_input.trim().split(' ')) {
        if (search_str === '') {
          search_str += '(.*' + n + '.*)';
        } else {
          search_str += '|(.*' + n + '.*)';
        }
      }
      // res['name'] = _.in(filters_input.trim().split(' '));
      let regexp = db.RegExp({
        regexp: search_str,
        options: 'is',  // 'g' 在 laf 这边会报错
      });
      res.push(_.or([{
        name: regexp
      }, {
        nickname: regexp
      }]));
    }
    return res.length ? _.and(res) : {};
  },

  newUserTip() {
    const key = "newUserTip";
    var lastTime = wx.getStorageSync(key);

    if (lastTime != undefined && getDeltaHours(lastTime) < tipInterval) {
      // 刚提示没多久
      return false;
    }

    // 显示提示
    this.showFilterTip();

    // 写入时间
    wx.setStorageSync(key, new Date());
  },
  
  // 上锁
  lockBtn() {
    // console.log("lock");
    pageLoadingLock = true;
  },
  // 解锁
  unlockBtn() {
    // console.log("unlock");
    pageLoadingLock = false;
  },

  // campus过滤器cache起来
  setFCampusCache: function () {
    cache.setCacheItem("genealogy-fcampus", cache.cacheTime.genealogyFCampus);
  },

  // campus过滤器取cache
  getFCampusCache: function () {
    return cache.getCacheItem("genealogy-fcampus");
  },

  // 搜索框是否要显示阴影
  fScroll: function (e) {
    const scrollTop = e.detail.scrollTop;
    const filters_show_shadow = this.data.filters_show_shadow;
    if ((scrollTop < 50 && filters_show_shadow == true) || (scrollTop >= 50 && filters_show_shadow == false)) {
      this.setData({
        filters_show_shadow: !filters_show_shadow
      });
    }
  }
})