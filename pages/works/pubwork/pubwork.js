const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    index: ''
  },

  //性别切换
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    if (this.data.index == 0) {
      this.setData({
        sex: '男'
      })
    }
    if (this.data.index == 1) {
      this.setData({
        sex: '女'
      })
    }
  },
  
  //城市切换
  changeThirdArea: function (event) {
    console.log(event.detail.provinceId)
    console.log(event.detail.cityId)
    console.log(event.detail.countyId)
    this.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      countyId: event.detail.countyId
    })
  },

  //工种切换
  changeTeamType: function (event) {
    console.log(event.detail.teamTypeId)
    this.setData({
      teamTypeId: event.detail.teamTypeId
    })
  },

  bindName: function (e) {
    this.setData({
      userName: e.detail.value
    });
  },

  bindAge: function (e) {
    this.setData({
      age: e.detail.value
    });
  },

  bindPhone: function (e) {
    this.setData({
      contactNumber: e.detail.value
    });
  },

  bindMark: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    this.doSubmit();
  },

  doSubmit: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.userName == undefined || that.data.userName == ''){
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
      })
      return;
    }
    if (that.data.teamTypeId == undefined || that.data.teamTypeId == '') {
      wx.showModal({
        title: '提示',
        content: '请选择工种类型',
      })
      return;
    }
    if (that.data.age == undefined || that.data.age == '') {
      wx.showModal({
        title: '提示',
        content: '年龄不能为空',
      })
      return;
    }
    if (that.data.sex == undefined || that.data.sex == '') {
      wx.showModal({
        title: '提示',
        content: '请选择性别',
      })
      return;
    }
    if (that.data.countyId == undefined || that.data.countyId == '') {
      wx.showModal({
        title: '提示',
        content: '请选择接活地区',
      })
      return;
    }
    if (that.data.contactNumber == undefined || that.data.contactNumber == ''){
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
      })
      return;
    }

    app.func.req('lookingLifes/saveLookingLife?countyId=' + that.data.countyId + '&teamTypeId=' + that.data.teamTypeId, {
      userName: that.data.userName,
      // teamTypeId: that.data.teamTypeId,
      age: that.data.age,
      sex: that.data.sex,
      // countyId: that.data.countyId,
      contactNumber: that.data.contactNumber,
      content: that.data.content ? that.data.content : '',
      realNamePhone: wx.getStorageSync('mobile')
    },function(data){
      if(data.code == 401) {
        wx.showModal({
          title: '温馨提示!',
          content: data.msg,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../mework/mework',
              })
            } else if (res.cancel) {
              
            }
          }
        });
      } else if (data.code == 400) {
        wx.showModal({
          title: '提示',
          content: data.msg,
        })
      } else {
        wx.showModal({
          title: '提示',
          content: data.msg,
        })
        wx.navigateTo({
          url: '../works',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl
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