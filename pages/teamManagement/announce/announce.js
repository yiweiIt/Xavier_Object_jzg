// pages/announce/announce.js
const app = getApp()
Page({
 /** * 页面的初始数据*/
  data: {
    title:'',
    content:''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },
 /*标题*/
  bindCaption:function(e){
    var that = this;
    that.setData({
      title: e.detail.value
    });     
  },
  /*内容*/
  bindContent: function (e) {
    var that = this;
    that.setData({
      content: e.detail.value
    });
  },
  /*添加公告*/
  addTeamNews:function(){
    var that = this;
    if (!that.data.title) {
      wx.showToast({
        title: '公告标题不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.content) {
      wx.showToast({
        title: '公告内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    app.func.req('teamNews/addTeamNews', {
      title:that.data.title,
      content: that.data.content
    }, function (data) {
      if (data.code==200) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          }) 
        }, 3000);
      }else{
        wx.showToast({
          title: '保存失败',
          icon: 'success',
          duration: 2000
        });        
      }
    });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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