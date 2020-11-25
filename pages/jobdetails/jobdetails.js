// pages/jobdetails/jobdetails.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machineWantInfo: {},
    machineWantId: 0,
    showPhone: false,
    scoreRatio: 100,
    phone: '',
    kefuWeChat: 'Jzg-hg',
    hiddenmodalput: true,
    remark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.getKeFuWeChat()
    this.setData({
      machineWantId: options.id
    });
    this.gopeopleDateil();
    this.getHireReportCategory();
    app.func.req('wxs/getWechatIP', {}, function(data) {
      if (data) {
        that.setData({
          ip: data
        })
      }
    });
  },

  goIndex: function() {
    wx.redirectTo({
      url: '../jxlb/jxlb',
    })
  },

  // 获取客服微信
  getKeFuWeChat: function() {
    var that = this;
    app.func.req('dicts/getKeFuWeChat', {}, function(data) {
      if (data) {
        that.setData({
          kefuWeChat: data.text
        })
      }
    });
  },

  // 复制微信号
  copyText: function (e) {
    console.log(e);
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  gopeopleDateil: function() {
    var that = this;
    app.func.req("machine/machinerWants/wxQueryMachineWantById", {
      id: that.data.machineWantId
    }, function(data) {
      if (data) {
        that.setData({
          machineWantInfo: data,
          contract: '建筑港',
          phone: data.phone,
          showPhone: data.showPhone,
          machineType: data.machineType.replace(/-/g, '')
        })
      }
    })
  },

  // 拨打电话
  Callphone: function() {
    var that = this;
    var phoneNumber = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  payMoney: function() {
    var that = this;
    app.isBind().then(value => {
      app.func.req('wxs/getPayPrepay', {
        openid: app.globalData.openId,
        total_fee: that.data.scoreRatio,
        spbill_create_ip: that.data.ip,
        payType: 7,
        machineWantId: that.data.machineWantId
      }, function(data) {
        if (data) {
          console.log(data)
          that.doWxPay(data)
        }
      })
    })
  },

  doWxPay: function(param) {
    var that = this;
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      appId: param.appId,
      success: function(res) {
        setTimeout(function() {
          that.getContactPhone();
        }, 2000)
      },
      fail: function(error) {
        console.log("支付失败");
        console.log(error)
      },
      complete: function() {
        console.log("支付完成");
        console.log(error)
      }
    });
  },

  // 获取完整手机号
  getContactPhone: function() {
    var that = this;
    app.func.req("machine/machinerWants/getMachineWantFullPhone", {
      machineWantId: that.data.machineWantId
    }, function(data) {
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
        setTimeout(function() {
          wx.hideToast()
        }, 1000);
      }
    })
  },

  goPublish: function(e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../machinepublish/machinepublish?id=' + e.currentTarget.dataset.name
      })
    })
  },

  onShareAppMessage: function(ops) {
    var that = this;
    if (app.isBindPhone()) {
      app.func.req3('scores/wxShare', { }, function(data) {
        if (!data.error) {
          wx.showToast({
            title: '恭喜你，获得2积分',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    return {
      title: '建筑港机械手信息',
      path: '/pages/jobdetails/jobdetails?id=' + that.data.machineWantId,
      success: function(res) { // 转发成功
      },
      fail: function(res) { // 转发失败
      }
    }
  },

  doCallAbc: function() {
    wx.makePhoneCall({
      phoneNumber: '4008 - 6060 - 25'
    })
  },

  getHireReportCategory: function() {
    var that = this;
    app.func.req('dicts/getDictsByCategory', {
      categoryKey: "HIRE_REPORT" }, function(data) {
      if (data) {
        that.setData({
          reportCategorys: data
        })
      }
    });
  },

  // 获取举报弹窗
  Complain: function() {
    app.isBind().then(value => {
      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
      })
    })
  },

  radioChange: function(e) {
    this.setData({
      mReportCategory: e.detail.value
    })
    if (this.data.mReportCategory == 'HIRE_REPORT_3') {
      this.setData({
        isremark: true
      })
    } else {
      this.setData({
        isremark: false
      })
    }
  },

  bindinputValue: function(e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },

  //取消按钮
  cancel: function(e) {
    this.setData({
      hiddenmodalput: true
    });
  },

  //确认按钮
  confirm: function(e) {
    if (this.data.mReportCategory == "") {
      wx.showToast({
        title: '请选择一条要举报内容！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      hiddenmodalput: true
    });
    var that = this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('hireReports/addReport', {
          code: res.code,
          machinerWantId: that.data.machineWantId,
          reportCategory: this.data.mReportCategory,
          remark: this.data.remark || ''
        }, function(data) {
          if (data) {
            wx.showToast({
              title: '举报成功',
              icon: 'success',
              duration: 3000
            })
          }
        })
      }
    })
  }
})
