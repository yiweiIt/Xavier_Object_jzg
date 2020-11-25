// pages/announcement/announcement.js

var util = require('../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dateTime:'',
    memberId:'',
    pages:{
      page: 0,
      size:10
    },
    teamDispatch:[],
    array:[],
    arrayId:[],
    arrayIndex:0,
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
      dateTime:util.formatTime(new Date())
    });
    wx.hideShareMenu(); 
  },
  
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail)
    this.setData({
      dateTime: e.detail.value,
      teamDispatch:[],
      pages: {
        page: 0,
        size: 10
      },
      canLoadMore: true,
      isOnload: false
    });
    this.queryHireByMember();
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e);
    console.log(this.data.arrayId[e.detail.value]);
    this.setData({
      arrayIndex: e.detail.value,
      memberId:this.data.arrayId[e.detail.value],
      teamDispatch:[],
      pages: {
        page: 0,
        size: 10
      },
      canLoadMore: true,
      isOnload: false
    })
    this.queryHireByMember();
  },

  /**获取成员信息列表*/
  getMemberDispatchByTeam: function() {
    var that = this;
    app.func.req('teams/getMemberDispatchByTeamId', { }, function(data) {
      var array = ['全部'];
      var arrayId = [''];
      for(var i = 0; i<data.length;i++){
        var list = data[i].name;
        var listId = data[i].id;
        array.push(list);
        arrayId.push(listId);
      }
      that.setData({
        array:array,
        arrayId:arrayId
      });
      that.queryHireByMember();
    });
  },

  /*获取组员下派单*/
  queryHireByMember: function() {
    var that = this;
    app.func.req('teamDispatch/query', {
      page: that.data.pages.page,
      size: that.data.pages.size,
      memberId: that.data.memberId,
      date:that.data.dateTime
    }, function(data) {
      if(data.code==200){
        if(data.data.length==0){
          that.setData({
            teamDispatch:[],
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
    this.getMemberDispatchByTeam();//获取组员列表
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