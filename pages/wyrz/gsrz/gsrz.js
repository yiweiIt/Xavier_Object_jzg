// pages/wyrz/gsrz/gsrz.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    mapTitle: {},
    mapId: {},
    map: {},
    userName: "",
    // code: "",
    verificationCode: "",
    iscode: 1,
    isInCode: 1,
    iscodeTime: 60,
    password: "",
    multiArray: ["建筑公司", "劳务公司", "监理公司", "设计公司", "勘察设计", "审图公司", "造价咨询", "招标代理", "检测机构", "装饰公司"],
    multiIndex: 0,
    COMPANY_TYPE_: "COMPANY_TYPE_",
    companyType_id: "COMPANY_TYPE_1",
    title: "",
    organizationCode: "",
    contacts: "",
    phone: "",
    isSubmitAble: false,
    warnStr: "",
    opacity: 0.7,
    formId: "",
  },
  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    app.isBind().then(value => {
      this.doSubmit();
    })
  },
  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 验证输入值
   */
  doVerifyValues: function () {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";

    // if (this.isEmpty(data.userName)) {
    //   warnStr = "手机号未填写~";
    // } else 
    if (this.isEmpty(data.companyType_id)) {
      warnStr = "公司类型未选择~";
    } else if (this.isEmpty(data.title)) {
      warnStr = "公司名称未填写~";
    } else if (this.isEmpty(data.organizationCode)) {
      warnStr = "机构代码未填写~";
    } else if (this.isEmpty(data.contacts)) {
      warnStr = "联系人未填写~";
    } else if (this.isEmpty(data.phone)) {
      warnStr = "联系电话未填写~";
    } else {
      isSubmitAble = true;
    }

    // 判断填写字符的格式，限制辱骂或者垃圾信息

    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.7,
      warnStr: warnStr
    });
  },

  /**
   * 注册
   */
  /*提交 */
  doSubmit: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      isSubmitAble: false
    })
    app.func.req('companys/finishSignUp', {
      // userName: that.data.userName,
      // code: that.data.verificationCode,
      // password: that.data.password,
      "companyType.id": that.data.companyType_id,
      title: that.data.title,
      organizationCode: that.data.organizationCode,
      contacts: that.data.contacts,
      phone: that.data.phone,
      formId: that.data.formId
    }, function (data) {
      wx.showToast({
        title: '入驻成功',
        icon: 'success',
        duration: 1500,
        complete: function (){
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/wd/wd',
            })
          }, 1500);
        }
      });
    });
  },
  /**获取验证码 */
  getVerifyCode: function () {
    var that = this;
    if (this.isEmpty(that.data.userName)) {
      wx.showModal({
        title: '提示',
        content: "手机号码不能为空~",
        success: function (res) {
        }
      })
      return;
    }
    var codeFun = setInterval(() => {
      var iscodeTime = that.data.iscodeTime - 1

      if (iscodeTime < 0) {
        that.setData({
          // iscode: 1,
          isInCode: 1,
          iscodeTime: 60
        })
        clearInterval(codeFun)

      } else {
        that.setData({
          iscodeTime: iscodeTime
        })
      }

    }, 1000)
    util.sendVerifyCode(that.data.userName, function(){
      that.setData({
        isInCode: 0   // 已经发送后要过1分钟才能在发送
      })
      that.data.isInCode = 0
      setTimeout(() => {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        // clearInterval(isCodeFun)
      }, 60000)
    });
  },
  bindUserName: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      userName: e.detail.value
    })

    this.doVerifyValues()
  },
  bindCode: function (e) {
    this.setData({
      verificationCode: e.detail.value
    })
    this.doVerifyValues()
  },
  bindPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
    this.doVerifyValues()
  },
  bindTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
    this.doVerifyValues()
  },
  bindOrganiza: function (e) {
    this.setData({
      organizationCode: e.detail.value
    })
    this.doVerifyValues()
  },
  bindContacts: function (e) {
    this.setData({
      contacts: e.detail.value
    })
    this.doVerifyValues()
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.doVerifyValues()
  },
  /**公司类型*/
  bindPickerChange: function (e) {
    var COMPANY_TYPE_ = "COMPANY_TYPE_";
    var Type = COMPANY_TYPE_;
    var companyType_id = Type + e.detail.value
    this.setData({
      companyType_id: Type + e.detail.value
    });
    console.log(e.detail.value)
    if (e.detail.value == 0){
      this.setData({
        companyType_id: Type + 1
      });
    }
    if (e.detail.value == 1) {
      this.setData({
        companyType_id: Type + 2
      });
    }
    if (e.detail.value == 2) {
      this.setData({
        companyType_id: Type + 3
      });
    }
    if (e.detail.value == 3) {
      this.setData({
        companyType_id: Type + 4
      });
    }
    if (e.detail.value == 4) {
      this.setData({
        companyType_id: Type + 5
      });
    }
    if (e.detail.value == 5) {
      this.setData({
        companyType_id: Type + 6
      });
    }
    if (e.detail.value == 6) {
      this.setData({
        companyType_id: Type + 7
      });
    }
    if (e.detail.value == 7) {
      this.setData({
        companyType_id: Type + 8
      });
    }
    if (e.detail.value == 8) {
      this.setData({
        companyType_id: Type + 9
      });
    }
    if (e.detail.value == 9) {
      this.setData({
        companyType_id: Type + 10
      });
    }
    this.setData({
      multiIndex: e.detail.value
    });
    this.doVerifyValues()
  },
  getCompanysSignUp: function () {
    var that = this;
    // app.func.req('companys/signUp', {}, function (data) {
    //   console.log(data)
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.isBind();
    app.isBind().then(value => {
        this.getCompanysSignUp()
        this.setData({
          companyType_id: "COMPANY_TYPE_1"
        })
    })
  },

  
})