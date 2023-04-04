import { text as text_cfg, science_imgs } from "../../config";
import { cloud } from "../../cloudAccess";
import { checkAuth } from "../../user";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    text_cfg: text_cfg,
    newsList: [],
    newsList_show: [],
    updateRequest: false,
    auth: false,
  },
  created: async function (options) {
    const db = cloud.database();
    var res = await db.collection('news').orderBy('date', 'desc').get();

    this.setData({
      newsList: res.data,
      newsList_show: res.data,
    })
    await checkAuth(this, 2);

    // 科普部分
    this.setSciImgs();
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    gotoSciDetail(e) {
      const cate = e.currentTarget.dataset.cate;
      wx.navigateTo({
        url: '/pages/news/sciDetail/sciDetail?cate=' + cate + '&coverImgList=' + this.data.images,
      });
    },
    // 科普轮播图相关代码
    async setSciImgs() {
      const sciImgList = await Promise.all(science_imgs.map(val => cloud.signCosUrl(val)));
      const cacheKey = 'sciImgStorage';
      const dataKey = 'images';

      const fileSystem = wx.getFileSystemManager();
      
      var cachePathList = wx.getStorageSync(cacheKey);
      try {
        fileSystem.accessSync(cachePathList[0]);
        this.useCacheImg(cacheKey, dataKey);
      } catch(e) {
        this.useCloudImg(sciImgList, dataKey);
        this.cacheCloudImg(cacheKey, sciImgList);
      }
    },

    useCacheImg(cacheKey, dataKey) {
      var coverImgList = wx.getStorageSync(cacheKey);
      this.setData({
        [dataKey]: coverImgList
      })
    },
    useCloudImg(onlineImgs, dataKey) {
      this.setData({
        [dataKey]: onlineImgs
      })
    },
    async cacheCloudImg(cacheKey, imgUrlList) { // 下载并缓存封面
      const fileSystem = wx.getFileSystemManager();
      var promiseAll = [];
      var cachePathList = [];
      
      for (let i = 0; i < imgUrlList.length; i++) {
        promiseAll.push(cloud.downloadFile({
          fileID: imgUrlList[i],
        }));
      }
  
      var res = await Promise.all(promiseAll);
  
      console.log("[cacheCloudImg] -",res);
      for(let i = 0; i < res.length; i++){
        var savedFilePath = fileSystem.saveFileSync(res[i].tempFilePath);
        cachePathList.push(savedFilePath);
      }
      wx.setStorage({
        key: cacheKey,
        data: cachePathList
      });
    },
  }
})
