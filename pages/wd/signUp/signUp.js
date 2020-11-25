const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    signUpList:[],
    pages:{
       page:0,
       size:10
    },
    canLoadMore: true, //是否有下一页
    isOnload: false //是否初始化加载
  },
  /*查询*/
  signUpList:function(){
    var that = this;
    app.func.req('hireApplys/query', {
      page:that.data.pages.page,
      size:that.data.pages.size
    }, function (data) {
      if(data.code==200){
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            signUpList: data.data
          });
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          that.setData({
            canLoadMore: !data.last,
            signUpList: that.data.signUpList.concat(data.data)
          });
        }
      }
    });    
  },

  goHireDetail: function(e) {
    console.log(e.currentTarget.dataset.hirestatus);
    if(e.currentTarget.dataset.hirestatus!='HIRE_TYPE_AUDITED'){
      wx.showToast({
        title: '抱歉！该项目已招满',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.navigateTo({
        url: '../../../pages/hireDetail/hireDetail?id=' + e.currentTarget.dataset.name
      })     
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.signUpList();
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
    console.log('页面上拉触底事件的处理函数');
    if (this.data.canLoadMore) {
      this.setData({
        pages: {
          page: ++this.data.pages.page,
          size: this.data.pages.size
        },
        isOnload: false
      });
      this.signUpList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})