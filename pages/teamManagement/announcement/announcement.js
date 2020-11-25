// pages/announcement/announcement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     type:'',
     queryTeam:[],
     page: {
       page: 0,
       size:10
     },
    canLoadMore: true, //是否有下一页
    isOnload: true //是否初始化加载
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },

  /*获取公告列表*/
  queryTeamNewsPage:function(){
    var that = this;
    if (that.data.type == 'MEMBER'){
         var role = 2;
    }else{
      var role = 1;
    }
    app.func.req('teamNews/queryTeamNewsPage', {
      role: role,
      page: that.data.page.page,
      size: that.data.page.size
    }, function (data) {
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: data.totalElements > that.data.page.size ? true : false,
            queryTeam: data.content
          });
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          that.setData({
            canLoadMore: data.totalElements > that.data.page.size ? true : false,
            queryTeam: that.data.queryTeam.concat(data.content)
          });
        }          
    });
  },
  /**点击进入发布公告*/
  goAnnouncet: function () {
    wx.navigateTo({
      url: '../announce/announce'
    })
  },

  intoPlacard:function(e){
    console.log(e.currentTarget.dataset.name);
    wx.navigateTo({
      url: '../placard/placard?id=' + e.currentTarget.dataset.name
    })
  },
  bindDelete:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除这条公告吗？',
      success(res) {
        if (res.confirm) {
          app.func.req('teamNews/deleteTeamNews', {
            id:e.currentTarget.dataset.name
          }, function (data) {
            that.queryTeamNewsPage();
            if(data.code==200){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              });
            }else{
              wx.showToast({
                title: '删除失败',
                icon: 'success',
                duration: 1500
              });              
            }
          });
        } else if (res.cancel) {
           
        }
      }
    })  
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryTeamNewsPage();
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
    console.log('下拉公告');
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          page: ++this.data.page.page,
          size: this.data.page.size
        },
        isOnload: false
      });
      this.queryTeamNewsPage();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})