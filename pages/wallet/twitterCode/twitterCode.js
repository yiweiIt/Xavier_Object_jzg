const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    invitationCodeUrl:''
  },
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