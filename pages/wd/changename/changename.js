// pages/wd/changename/changename.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:[],
    name:'',
    openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
      this.setData({
        name: options.name,
        openId: options.openId,
      })
    if (that.data.name=="null"){
      this.setData({
        name:''
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
  onUnload: function (options) {

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

  },
  //修改姓名
  submitname:function(e){
    var that=this;
    this.setData({
      username: e.detail.value
    })
    that.userinfoSave();
  },
  //保存修改
  userinfoSave: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!this.data.username.username) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
   
    app.func.req('accounts/updateAccountByOpenId', {
      wxOpenId: that.data.openId,
      name: that.data.username.username
    }, function (data) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      });
    });
  }
})