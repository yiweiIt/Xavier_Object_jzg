// pages/wd/changename/changename.js
const app = getApp();
Page({
  data: {
    isIncrease:true,
    total:'',
    type:1,
    page: {
      page: 0,
      size:10
    },
    pages: {
      page: 0,
      size: 10
    },
    pointsList:[],
    useList:[],
    pointsCanLoadMore: true, //是否有下一页
    pointsIsOnload: false,
    useCanLoadMore: true, //是否有下一页
    useIsOnload: false
  },
  /*选择积分增加*/
  bindIncrease:function(){
     this.setData({
       isIncrease: true,
       page: {
         page: 0,
         size: 10
       },
       pointsList: [],
       type: 1
     });
    this.queryScoreLogList();
  },
  /*选择积分消耗*/
  bindExpend: function () {
    this.setData({
      isIncrease: false,
      pages: {
        page: 0,
        size: 10
      },
      useList: [],
      type: 0
    });
    this.queryUseList();
  },

  /*获取积分信息*/
  queryScoreLogList:function(){
    var that = this;
    app.func.req('scoreLogs/queryScoreLogList', {
      type: 1,
      page: that.data.page.page,
      size: that.data.page.size
    }, function (data) {
      if (data.code==200){
        that.setData({
          total: data.total
        });
        if (that.data.pointsIsOnload) {
          that.setData({
            pointsCanLoadMore: !data.last,
            pointsList: data.data
          });
        } else {
          that.setData({
            pointsCanLoadMore: !data.last,
            pointsList: that.data.pointsList.concat(data.data)
          });
        }
      }
    });
  },
  /*获取积分消耗信息*/
  queryUseList: function () {
    var that = this;
    app.func.req('scoreLogs/queryScoreLogList', {
      type: 0,
      page: that.data.pages.page,
      size: that.data.pages.size
    }, function (data) {
      if (data.code == 200) {
        that.setData({
          total: data.total
        });
        if (that.data.useIsOnload) {
          that.setData({
            useCanLoadMore: !data.last,
            useList: data.data
          });
        } else {
          that.setData({
            useCanLoadMore: !data.last,
            useList: that.data.useList.concat(data.data)
          });
        } 
      }
    });
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryScoreLogList();
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
  onUnload: function (options) {

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
    if (this.data.type==1){
      if (this.data.pointsCanLoadMore) {
        this.setData({
          page: {
            page: ++this.data.page.page,
            size: this.data.page.size
          },
          pointsIsOnload: false
        });
        this.queryScoreLogList();
      }
    }else{
      if (this.data.useCanLoadMore) {
        this.setData({
          pages: {
            page: ++this.data.pages.page,
            size: this.data.pages.size
          },
          useIsOnload: false
        });
        this.queryUseList();
      }   
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})