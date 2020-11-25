const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    modalHidden: {
      type: String,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    //类型工种级联
    teamTypes: [],
    name: '全部工种'
  },

  pageLifetimes: {
    show: function () {
      this.getTeamTypes();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changetype: function (e) {
      this.setData({
        modalHidden: true,
        id: ''
      })
      this.triggerEvent('changeModalHidden', {
        modalHidden: this.data.modalHidden
      })
    },
    onclick: function (e) {
      var that = this;
      that.setData({
        state: e.currentTarget.dataset.id,
        id: e.currentTarget.dataset.id,
        name: e.currentTarget.dataset.name
      })
    },
    submit: function (e) {
      this.setData({
        modalHidden: false
      })
      this.triggerEvent('changeWorktype', {
        name: this.data.name,
        id: this.data.id,
        modalHidden: this.data.modalHidden
      })
    },
    //获取数据库数据
    getTeamTypes: function () {
      var that = this;
      wx.showLoading({
        title: 'Loading...',
      })
      app.func.req('teamTypes/getTeamTypeList', { flag: false }, function (data) {
        wx.hideLoading();
        //获取云数据库数据
        var temp = data;
        //初始化更新数据
        that.setData({
          teamTypes: temp
        })
      })
    },
  }
})