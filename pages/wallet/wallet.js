const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    invitationCodeUrl:'',
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
          invitationCodeUrl: data.invitationCodeUrl
        });
      }
    })
  },
  /*判断是否有保存图片权限*/
  save: function (e) {
    let that = this;
    var dataImgUrl = e.currentTarget.dataset.url;
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    util.checkPhotosAlbumPermissionByMP().catch(error => {
      wx.showToast({
        title: '您没有授权，无法保存到相册。请先到小程序设置页授权',
        icon: 'none'
      })
    })
      .then(value => {
        that.savePhoto(dataImgUrl);
        console.log(value);
      })
  },
  /*保存图片到相册*/
  savePhoto: function (dataImgUrl) {
    let that = this;
    wx.downloadFile({
      url: dataImgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
          }
        })
      }
    })
  },
 /*推客码*/
  goTwitterCode: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wallet/twitterCode/twitterCode',
      })
    })
  }, 1000),
  /*推客邀请*/
  goTiro: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../guide/guide?status=1',
      })
    })
  }, 1000),
  /*工资订单--1/购买团险--2/积分充值--3/急聘支付--4*/
  goDetailed:util.throttle(function (e) {
    app.isBind().then(value => {
      console.log(e.currentTarget.dataset.type);
      wx.navigateTo({
        url: '../wallet/detailed/detailed?type=' + e.currentTarget.dataset.type,
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