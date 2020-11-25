// pages/jxxq/jxxq.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    machinerieInfo: {},
    machinerieId: 0,
    kefuWeChat: 'Jzg-hg',
    phone: ''
  },
  /**
   * 获取机械详情
   */
  getMachinerieInfo: function () {
    var that = this;
    app.func.req('machineAsks/get', {
      id: that.data.machinerieId
    }, 
    function (data) {
      that.setData({
        machinerieInfo: data,
        phone: data.mobile
      });
    });
  },


  doPublish: function () {
    wx.redirectTo({
      url: '../jxlb/jxlb?type='+ 2
    });
  },


  goIndex: function () {
    wx.redirectTo({
      url: "../jxlb/jxlb"
    });
  },


  doCallAbc: function () {
    wx.makePhoneCall({
      phoneNumber: '4008 - 6060 - 25'
    })
  },


  doCallPhone: function () {
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.machinerieInfo.mobile
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      machinerieId: options.id
    });
    this.getMachinerieInfo();
  },

})