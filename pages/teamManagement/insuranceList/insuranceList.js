const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages:{
      page:0,
      size:10
    },
    canLoadMore: true, //是否有下一页
    isOnload: false, //是否初始化加载
    isShow:false,
    insuranceList:[]
  },

  /*获取保单列表*/
  getViewPolicy:function(){
    var that = this;
    app.func.req('QHP/query', {
      page: that.data.pages.page,
      size: that.data.pages.size
    }, function (data) {
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: !data.last,
          insuranceList: data.content
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: !data.last,
          insuranceList: that.data.insuranceList.concat(data.content)
        });
      }
      wx.stopPullDownRefresh();
    });
  },
  goInsuranceInfo:function(e){
    console.log(e.currentTarget.dataset.name);
    wx.navigateTo({
      url: '../insuranceInfo/insuranceInfo?orderId=' + e.currentTarget.dataset.name
    })
  },
  /*跳转购买保险*/
  buyPolicy:function(){
    wx.navigateTo({
      url: '../insurance/insurance'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  this.getViewPolicy();
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
    this.defaultFunction();
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
    this.defaultFunction();
  },
 /*默认*/
  defaultFunction:function(){
    this.setData({
      pages: {
        page: 0,
        size: 10
      },
      insuranceList: [],
      canLoadMore: true,
      isOnload: false
    });
    this.getViewPolicy();
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
      this.getViewPolicy();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
