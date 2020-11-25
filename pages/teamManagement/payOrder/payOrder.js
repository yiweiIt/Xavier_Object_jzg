const app = getApp()
Page({
  data: {
    contractsArr: [],
    page: {
      page: 0,
      size: 5
    },
    isIncrease:true,
    status:'ORDER_STATUS_SUBMITED,ORDER_STATUS_COMPANY_SURE,ORDER_STATUS_CONTRACT_SURE',
    canLoadMore: true, //是否有下一页
    isOnload: false //是否初始化加载
  },
  //订单类型切换
  saved:function(){
    this.setData({
      status:'ORDER_STATUS_SUBMITED,ORDER_STATUS_COMPANY_SURE,ORDER_STATUS_CONTRACT_SURE',
      contractsArr: [],
      page: {
        page: 0,
        size: 5
      },
      isIncrease:true,
      canLoadMore: true, //是否有下一页
      isOnload: false //是否初始化加载
    });
    this.getOrderByAccId();
  },
  submitted:function(){
    this.setData({
      status:'ORDER_STATUS_TEAM_RECEIVED',
      contractsArr: [],
      page: {
        page: 0,
        size: 5
      },
      isIncrease:false,
      canLoadMore: true, //是否有下一页
      isOnload: false //是否初始化加载
    });
    this.getOrderByAccId();
  },
  /*查询已签约的合约*/
  getOrderByAccId: function () {
    var that = this;
    app.func.req('contractOrders/getOrderByAccId', {
      status:that.data.status,
      page: that.data.page.page,
      size: that.data.page.size
    }, function (data) {
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: data.totalElements > that.data.page.size ? true : false,
          contractsArr:data.content
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: data.totalElements > that.data.page.size ? true : false,
          contractsArr: that.data.contractsArr.concat(data.content)
        });
      }
    });
  },

  //查看已提交工资订单
  

  goOrderInfo:function(e){
     wx.navigateTo({
       url: '../payOrderInfo/payOrderInfo?id=' + e.currentTarget.dataset.id
     })   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderByAccId();
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          page: ++this.data.page.page,
          size: this.data.page.size
        },
        isOnload: false
      });
      this.getOrderByAccId();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})