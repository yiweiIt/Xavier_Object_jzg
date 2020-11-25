const app = getApp()
Page({
  data: {
     orderId:'',
     orderDetail:[]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId:options.id
    });
    this.getOrderDetail();
    wx.hideShareMenu();
  },
  /*获取订单详情*/
  getOrderDetail: function () {
    var that = this;
    app.func.req('contractOrders/getOrderDetail', {
      id: that.data.orderId
    }, function (data) {
      if(data){
        that.setData({
          orderDetail:data
        });
      }
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