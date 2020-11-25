const app = getApp();

Page({
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  bindAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindProjectName: function (e) {
    this.setData({
      projectName: e.detail.value
    })
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindidNumber: function (e) {
    this.setData({
      idNumber: e.detail.value
    })
  },
  success: function (e) {
    console.log(e);
    this.setData({
      idNumber: e.detail.id.text,
      name: e.detail.name.text,
      hometown: e.detail.address.text
    })
  },

  //编辑
  formSubmit: function (e) {
    var that = this;
    if (!that.data.address) {
      wx.showToast({
        title: '地址不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.projectName) {
      wx.showToast({
        title: '项目名称不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.name) {
      wx.showToast({
        title: '姓名不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.idNumber) {
      wx.showToast({
        title: '身份证号不能为空',
        duration: 1500,
      });
      return;
    }
    app.func.req('workerRegisters/save', {
      name: that.data.name,
      idNumber: that.data.idNumber,
      projectName: that.data.projectName,
      phone: that.data.phone,
      address: that.data.address,
      hometown: that.data.hometown
    }, function (data) {
      if(data.code == 200) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        wx.switchTab({
          url: '../index/index'
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