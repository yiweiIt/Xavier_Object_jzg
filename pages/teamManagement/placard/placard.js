// pages/announcement/announcement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamNewsId:'',
    reading:0,
    queryTeamNews:[]
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },
  /*更新查看次数*/
  viewTimes:function(){
    var that = this; 
    app.func.req('teamNews/viewTimes', {
      id: that.data.teamNewsId
    }, function (data) {
       if(data){
          that.setData({
            reading:data
          });
       }
    });
  },

  /*获取公告列表*/
  queryTeamNewsPage: function () {
    var that = this;
    app.func.req('teamNews/queryTeamNewsById', {
      id: that.data.teamNewsId
    }, function (data) {
       if(data){
          that.setData({
            queryTeamNews: data
          });
       }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
        teamNewsId: options.id
     });
    this.viewTimes();
    this.queryTeamNewsPage();
    wx.hideShareMenu();
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