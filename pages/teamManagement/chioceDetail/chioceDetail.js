// pages/teamManagement/dailyQuestion/chioceDetail.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: '',
    height:'',
    chosen:'',
    answer:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    app.func.req('multipleChoice/getLogDetail', {
      id: options.id
    }, function (data) {
      if (data) {
        that.setData({
          item: data,
          chosen:data.chosen,
          answer:data.answer
        });
        var query = wx.createSelectorQuery();
        query.select('.answerSheet').boundingClientRect(function (res) {
          that.setData({
            height:res.height-33+'px'
          })  
       }).exec();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})