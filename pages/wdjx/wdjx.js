// pages/wdjx/wdjx.js
const app = getApp();
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  goMachineList: function(e){
    wx.navigateTo({
      url: '../machineList/machineList?id=' + e.currentTarget.dataset.name
    })
  },

  getMachineries: function () {
    var that = this;
    app.func.req('machineAsks/getMachinesByPhone', {
      page: that.data.page.index,
      size: that.data.page.size,
      phone: that.data.mPhone,
    }, function (data) {
      that.setData({
        canLoadMore: !data.last,
        machineries: data.results,
        dataInfo: true
      });

    });
  }
 })