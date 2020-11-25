// pages/workdetail/workdetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFullPhone: false,   //招工号码是否完整
    id:'',
    phone:'',
    hiddenmodalput: true, // 举报模态框判定
    reportCategorys: [],   //举报内容选项
    remark: ""
  },
  getDatail: function(id){
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('lookingLifes/queryLookingLifeById', {
      id: id
    },function(data){
      if(data){
        that.setData({
          workdata: data,
          phone: data.contactNumber,
          isFullPhone: !data.hiddenPhone,
          experience:JSON.parse(data.projectExp)
        })
      }
    })
  },
  
  // 获取完整手机号
  getContactPhone: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req("lookingLifes/getLookingLifeFullPhone", {
        id: that.data.id
      }, function (data) {
        if (data.code == 200) {
          wx.showToast({
            title: '获取成功，消耗1积分',
            icon: 'none',
            duration: 3000
          })
          let workdata = that.data.workdata
          workdata.contactNumber = data.data
            that.setData({
              phone: data.data,
              workdata,
              isFullPhone: true
            })
          setTimeout(function () {
            wx.hideToast()
          }, 1000);
        } else {
          wx.showModal({
            title: '温馨提示',
            content: data.msg,
            confirmText: "获取积分",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../integral/integral',
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      })
    })
  },
  getHireReportCategory: function () {
    var that = this;
    app.func.req('dicts/getDictsByCategory', {
      categoryKey: "HIRE_REPORT"
    }, function (data) {
      if (data) {
        that.setData({
          reportCategorys: data
        })
      }
    });
  },
  Callphone: function(){
    var that=this;
    var phoneNumber = that.data.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  //获取举报弹窗
  Complain: function () {
    app.isBind().then(value => {
      this.setData({
        hiddenmodalput: !this.data.hiddenmodalput
      })
    })
  },
  radioChange: function (e) {
    this.setData({
      mReportCategory: e.detail.value
    })
    if (this.data.mReportCategory == 'HIRE_REPORT_3') {
      this.setData({
        isremark: true
      })
    } else {
      this.setData({
        isremark: false
      })
    }
  },
  bindinputValue: function (e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },
  //取消按钮
  cancel: function (e) {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认按钮
  confirm: function (e) {
    if (this.data.mReportCategory == "") {
      wx.showToast({
        title: '请选择一条要举报内容！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      hiddenmodalput: true
    });
    var that=this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('hireReports/addReport', {
          code: res.code,
          lookingLifeId: that.data.id,
          reportCategory: this.data.mReportCategory,
          remark: this.data.remark || ''
        }, function (data) {
          if (data) {
            wx.showToast({
              title: '举报成功',
              icon: 'success',
              duration: 3000
            })
          }
        })
      }
    })
 },
 /*查看图片*/
  previewImage:function(e){
    var that = this;
    var imgarr = e.currentTarget.dataset.imgarr;
    var previewImageArr = [];
    for (var i = 0; i < imgarr.length;i++){
      previewImageArr.push(imgarr[i].img);
    }
    console.log(previewImageArr);
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls: previewImageArr, // 需要预览的图片http链接列表
      success: function (res) { },
      fail: function (res) {
        wx.showToast({
          title: '图片获取失败',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    this.getDatail(options.id);
    this.getHireReportCategory();
    that.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  //     //获得popup组件
  //   this.report = this.selectComponent("#report");

  // },
  // complain() {
  //   this.report.complain();
  //   this.report.getHireReportCategory();
  // },
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