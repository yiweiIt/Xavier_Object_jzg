const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    beReportor: "",
    beReportor_phone: "",
    reportor: "",
    reportor_phone: "",
    remark: "",
    nowImg: 1, //当前是第几个
    warnStr: "被举报人姓名未填写~",
  },

  // 数据空值校验
  isEmpty: function(str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },

  isWord: function(str) {
    var wordReg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    if (!wordReg.test(str)) {
      return true;
    } else {
      return false;
    }
  },

  // 校验表单数据空值校验
  doVoritity() {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";
    if (this.isEmpty(data.beReportor)) {
      warnStr = "被举报人姓名未填写~";
    } else if (this.isWord(data.beReportor)) {
      warnStr = '请正确输入被举报人姓名'
    } else if (this.isEmpty(data.beReportor_phone)) {
      warnStr = "被举报人电话未填写~";
    } else if (this.isEmpty(data.reportor)) {
      warnStr = "您的姓名未填写~";
    } else if (this.isWord(data.reportor)) {
      warnStr = '请正确输入您的姓名'
    } else if (this.isEmpty(data.reportor_phone)) {
      warnStr = "联系电话未填写~";
    } else if (this.isEmpty(data.remark)) {
      warnStr = "举报原因未填写~";
    } else {
      isSubmitAble = true;
    }
    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.5,
      warnStr: warnStr
    });
  },

  doSubmit: function() {
    var that = this;
    var phoneNum = that.data.beReportor_phone //手机号码
    var phoneNum1 = that.data.reportor_phone
    if (!util.isPhone(phoneNum)) {
      wx.showToast({
        title: '被举报人电话格式不正确',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!util.isPhone(phoneNum1)) {
      wx.showToast({
        title: '联系电话格式不正确',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    app.func.req('blacklists/doSave', {
      beReportor: that.data.beReportor,
      beReportor_phone: that.data.beReportor_phone,
      reportor: that.data.reportor,
      reportor_phone: that.data.reportor_phone,
      remark: that.data.remark
    }, function(data) {
      if (data) {
        that.setData({
          beReportor: "",
          beReportor_phone: "",
          reportor: "",
          reportor_phone: "",
          remark: "",
        })
        wx.showToast({
          title: '举报成功',
          icon: 'success',
          duration: 1500,
          complete: function() {
            setTimeout(function() {
              wx.switchTab({
                url: '../index/index'
              });
            }, 500);
          }
        });
      }
    });
  },

  bindBeReportor: function(e) {
    this.setData({
      beReportor: e.detail.value
    });
    this.doVoritity()
  },

  bindPhone: function(e) {
    this.setData({
      beReportor_phone: e.detail.value
    });
    this.doVoritity()
  },

  bindReportor: function(e) {
    this.setData({
      reportor: e.detail.value
    });
    this.doVoritity()
  },

  bindRemark: function(e) {
    this.setData({
      remark: e.detail.value
    });
    this.doVoritity()
  },

  bindReportor_phone: function(e) {
    this.setData({
      reportor_phone: e.detail.value
    });
    this.doVoritity()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
})