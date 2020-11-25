// pages/userdetail/userdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    array:[{ name: '男',value: '1' }, { name: '女',value: '2' }],
    // name: '',//修改之后的姓名
    nickName: ''//获取的微信名

    },

  getDatail: function(){
    var that = this;
    var token = wx.getStorageSync('token');
    let userInfo = wx.getStorageSync('userInfo');
      that.setData({
        userInfo,
        openId: wx.getStorageSync('openId')
      })
    if (wx.getStorageSync('token')) {
      app.func.req('accounts/myProfile', {}, function (data) {
        that.setData({
          data: data
        })
      })

    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that=this;
    // let data = that.data.data
    // data.name = options.nickName
    // that.setData({
    //   data
    // })
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
    this.getDatail();
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

  },
  /*进入头像详情*/
  // getAvatar:function(e){
  //   wx.navigateTo({
  //     url: '/pages/wd/avatar/avatar?src=' + e.currentTarget.dataset.src
  //   })
  // },

  chooseimage: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照','使用微信头像'],
      itemColor: "#666",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          } else if (res.tapIndex == 2){
            that.getAvatarUrl();
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        wx.navigateTo({
          url: '/pages/wd/lightClip/lightClip?src=' + res.tempFilePaths[0]
        })
      }
    })
  },
  /*获取微信头像*/
  getAvatarUrl:function(){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var avatarUrl = res.userInfo.avatarUrl;
        app.func.req('accounts/updateAvatar', {
          wxavatarUrl:avatarUrl
        }, function (data) {
          if (data.code==200){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            });
            that.getDatail();
          }else{
            wx.showToast({
              title: '修改失败',
              icon: 'success',
              duration: 2000
            });
          }
        });
      }
    })
  },


  bindName: function (e) {
   wx.navigateTo({
     url: '/pages/wd/changename/changename?name=' + this.data.data.name + '&openId=' + this.data.openId
   })
  },
  //修改手机号
  changphone: function () {
      wx.navigateTo({
        url: '/pages/wd/changephone/changephone?openId=' + this.data.openId + '&mobile=' + this.data.data.mobile
      })
  },
  //性别切换
  bindgender: function (e) {
    var that=this
    let userInfo = this.data.userInfo;
    userInfo.gender = this.data.array[e.detail.value].value
    this.setData({
      userInfo,
    })
    that.userinfoSave();
  },
  //保存修改
  userinfoSave:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('accounts/updateAccountByOpenId', {
      wxOpenId: that.data.openId,
      // gender: parseInt(that.data.userInfo.gender)
     gender: that.data.userInfo.gender
    }, function (data) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500,
          complete: function () {
          }
        });
      wx.setStorageSync('userInfo', that.data.userInfo)
      setTimeout(function () {
        that.getDatail();
      }, 1500)
    });
  }
})
