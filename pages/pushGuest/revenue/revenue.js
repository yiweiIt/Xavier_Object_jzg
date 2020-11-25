// pages/pushGuest/revenue/revenue.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: {
      page: 0,
      size: 10
    },
    canLoadMore: true, //是否有下一页
    isOnload: false, //是否初始化加载
    revenueList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGiideAccountById();
  },
  /* 获取取现列表 1：收入 2：取现*/
  getGiideAccountById: function () {
    var that = this;
    wx.showLoading({ title: '加载中', });
    app.func.req('transact/getTransactionFlowList', {
      type:1,
      page: that.data.pages.page,
      size: that.data.pages.size
    }, function (data) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: data.totalElements > that.data.pages.size ? true : false,
          revenueList: data.content
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: data.totalElements > that.data.pages.size ? true : false,
          revenueList: that.data.revenueList.concat(data.content)
        });
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
    this.setData({
      pages: {
        page: 0,
        size: 10
      },
      canLoadMore: true, //是否有下一页
      isOnload: false, //是否初始化加载
      revenueList: []
    });
    this.getGiideAccountById();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.canLoadMore) {
      this.setData({
        pages: {
          page: ++this.data.pages.page,
          size: this.data.pages.size
        },
        isOnload: false
      });
      this.getGiideAccountById();
    }
  }
})