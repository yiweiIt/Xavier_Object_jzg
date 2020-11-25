const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    currentCapital:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCapilte();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /*获取获取个人收入以及余额情况/推客二维码*/
  getCapilte: function () {
    var that = this;
    app.func.req('capital/getCapilte', {
    }, function (data) {
      if (data) {
        that.setData({
          currentCapital: data.currentCapital
        });
      }
    })
  },
  /*推客码*/
  goTwitterCode: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../../wallet/twitterCode/twitterCode',
      })
    })
  }, 1000),
  /*推客邀请*/
  goTiro: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../../guide/guide?status=1',
      })
    })
  }, 1000),
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})