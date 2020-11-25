const app = getApp();
// pages/kbjzgxq/kbjzgxq.js
Page({
  data: {
    hireInfo: {},
    hireId: 0,
    hireStatusIdx: 0,
    isOrdinary:true,
    hiddenStamp:true,//发布招工类型说明
    hireStatus: []
  },

  onLoad: function(options) {
    this.setData({
      hireId: options.id,
      phone: wx.getStorageSync('mobile')
    });
    this.getKeFuWeChat();
    this.getHireInfo();
    wx.hideShareMenu();
  },
/*顶部微信号*/
  getKeFuWeChat: function () {
    var that = this;
    app.func.req('dicts/getKeFuWeChat', {
    }, function (data) {
      if (data) {
        that.setData({
          kefuWeChat: data.text
        })
      }
    });
  },
// 复制微信号
copyText: function (e) {
  wx.setClipboardData({
    data: e.currentTarget.dataset.text,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
  })
},
  /**
     * 获取 招工信息详情
     */
  getHireInfo: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('projectHires/getWxHireDetail', {
          id: that.data.hireId,
          code:res.code
        }, function (data) {
          that.setData({
            hireInfo: data
          });
          that.getHireStatus();
        });
      }
    })
  },

  getHireStatus: function () {
    var that = this;
    app.func.req('dicts/getDictsByCategory', {
      categoryKey: "PROJECT_HIRE_STATUS"
    }, function (data) {
      if (data) {
        data.splice(0, 1)
        data.splice(2, 1)
        that.setData({
          hireStatus: data
        });
        that.initHireStatus();
      }
    });
  },

  initHireStatus: function () {
    for (var i = 0; i < this.data.hireStatus.length; i++) {
      var itm = this.data.hireStatus[i];
      if (itm.id == this.data.hireInfo.status.id) {
        this.setData({
          hireStatusIdx: i
        });
      }
    }
  },

  changeHiretatus: function (e) {
    this.setData({
      hireStatusIdx: e.detail.value
    });
    app.func.req('projectHires/updateStatusHire', {
      status: this.data.hireStatus[this.data.hireStatusIdx].id,
      id: this.data.hireId
    }, function (data) {
      wx.showModal({
        title: '提示',
        content: '招工信息更新成功!',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    });
  },

  doReSendHire: function (e) {
    console.log(e.currentTarget.dataset.name)
    wx.navigateTo({
      url: '/pages/republish/republish?id=' + e.currentTarget.dataset.name,
    })
  },
  /*切换发布招工类型*/
  ordinary:function(e){
    if (e.currentTarget.dataset.type==0){
      this.setData({
        isOrdinary: true
      });
    }else{
      this.setData({
        isOrdinary: false
      });   
    }
  },
  /**查看发布类型说明*/
  typeDescription: function () {
    app.isBind().then(value => {
      this.setData({
        hiddenStamp: false
      })
    })
  },
  //确认按钮
  confirm: function (e) {
    var that = this;
    this.setData({
      hiddenStamp: true
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // let that = this
    // wx.setStorageSync('isShare', true)
    // wx.getStorage({
    //   key: 'isShare',
    //   success: function(res) {
    //     // success
    //     // console.log(res.data)
    //   }
    // })
    // return {
    //   title: (that.data.hireInfo.displayAddress ? that.data.hireInfo.displayAddress : that.data.hireInfo.title) + '-招' + that.data.hireInfo.teamType.title,
    //   path: '/pages/kbjzgxq/kbjzgxq?id=' + that.data.hireId,
    // }
  }
})