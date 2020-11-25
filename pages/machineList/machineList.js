// pages/machineList/machineList.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    query: {
      page: 0,
      size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadUrl(options.id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      list: []
    })
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.canLoadMore){
      that.setData({
        query: {
          page: this.data.query.page+1,
          size: this.data.query.size
        }
      })
      that.loadData();
    }
  },

  // 定义标题和url
  loadUrl: function(id){
    var that = this;
    switch (id) {
      case 'machineIns':
        that.setData({
          url: 'machine/machineIns/queryAboutMe',
          statusId: 'machineIns',
          publishTitle: '我要找机械',
          publishName: 'rent'
        })
        wx.setNavigationBarTitle({
          title: '工程找机械',
        })
        break;
      case 'machineOuts':
        that.setData({
          url: 'machine/machineOuts/queryAboutMe',
          statusId: 'machineOuts',
          publishTitle: '我要出租机械',
          publishName: 'let'
        })
        wx.setNavigationBarTitle({
          title: '机械找工程',
        })
        break;
      case 'machineRecruit':
        that.setData({
          url: 'machineRecruit/queryAboutMe',
          statusId: 'machineRecruit',
          publishTitle: '我要招聘',
          publishName: 'mechanic'
        })
        wx.setNavigationBarTitle({
          title: '机械手招聘',
        })
        break;
      case 'machinerWants':
        that.setData({
          url: 'machine/machinerWants/queryAboutMe',
          statusId: 'machinerWants',
          publishTitle: '我要求职',
          publishName: 'apply'
        })
        wx.setNavigationBarTitle({
          title: '机械手求职',
        })
        break;
    }
  },

  // 获取数据
  loadData: function(){
    var that = this;
    app.func.req(that.data.url, {
      page: that.data.query.page,
      size: that.data.query.size
    },function(data){
      that.setData({
        list: that.data.list.concat(data.content),
        canLoadMore: !data.last
      })
      console.log(that.list);
    })
  },

  // 跳转机械详情
  goMyMachineDetail: function(e){
    wx.navigateTo({
      url: '../myMachineDetail/myMachineDetail?statusId=' + this.data.statusId + '&id=' + e.currentTarget.dataset.name
    })
  },

  // 跳转发布机械
  goPublish: function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../machinepublish/machinepublish?id=' + e.currentTarget.dataset.name
      })
    })
  },
})