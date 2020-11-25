// pages/pushGuest/inviteFriends/inviteFriends.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inviteList:[],
    pages: {
      page: 0,
      size: 10
    },
    canLoadMore: true, //是否有下一页
    isOnload: false, //是否初始化加载
    invitePeople:{},
    isDisplayPeople:false,
    isToDeltel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(typeof (this.data.invitePeople));
    this.getGiideAccountById();
    this.getGiideAccountList();
    wx.hideShareMenu();
  },
  /* 获取邀请人用户*/
  getGiideAccountById:function(){
    var that = this;
    app.func.req('guide/getGiideAccountById', {}, function (data) {
      wx.stopPullDownRefresh();
      if (data){
        that.setData({
          invitePeople:data,
          isDisplayPeople:true
        })
      }
    })      
  },
  bindSearchStr: function (e) {
    if (e.detail.value){
      this.setData({
        phone: e.detail.value,
        isToDeltel:true
      });
    }else{
      this.setData({
        phone: e.detail.value
      });
    }
  },
  /*删除*/
  toDeltel:function(){
    this.setData({
      phone:'',
      isToDeltel: false
    }); 
    this.doSearch();
  },
  doSearch:function(){
    this.setData({
      inviteList: [],
      pages: {
        page: 0,
        size: 10
      },
      canLoadMore: true, //是否有下一页
      isOnload: false, //是否初始化加载      
    });
    this.getGiideAccountList();
  },
  /*受邀人列表*/
  getGiideAccountList:function(){
    var that = this;
    wx.showLoading({ title: '加载中', });
    app.func.req('guide/getGiideAccountList', {
      page: that.data.pages.page,
      size: that.data.pages.size,
      phone: that.data.phone ? that.data.phone:'',
    }, function (data) {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if(data){
        that.setData({
          totalElements: data.totalElements
        });
      }
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: data.totalElements > that.data.pages.size ? true : false,
          inviteList: data.content
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: data.totalElements > that.data.pages.size ? true : false,
          inviteList: that.data.inviteList.concat(data.content)
        });
      }
    })         
  },
  /*拨打回访电话*/
  callphone:function(e){
    console.log(e.currentTarget.dataset.mobile);
    if (e.currentTarget.dataset.mobile){
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.mobile,
      })
    }else{
      wx.showToast({
        title: '用户未绑定手机号码',
        icon: 'none',
        duration: 3000
      })   
    }
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
    this.getGiideAccountById();
    this.setData({
      inviteList: [],
      pages: {
        page: 0,
        size: 10
      },
      canLoadMore: true, //是否有下一页
      isOnload: false, //是否初始化加载      
    });
    this.getGiideAccountList();
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
      this.getGiideAccountList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '建筑人用建筑港，招工用工赚现金',
      path: "pages/index/index?inviteCode=" + wx.getStorageSync('openId'),
      imageUrl: "https://jianzhugang.oss-cn-shenzhen.aliyuncs.com/mini/newIcon/inviteShareImg.jpg",
      success: function (res) {
        wx.showToast({
          title: '邀请已发送，请耐心等待',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '邀请失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})