// pages/announcement/announcement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shareId:'',
    openId:'',
    token:'',
    teamType:'',
    name:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.teamId);
    that.setData({
      shareId:options.teamId,
      teamType:options.teamType,
      name:options.name
    });
    wx.login({
      success (res) {
        if (res.code) {
          app.func.req('wxs/getOpenId', {
            code: res.code
          }, function (data) {
            wx.setStorageSync('openId', data.openid)
            wx.setStorageSync('token', data.token);
            that.setData({
              openId: data.openid,
              token:data.token
            })
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  joinTeam:function(){
    var that = this;
    app.func.req('members/joinTeam', {
      teamId: that.data.shareId
    }, function (data) {
      console.log(data);
      if(data.code==200){
        wx.redirectTo({
          url: '../group/group?teamId='+that.data.shareId+'&type=MEMBER&isshare=1'
        }) 
      }else{
        wx.showToast({
          title: '加入班组失败',
          icon: 'none',
          duration: 1500,
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