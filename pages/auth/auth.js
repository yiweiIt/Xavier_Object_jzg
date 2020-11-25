// pages/auth/auth.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: ''//邀请人的oenid
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //邀请
    if (options.openid) {
      that.setData({
        openid: options.openid,
      })
    }
    //快速认证通道
    if (options.optionName) {
      that.setData({
        openName: options.optionName,
      })
    }
    //班组管理推广跳转
    if (options.optionTeam) {
      that.setData({
        optionTeam: options.optionTeam,
      })
    }
    that.getSetting();
  },
  /*查看是否授权*/
  getSetting:function(){
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
            }
          })
        }
      }
    })
  },
  /*判断引导式是否登录*/
  guideAccountInfo:function(){
    if (!app.globalData.guideOpenIdFlag){
      app.guideAccount();
    }else{
      return;
    }
  },

  bindGetUserInfo: function (e) {
    var that=this;
    if (e.detail.userInfo){
      wx.setStorageSync('userInfo', e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo;
      that.allUserInfo();
      wx.showToast({
        title: '授权成功',
        icon: 'success',
        duration: 2000,
        complete: function(){
          setTimeout(()=>{
            if (wx.getStorageSync('isBindMobile')){
              if (that.data.optionTeam){
                wx.reLaunch({
                  url: '../index/index?scene=' + that.data.optionTeam
                })
              }else{
                wx.navigateBack({
                  delta: 1
                })
              }
            } else {
              wx.switchTab({
                url: '../index/index'
              });
            }
          }, 1500)
        }
      })
    } else{
      wx.showToast({
        title: e.detail.errMsg,
        icon: 'none',
        duration: 1500
      })
      wx.switchTab({
        url: '../wd/wd',
      })
    }
  },

  /*获取用户所有信息*/
  allUserInfo:function(){
    var that = this;
    // 获取后台的用户信息
    wx.login({
      success: function (res) {
        console.log("AllUserInfo()==>>res.code:" + res.code); //五分钟的code，发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getUserInfo({
          withCredentials: true,
          success: function (res_user) {
            wx.setStorageSync('userInfo', res_user.userInfo);
            app.globalData.userInfo = res_user.userInfo;
            app.func.req('accounts/wechatAccountSignUp', {
              code: res.code,
              avatarUrl: res_user.userInfo.avatarUrl ? res_user.userInfo.avatarUrl : 'test',
              gender: res_user.userInfo.gender ? res_user.userInfo.gender : 'test',
              nickName: res_user.userInfo.nickName ? res_user.userInfo.nickName: 'test',
            }, function (data) {
              if (data) {
                app.globalData.openId = data.openid;
                
                wx.setStorageSync('openId', data.openid)
                wx.setStorageSync('token', data.token);
                app.globalData.mAccId = data.accountId;
                app.globalData.token = data.token;
                if (data.mobile) {
                  app.globalData.mPhone = data.mobile;
                  wx.setStorageSync('mobile', data.mobile);
                  wx.setStorageSync('isBindMobile', true);
                }
                that.guideAccountInfo();
              } else {
                wx.removeStorageSync('token');
                wx.removeStorageSync('isBindMobile');
                wx.removeStorageSync('mobile');
                app.globalData.mAccId = '';
                app.globalData.token = '';
              }
            });
          }
        })
      }
    })
  },
})
