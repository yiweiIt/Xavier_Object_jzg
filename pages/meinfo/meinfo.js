// pages/meinfo/meinfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  getUser: function() {
    var that = this;
    app.func.req('accounts/getByWxOpenId', {
      wxOpenId: app.globalData.openId
    }, function (data) {
      that.setData({
        auth: data.auditStatus,
        userInfo: data
      })
    })
  },
  reAuth: function() {
    wx.navigateTo({
      url: '../idcard/idcard',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
  },

 
})