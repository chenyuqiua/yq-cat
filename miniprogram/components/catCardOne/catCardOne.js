import config from "../../config";
import { isManagerAsync } from "../../user";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cats: {
      type: Array,
      value: []
    },
    photoPopWeight: {
      value: ""
    },
    adopt_desc: {
      type: Array,
      value: []
    },
    cats_max: {
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 总共有多少只猫
    catsMax: 0,

    // 寻找领养的按钮
    adopt_count: 0,
    text_cfg: config.text,
  },

  methods: {
    clickCatCard(e, isCatId) {
      const cat_id = isCatId ? e : e.currentTarget.dataset.cat_id;
      const index = this.data.cats.findIndex(cat => cat._id == cat_id);
      const detail_url = '/pages/genealogy/detailCat/detailCat';
  
      if (index != -1) {
        this.setData({
          [`cats[${index}].mphoto_new`]: false
        });
      }
  
      wx.navigateTo({
        url: detail_url + '?cat_id=' + cat_id,
      });
    },
  
    // 管理员判断，其实可以存到global里
    async bindManageCat(e) {
      var res = await isManagerAsync();
      if (res) {
        const cat_id = e.currentTarget.dataset.cat_id;
        wx.navigateTo({
          url: '/pages/manage/addCat/addCat?cat_id=' + cat_id,
        });
        return;
      }
      console.log("not a manager");
    },
  
    bindImageLoaded(e) {
      const idx = e.currentTarget.dataset.index;
      this.setData({
        [`cats[${idx}].imageLoaded`]: true
      });
    },
  }
})