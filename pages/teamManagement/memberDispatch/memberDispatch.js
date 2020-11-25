// pages/announcement/announcement.js

var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberId:'',
    pages:{
      page: 0,
      size: 10
    },
    teamDispatch:[],
    type:'',
    name:'',
    canLoadMore: true, //是否有下一页
    isOnload: false //是否初始化加载
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)

  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type,
      name: options.name,
      memberId: options.id
    });
    wx.hideShareMenu(); 
  },
  
  /*获取组员下派单*/
  queryHireByMember: function() {
    var that = this;
    app.func.req('teamDispatch/query', {
      page: that.data.pages.page,
      size: that.data.pages.size,
      memberId: that.data.memberId
    }, function(data) {
      if(data.code==200){
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            teamDispatch: data.data
          });
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          that.setData({
            canLoadMore: !data.last,
            teamDispatch: that.data.teamDispatch.concat(data.data)
          });
        }
      }
    });
  },

  /*修改派单状态*/
  updateHireStatus: function(e) {
    var that = this;
    app.func.req('teamDispatch/updateHireStatus', {
      id: e.currentTarget.dataset.id,
      status: 'HIRE_TYPE_CLOSE'
    }, function(data) {
      if (data.code == 200) {
        that.setData({
          teamDispatch:[],
          pages: {
            page: 0,
            size: 10
          },
          canLoadMore: true,
          isOnload: false
        });
        that.queryHireByMember();
      }
      wx.showToast({
        title: data.msg,
        icon: 'none',
        duration: 2000
      })
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
   this.queryHireByMember();
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
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },

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