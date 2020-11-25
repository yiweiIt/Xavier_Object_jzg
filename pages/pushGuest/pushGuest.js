// pages/pushGuest/pushGuest.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //isprop: "none",//我的推客码
    isprop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },
  /*获取获取个人收入以及余额情况/推客二维码*/
  getCapilte:function(){
    var that = this;
    app.func.req('capital/getCapilte', {
    }, function (data) {
      wx.stopPullDownRefresh();
      if (data){
        that.setData({
          totalCapital: data.totalCapital,
          currentCapital: data.currentCapital,
          invitationCodeUrl: data.invitationCodeUrl
        });
      }
    })   
  },
  /*判断是否有保存图片权限*/
  save:function(e){
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
  savePhoto: function (dataImgUrl){
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCapilte();
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
  /*进入收支明细*/
  goRevenue:util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../pushGuest/revenue/revenue'
      })
    })
  }, 1000),
  // /*去提现*/
  // goWithdraw: function () {
  //   wx.navigateTo({
  //     url: '../pushGuest/withdraw/withdraw?currentCapital=' + this.data.currentCapital
  //   })
  // },
  /*邀请情况*/
  goInviteFriends: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../pushGuest/inviteFriends/inviteFriends'
      })
    })
  }, 1000),
  /*提现记录*/
  goNotes: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../pushGuest/notes/notes'
      })
    })
  }, 1000),

  /*新手必进*/
  goTiro: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../guide/guide?status=1',
      })
    })
  }, 1000),
  /*显示弹框*/
  goTweetQR: function () {
    this.setData({
      // isprop: "flex"
      isprop:true
    })
  },
  /*关闭弹框*/
  close_model: function (e) {
    this.setData({
      isprop: false
      // isprop: "none"
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCapilte();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  } ,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '建筑人用建筑港，招工用工赚现金',
      path: "pages/index/index?inviteCode=" + wx.getStorageSync('openId'),
      imageUrl: "https://jianzhugang.oss-cn-shenzhen.aliyuncs.com/mini/newIcon/inviteShareImg.jpg",
      success: function (res) {
        wx.showToast({
          title: '邀请已发送，请耐心等待',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '邀请失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})