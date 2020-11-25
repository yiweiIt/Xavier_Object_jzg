// pages/wd/changephone/changephone.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonedeta:[],
    isInCode: 1,
    isCodeTime: 60,
    openId:'',
    mobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      openId: options.openId,
      mobile: options.mobile
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

  },
  bindphone: function (e){
    var that=this
    let phonedeta = this.data.phonedeta
    phonedeta.phone=e.detail.value
    this.setData({
      phonedeta
    })
  },

  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  //提交手机号
  submitphone: function (e) {
    var that = this;
    this.setData({
      phonedeta: e.detail.value
    })
    that.doSave();
  },
  //发送验证码
  getVerifyCode:function(e){
    var that = this;
    if (this.isEmpty(that.data.phonedeta.phone)) {
      wx.showModal({
        title: '提示',
        content: "手机号码不能为空~",
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    if (util.isPhone(that.data.phonedeta.phone) == false) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isCodeFun = setInterval(() => {
      var isCodeTime = that.data.isCodeTime - 1
      that.setData({
        isCodeTime: isCodeTime
      })
    }, 1000)
    util.sendVerifyCode(that.data.phonedeta.phone, function () {
      that.setData({
        isInCode: 0   // 已经发送后要过1分钟才能在发送
      })
      that.data.isInCode = 0
      setTimeout(() => {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        clearInterval(isCodeFun)
      }, 60000)
    });
  },
  //保存
  doSave:function(e){
    var that=this
    if (that.data.phonedeta.phone == "" || that.data.phonedeta.phone == undefined) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.phonedeta.phonecode == "" || that.data.phonedeta.phonecode == undefined) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.phonedeta.phone == that.data.mobile) {
      wx.showToast({
        title: '该手机号已经绑定',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (util.isPhone(that.data.phonedeta.phone) == false) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('accounts/changeWxMobile', {
      newMobile: that.data.phonedeta.phone,
      code: that.data.phonedeta.phonecode
    }, function (data) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          // var pages = getCurrentPages();
          // var prevPage = pages[pages.length - 2];
          // prevPage.setData({
          //   myphone: that.data.phonedeta.phone//要向上个页面传的参数！
          // })
          wx.setStorageSync('mobile', that.data.phonedeta.phone);
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)      
        }
      });
    });
  }
})