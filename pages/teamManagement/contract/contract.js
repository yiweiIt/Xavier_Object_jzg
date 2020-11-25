const app = getApp()
Page({
  data: {
    judgeDisplay:false,
    contractsArr:[]
  },
  /*查询已签约的合约*/
  contracts:function(){
    var that = this;
    app.func.req('contracts/query', {
      status:'CONTRACT_STATUS_SIGNED',
      type:'TEAM',
      page:0,
      size:99
    }, function (data) {
      if (data.length>0) {
          that.setData({
            judgeDisplay:false,
            contractsArr: data
          });
      }else{
        that.setData({
          judgeDisplay:false
        });       
      }
    });    
  },
  /*去付款*/
  goToPay:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../toPay/toPay?id=' + e.currentTarget.dataset.name
    })   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.contracts();
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
    this.contracts();
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