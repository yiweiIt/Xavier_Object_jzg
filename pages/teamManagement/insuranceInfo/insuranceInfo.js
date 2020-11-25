// pages/teamManagement/insuranceInfo/insuranceInfo.js
const app = getApp()
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })
    this.getWechatIP();
    this.getInfo();
  },

  // 获取用户IP
  getWechatIP: function () {
    var that = this;
    app.func.req('wxs/getWechatIP', {}, function (data) {
      if (data) {
        that.setData({
          ip: data
        })
      }
    })
  },
  /*去付款*/
  buyInsurance: function () {
    var that = this;
    app.func.req('wxs/getPayPrepay', {
      openid: app.globalData.openId,
      insOrderId: that.data.orderId,
      total_fee: 0,
      spbill_create_ip: that.data.ip,
      payType: 12
    }, function (data) {
      that.doWxPay(data);
    })
  },
  doWxPay: function (param) {
    var that = this;
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      appId: param.appId,
      success: function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        wx.redirectTo({
          url: '../insurancePay/insurancePay?orderId=' + that.data.orderId
        })
      },
      fail: function (error) {
        console.log("支付失败");
        console.log(error)
      },
      complete: function () {
        console.log("pay complete")
      }
    });
  },
 /*获取预订单信息*/
  getInfo:function(){
    var that = this;
    app.func.req('QHP/getInfo', {
      orderId: that.data.orderId
    }, function (data) {
      if (data.code==200){
        that.setData({
          info: data.data,
          orderUrl: data.data.docUrl,
          listArr: data.data.memberInfo,
          plan: data.data.plan == 1 ? '方案一' : data.data.plan == 2 ? '方案二' : data.data.plan ==3 ? '方案三':''
        });
      }
    });
  },
  //拨打客服电话
  callCustomer: function () {
    console.log(123);
    wx.makePhoneCall({
      phoneNumber: '4008606025'
    })
  },
  /*查看电子保单*/
  getFile:function(e){
    if (this.data.orderUrl){
      util.downLoadFile(this.data.orderUrl);
    }else{
      wx.showToast({
        title: '保单生成失败，请联系客服人员',
        icon: 'none',
        duration: 2000
      }); 
    }
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

  }
})