// pages/dl/dl.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '全部工种'
  },
  onclick: function (e) {
    var that = this;
    that.setData({
      state: e.currentTarget.dataset.id,
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name
    })
  },
  submit: function () {
    if (!this.data.id && this.data.publish) {
      wx.showToast({
        title: '请选择工种',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上一页面赋值
      id: this.data.id,
      name: this.data.name
    });
    if (this.data.work) {
      wx.setStorageSync('worktype', this.data.id)
      wx.setStorageSync('workname', this.data.name)
    }
    if (this.data.manage) {
      wx.setStorageSync('worktype_m', this.data.id)
      wx.setStorageSync('workname_m', this.data.name)
    }
    wx.navigateBack({//返回
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      publish: options.publish,
      manage: options.manage,
      work: options.work
    })
    this.getTeamType()
  },
  getTeamType: function () {
    var that = this;
    wx.showLoading({
      title: '数据加载中',
    })
    app.func.req('teamTypes/getAllList', {}, function (data) {
      wx.hideLoading()
      that.setData({
        show: true
      })
      if (!that.data.publish) {
        var all = { id: "quanbu", text: "全部", titles: [{ id: "", title: "全部工种" }] }
        data.unshift(all)
      }
      if (that.data.manage) {
        var d = data;
        data = [];
        data.push(d[0])
        data.push(d[4])
      }
      that.setData({
        worktype: data
      })
    });
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