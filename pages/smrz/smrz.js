
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    isEdit: false,
    nickName:'',
    items: [],
    gender:'',
    opacity: 0.5,    //设置透明度
    isInCode: 1,
    isCodeTime: 60,
    name: "",
    phone: "",
    code: "",
    formId: "",
    hirePhone: "",
    cardImg: '',
    imgUrl: '',
    cardImg_01: '',
    imgUrl_01: '',
    idNum: '',
    openid: ''//邀请人的oenid
  },

  /*判断引导式是否登录*/
  guideAccountInfo: function () {
    if (!app.globalData.guideOpenIdFlag) {
      app.guideAccount();
    } else {
      return;
    }
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  getPhoneNumber: function(e) {
    var that=this;
    wx.login({
      success(res) { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('wxs/getOpenId', {
          code: res.code
        }, function (data) {
          app.globalData.openId = data.openid;
          wx.setStorageSync('openId', data.openid)
          app.func.req('wxs/phone', {
            encryptedData: e.detail.encryptedData,
            session_key: data.session_key,
            iv: e.detail.iv
          }, function (data) {
            console.log(data.code);
            if (data.code == 200) {
              console.log(JSON.stringify(data.data));
              that.setData({
                phone: data.data.phone,
                isEdit: true
              })
            } else {
              wx.showToast({
                title: '手机号码解析失败，请手动输入',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                isEdit: false
              })
            }
          });
        });
      }
    })
  },
  doSave: function () {
    var that = this;
    if (that.data.phone == "" || that.data.phone == undefined){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(that.data.isEdit==false){
      if (that.data.code == "" || that.data.code == undefined) {
        wx.showToast({
          title: '验证码不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var url = 'accounts/wxSignUp';
      var options={
        mobile: that.data.phone,
        code: that.data.code,
        guideOpenId:that.data.openid,
        wxOpenId: app.globalData.openId,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        gender: that.data.gender,
        nickName: app.globalData.userInfo.nickName,
        formId: that.data.formId
      }
    }else{
      var url = 'accounts/wxSignUp';
      var options={
        mobile: that.data.phone,
        guideOpenId:that.data.openid,
        wxOpenId: app.globalData.openId,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        gender: that.data.gender,
        nickName: app.globalData.userInfo.nickName,
        formId: that.data.formId
      }
    }
    wx.showLoading({
      title: '数据提交中...',
    })

    app.func.req(url,options, function (data) {
      wx.hideLoading();
      if (data.code==200) {
        wx.setStorageSync('token', data.data.token);
        app.globalData.token = data.data.token;
        app.globalData.isShiMin = true;
        app.globalData.mAccId = data.data.accountId;
        app.globalData.mPhone = that.data.phone,
        wx.setStorageSync('mobile', that.data.phone),
        wx.setStorageSync('isBindMobile', true)
        wx.showToast({
          title: '恭喜你 绑定成功',
          icon: 'none',
          duration: 2000
        })
        that.guideAccountInfo();
        if (that.data.openName =='findJob'){
          wx.navigateTo({
            url: '/pages/works/meworkdetail/meworkdetail?openid=' + that.data.openid + '&source=2&originate=2&optionName=findJob',
          })
        } else if (that.data.optionTeam == 'TEAM') {
          wx.reLaunch({
            url: '../index/index?scene=' + that.data.optionTeam
          })
        } else if (that.data.backStatus == 1) {
          wx.navigateBack({
            delta: 1
          })
        }  else {
          wx.switchTab({
            url: '/pages/wd/wd',
          })
        }
      } else if(data.code=300){
        wx.showModal({
          title: '提示',
          content: '该手机号已经绑定其他微信号,是否强制绑定该手机号？',
          success(res) {
            if (res.confirm) {
              that.phonebound();
            } else if (res.cancel) {

            }
          }
        })
      }else{
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    this.doSave();
  },

  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },

  getVerifyCode: function () {
    var that = this;

    if (this.isEmpty(that.data.phone)) {
      wx.showModal({
        title: '提示',
        content: "手机号码不能为空~",
        showCancel: false,
        success: function (res) {
        }
      })
      return;
    }
    if (util.isPhone(that.data.phone) == false) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isCodeFun = setInterval(() => {
      var isCodeTime = that.data.isCodeTime - 1
      that.setData({
        isCodeTime: isCodeTime
      })
    }, 1000)
    util.sendVerifyCode(that.data.phone, function () {
      that.setData({
        isInCode: 0   // 已经发送后要过1分钟才能在发送
      })
      that.data.isInCode = 0
      setTimeout(() => {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        clearInterval(isCodeFun)
      }, 60000)
    });
  },

  bindCode: function (e) {
    this.setData({
      code: e.detail.value
    });
  },

  bindName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  bindIdNum: function (e) {
    this.setData({
      idNum: e.detail.value
    });
  },

  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo.gender==1){
      var item = [{name:'1',value:"男",checked: 'true'},{name:'2',value:"女"}];
    }else{
      var item = [{name:'1',value:"男"},{name:'2',value:"女",checked: 'true'}];
    }
    this.setData({
      nickName:app.globalData.userInfo.nickName,
      gender:app.globalData.userInfo.gender,
      items:item
    })
    if (app.globalData.mPhone != null && app.globalData.mPhone != '') {
      this.setData({
        phone: app.globalData.mPhone
      })
    }
    var that = this;
    if (options.backStatus==1){//绑定手机号码，返回原本界面
      that.setData({
        backStatus: options.backStatus,
      })
    }
    //邀请人员
    if (options.openid) {
      that.setData({
        openid: options.openid,
      })
    }
     //快速注册通道==aisle**我的找活分享==findJob
    if (options.optionName) {
      that.setData({
        openName: options.optionName,
      })
    }
    //班组管理推广跳转
    if (options.optionTeam) {
      that.setData({
        optionTeam: options.optionTeam,
      })
    }
    console.log('options.optionTeam+srmy:' + options.optionTeam);
  },
  //强制绑定已经绑定其他微信号的手机号
  phonebound:function(){
    var that = this;
    app.func.req('accounts/forceBind', {
      mobile: that.data.phone,
      // code: that.data.code,
      wxOpenId: app.globalData.openId,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      gender: app.globalData.userInfo.gender,
      nickName: app.globalData.userInfo.nickName,
      formId: that.data.formId
    }, function (data) {
      wx.hideLoading();
      if (data.code == 200) {
        wx.setStorageSync('token', data.data.token);
        app.globalData.token = data.data.token;
        app.globalData.isShiMin = true;
        app.globalData.mAccId = data.data.accountId;
        app.globalData.mPhone = that.data.phone,
        wx.setStorageSync('mobile', that.data.phone),
        wx.setStorageSync('isBindMobile', true)
        wx.showToast({
          title: '恭喜你 绑定成功',
          icon: 'none',
          duration: 3000
        })
        that.guideAccountInfo();
        if (that.data.openName =='findJob'){
          wx.navigateTo({
            url: '/pages/works/meworkdetail/meworkdetail?openid=' + that.data.openid +'&source=2&originate=2&optionName=findJob',
          })
        } else if (that.data.optionTeam =='TEAM'){
          wx.reLaunch({
            url: '../index/index?scene=' + that.data.optionTeam
          })
        } else if (that.data.backStatus == 1){
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.switchTab({
            url: '/pages/wd/wd',
          })
        }
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
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