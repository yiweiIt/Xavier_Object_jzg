// pages/getintegral/getintegral.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishide:false,
    openid: '' //  用户id
  },

  /****签到 */
  singIn: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req3('scores/wxClock', {}, function (data) {
        if (data.error) {
        } else {
          wx.showToast({
            title: '签到成功，获得2积分',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../wd/wd',
            })
          }, 1500) 
         
        }
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRealStatus();
    this.todayCanClock();
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
  onShareAppMessage: function (ops) {
    var that = this;
    that.data.openid = wx.getStorageSync('openId');
    let share = ops.target.dataset['share'];
    if(share==1){
      return {
        title: '建筑行业综合服务商',
        path: "pages/auth/auth?openid=" + that.data.openid
      }
    }else{
      // 直接给用户加积分
      if (app.isBindPhone()) {
        app.func.req3('scores/wxShare', {}, function (data) {
          if (!data.error) {
            wx.showToast({
              title: '恭喜你，获得2积分',
              icon: 'none',
              duration: 1500
            })
          }
        })
        return {
          title: '建筑行业综合服务商',
          path: "pages/index/index"
        }
      }
    }
    
  },

  // 获取实名认证状态
  getRealStatus: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req('accounts/myProfile', {}, function (data) {
        that.setData({
          id: data.id
        })
      })
    })
  },

  /****是否签到 */
  todayCanClock: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req('scoreLogs/todayCanClock', {}, function (data) {
        if (data==true) {
          that.setData({
            ishide: true
          })
        } else {
        }
      });
    })
  },
})