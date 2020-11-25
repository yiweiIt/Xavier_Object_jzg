
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pages:{
      page: 0,
      size:10
    },
    choiceLogs:[],
    canLoadMore: true, //是否有下一页
    isOnload: false //是否初始化加载
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu(); 
  },
  
  goChoiceDetail: function (e) {
    console.log(e.currentTarget.dataset.name,"========")
    wx.navigateTo({
      url: '../chioceDetail/chioceDetail?id=' + e.currentTarget.dataset.name
    })
  },

  getMultipleChoiceLogs: function() {
    var that = this;
    app.func.req('multipleChoice/getMultipleChoiceLogs', {
      page: that.data.pages.page,
      size: that.data.pages.size
    }, function(data) {
      if(data.code==200){
        if(data.data.length==0){
          that.setData({
            choiceLogs:[],
            pages: {
              page: 0,
              size: 10
            },
            canLoadMore: true,
            isOnload: false
          });               
        }else{
          if (that.data.isOnload) {
            that.setData({
              canLoadMore: !data.last,
              choiceLogs: data.data
            });
            wx.pageScrollTo({
              scrollTop: 0
            })
          } else {
            that.setData({
              canLoadMore: !data.last,
              choiceLogs: that.data.choiceLogs.concat(data.data)
            });
          }
        }
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
    this.setData({
      pages: {
        page: 0,
        size: this.data.pages.size
      },
      isOnload: true
    });
    this.getMultipleChoiceLogs();
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('页面上拉触底事件的处理函数');
    if (this.data.canLoadMore) {
      this.setData({
        pages: {
          page: ++this.data.pages.page,
          size: this.data.pages.size
        },
        isOnload: false
      });
      this.queryHireByMember();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})