// pages/integral/integral.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',//  用户id
    isDrawLucky:false
  },
  /****签到 */
  checkIn: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req3('scores/wxClock', {}, function (data) {
        if (data.error) {
          wx.showToast({
            title: '温馨提示！',
            content: data.message,
          })
        } else {
          wx.showToast({
            title: '签到成功，获得3积分',
            icon: 'none',
            duration: 2000
          })
        }
      });
    })
  },
  /*判断是否显示积分抽奖转盘*/
  drawLucky:function(){
    var that = this;
    app.func.req('wxs/drawLucky', {}, function (data) {
      if(data==0){
        that.setData({
           isDrawLucky:false
         });
      }else{
        that.setData({
          isDrawLucky:true
        });
      }
    })
  },


  /** 积分充值跳转 */
  rechargeMoney: function () {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../recharge/recharge'
      })
    })
  },

  doCallAbc: function () {
    wx.makePhoneCall({
      phoneNumber: '4008 - 6060 - 25'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.drawLucky();
    wx.getSystemInfo({
      success(res) {
        that.setData({
          platform: res.platform
        });
      }
    })
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
    if (ops.from === 'button') {
      console.log(ops.target);
      return {
        title: '中国建筑行业第一平台',
        path:"pages/auth/auth?openid=" + that.data.openid,
        imageUrl: "https://static.jianzhugang.com/mini/image/indexShare.jpg",
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
    } else {/*右上角分享*/
      if (app.isBindPhone()) {
        app.func.req3('scores/wxShare', {}, function (data) {
          if (!data.error) {
            wx.showToast({
              title: '恭喜你，获得3积分',
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
  }
})
