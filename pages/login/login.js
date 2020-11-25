// pages/login/login.js
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      currentTab: 0,
    },
    currentTab: 0,
    isSubmitAble: false,
    opacity: 0.5,
    warnStr: "请填写用户名~",
    phone: "",
    password: "",
  },
  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    this.doSave();
  },
  doSave: function () {
    var that = this;
    console.log(this.data);
    app.func.req('accounts/doShiming', {
      formId: that.data.formId,
      name: that.data.phone,
      phone: that.data.phone,
      wxId: app.globalData.openId
    }, function (data) {
      console.log(data)
      if (data) {
        app.globalData.mPhone = that.data.phone;
      }
    });
    if (this.data.currentTab === 0) {
      app.func.req('accounts/companySignIn', {// 公司登入
          userName: that.data.phone,
          password: that.data.password,
        }, function (data) {
        if (data.message && data.status != 200) {
          console.log('失败')
          wx.showModal({
            title: '提示',
            content: data.message,
            success: function (res) {
            }
          })
        } else {
          wx.showToast({
            title: '登入成功',
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.switchTab({ //导航页跳转API
                  url: '../wd/wd',
                })
              }, 1500);
              wx.setStorageSync('user', data.title);//本地緩存用戶名
            }
          });
        }
      });
    }
    if (this.data.currentTab === 1) {
      app.func.req('accounts/teamSignIn', {// 班组登入
        userName: that.data.phone,
        password: that.data.password,
      }, function (data) {

        if (data.message && data.status != 200) {
          wx.showModal({
            title: '提示',
            content: data.message,
            success: function (res) {
            }
          })
        } else {
          wx.showToast({
            title: '登入成功',
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../wd/wd'
                });
              }, 1500);
            }
          });
        }
      });
    }

  },
  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  /** 验证输入值 */
  doVerifyValues: function () {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";

    if (this.isEmpty(data.phone)) {
      warnStr = "请填写用户名~";
    } else if (this.isEmpty(data.password)) {
      warnStr = "请填写用户密码~";
    } else {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
      var phoneNum = data.phone//手机号码
      var flag = reg.test(phoneNum); //true
      if (flag) {
        isSubmitAble = true;
      } else {
        warnStr = '用户名格式不正确！'
      }
    }
    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.5,
      warnStr: warnStr
    });
  },
  bindName: function (e) {
    this.setData({
      phone: e.detail.value
    });
    this.doVerifyValues();
  },
  bindPwd: function (e) {
    this.setData({
      password: e.detail.value
    });
    this.doVerifyValues();
  }, 
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

  },
  /** 
    * 滑动切换tab 
    */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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