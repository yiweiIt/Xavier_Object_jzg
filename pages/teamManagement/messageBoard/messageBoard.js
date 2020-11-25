// pages/announcement/announcement.js
const app = getApp()
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 'calc(100vh - 200rpx)',
    type:'',
    page:{
      page:0,
      size:10
    },
    inputBottom:0,
    saveContent:'',
    toView:'',
    msgList:[],
    msgCanLoadMore: true, //是否有下一页
    msgIsOnload: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    });
    wx.hideShareMenu();
  },
  
  /*获取聊天记录*/
  getChatLogs:function(){
    var that = this;
    app.func.req('chatLogs/getChatLogs', {
      type: that.data.type,
      page:that.data.page.page,
      size:that.data.page.size
    }, function (data) {
      if (that.data.msgIsOnload) {
        that.setData({
          msgCanLoadMore: !data.last,
          msgList:data.data,
          toView: 'msg-' + (data.data.length - 1)
        });
      } else {
        that.setData({
          msgCanLoadMore: !data.last,
          toView: 'msg-' + (data.data.length - 1),
          msgList: data.data.concat(that.data.msgList)
        });
      } 
    });      
  },
  bindSave: function(e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      saveContent: e.detail.value
    });
  },
/**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height*750 / wx.getSystemInfoSync().windowWidth;
    this.setData({
      scrollHeight: 'calc(100vh - '+ (keyHeight+200)+'rpx)'
    });
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1),
      inputBottom: e.detail.height|| 0
    })
  },
 

  //失去聚焦(软键盘消失)
  blur: function(e) {
    // wx.onKeyboardConfirm(function callback);
    console.log('失去聚焦');
    this.setData({
      scrollHeight: 'calc(100vh - 200rpx)',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    })
  },

  /*发布聊天*/
  save:function(){
    var that = this;
    if (!that.data.saveContent) {
      wx.showToast({
        title: '请先输入内容',
        icon: 'none',
        duration: 2000
      })
      return;
    } 
    app.func.req('chatLogs/save', {
      type: that.data.type,
      content:that.data.saveContent
    }, function (data) {
       that.setData({
          saveContent:'',
          page:{
            page:0,
            size:10
          },
          toView:'',
          msgList:[],
          msgCanLoadMore: true, //是否有下一页
          msgIsOnload: false
       });
       that.getChatLogs();
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
    this.getChatLogs();
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
    wx.stopPullDownRefresh();
     if (this.data.msgCanLoadMore) {
      this.setData({
        page: {
          page: ++this.data.page.page,
          size: this.data.page.size
        },
        msgIsOnload: false
      });
      this.getChatLogs();
    }else{
      wx.showToast({
        title: '没有更多记录了',
        icon: 'loading',
        duration: 2000
      })
    }
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
