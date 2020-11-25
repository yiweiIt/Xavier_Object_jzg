// pages/bztdxq/bztdxq.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamInfo: {},
    showPhone: false,
    scoreRatio: 100
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.getTeamInfo(options.id);
    if(options.phone){
      this.setData({
        judgeMentType: options.phone
      })
    }else{
    }
    // 获取用户IP
    app.func.req('wxs/getWechatIP', {}, function (data) {
      if (data) {
        that.setData({
          ip: data
        })
      }
    });
  },
  /*拨打电话*/
  makePhoneCall:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.name 
    })
  },
  /**
   * 获取 班组详情
   */
  getTeamInfo: function(teamId) {
    var that = this;
    app.isAuthorize().then(value => {
      app.func.req('teams/wxQueryTeamById', {
        teamId: teamId
      }, function (data) {
        that.setData({
          teamInfo: data,
          showPhone: data.showPhone,
          phone: data.phone
        });
      });
    })
  },
  payMoney: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req('wxs/getPayPrepay', {
        openid: app.globalData.openId,
        total_fee: that.data.scoreRatio,
        spbill_create_ip: that.data.ip,
        payType: 3,
        teamId: that.data.teamInfo.id
      }, function (data) {
        if (data) {
          console.log(data)
          that.doWxPay(data)
        }
      })
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
        setTimeout(function () {
          that.getContactPhone();
        }, 2000)
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
  // 获取完整手机号
  getContactPhone: function () {
    var that = this;
    app.func.req("teams/getTeamFullPhone", {
      teamId: that.data.teamInfo.id,
      
    }, function (data) {
      if (!data.error) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          phone: data.phone,
          showPhone: data.showPhone
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1000);
      }
    })
  },
  callphone: function (e) {
    var that = this;
    var phoneNumber = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },
})