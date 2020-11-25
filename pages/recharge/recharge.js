// pages/recharge/recharge.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_modal_Hidden: true,
    mScore: 0,
    userInfo: null,
    username: null,
    scoreRatio : 1,
    total:0,
    use:0,
    usepay:0,
    ip: null
  },
  getScore: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req('scores/getScoreByAccId', {}, function (data) {
        if(!data.error){
          that.setData({
            mScore: data.currentScore
          });
        }
      });
    })
  },
  
  getScoreRatio: function(){
    var that = this;
    app.func.req('scores/getScoreRatio', {}, function (data) {
      that.setData({
        scoreRatio : data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getScore();
    this.getScoreRatio();
    this.setData({
      username: app.globalData.mPhone
    })
  },
  /** 金额类型选择 */
  changeclick: function(e) {
    var that = this;
    that.setData({
      use: e.currentTarget.dataset.name,
      usePay: e.currentTarget.dataset.name/100,
      type: e.currentTarget.dataset.type
    });
    util.paymentMethod('', app.globalData.openId, e.currentTarget.dataset.type, e.currentTarget.dataset.name).catch(error => {
      that.setData({
        is_modal_Hidden: true
      });
    })
      .then(value => {
        if (value == 2) {/*有余额，可显示积分兑换，显示弹框*/
          wx.showToast({
            title: '成功充值' + (e.currentTarget.dataset.name / 100)+'元',
            icon: 'success',
            duration: 2000
          });
          that.getScore();
        } else {/*付款成功*/
          if (value != undefined) {
            that.setData({
              is_modal_Hidden: false,
              total: value / 100,/*推客积分剩余金额*/
              use: e.currentTarget.dataset.name,
              usePay: e.currentTarget.dataset.name / 100/*需要使用推客积分*/
            });
          }
        }
      })
  },
  modal_click_Hidden:function(){
    this.setData({
      is_modal_Hidden: true
    });
  },
  /*使用微信支付*/
  payDirectly:function(){
    var that = this;
    that.setData({
      is_modal_Hidden: true
    });
    util.getWechatIP('', app.globalData.openId, that.data.use).catch(error => {
      wx.showToast({
        title: '操作失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
    .then(value => {
      if (value == 1) {
        wx.showToast({
          title: '充值成功' + that.data.usePay + '元',
          icon: 'success',
          duration: 2000
        });
        that.getScore();
      }
    })
  },
  balancePayment:function(){
    var that = this;
    that.setData({
      is_modal_Hidden: true
    });
    util.balancePayment('', that.data.type).catch(error => {
      wx.showToast({
        title: '操作失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
      .then(value => {
        if (value == 1) {
          wx.showToast({
            title: '成功充值' + that.data.usePay + '元',
            icon: 'success',
            duration: 2000
          });
          that.getScore();
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

})