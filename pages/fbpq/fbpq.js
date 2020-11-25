// pages/fbpq/fbpq.js
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    opacity: 0.5,    //设置透明度
    toView: 'red',
    //index: 0,
    mapTitle: {},
    mapId: {},
    map: {},
    multiArray: [[], []],
    multiIndex: [0, 0],
    region: ['广东省', '深圳市', '福田区'],
    isSubmitAble: false,
    // warnStr_2:"不能为空",

    hireSalary: "",
    workerType: "",
    hireTitle: "",
    hireContacts: "",
    //hireDeadline:"",
    hireRegion: "",
    districtStr: null,    //区
    workerTypeId: null,
    hirePepoleNum: null,
    hireRequest: "",
    hirePhone: "",
    hireCode: null,
    record1_1: [],        // 生成下来的省市区
    record2_2: [],
    record3_3: [],
    record1: [],        // 生成下来的省市区
    record2: [],
    record3: [],

    generate1: [     // 保存的省市区
      '北京市',
      1
    ],
    generate2: [
      '北京市',
      1001
    ],
    generate3: [
      '东城区',
      10001
    ],
    localRegion: ['广东省', '深圳市', '福田区'],
    localArray: [[], [], []],
    localIndex: '',
    localType: "",
    proed: 0,
    cityed: 0,
    qued: 0,
    districtId: 0,
    isInCode: 1,
    isCodeTime: 60,
    referenceprice: "",
    isShowprice: false,
    formId: ""
  },
  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    this.doSubmit();
  },

  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  auth: function () {

    if (app.globalData.userInfo === null) {

      wx.navigateTo({
        url: '../auth/auth',
      })
      return false
    } else {
      return true
    }
  },
  isBindPhone: function () {
    if (app.globalData.mPhone != null && app.globalData.mPhone != '') {
      return true;
    } else {
      return false;
    }
  },

  /** 验证输入值 */
  doVerifyValues: function () {
    var data = this.data;
    var isSubmitAble = false;

    var warnStr_0 = "";
    var warnStr_1 = "";
    var warnStr_2 = "";
    var warnStr_3 = "";
    var warnStr_4 = "";
    var warnStr_5 = "";
    var warnStr_6 = "";
    var warnStr_7 = "";
    var warnStr_8 = "";
    var pan = 0
    if (this.isEmpty(data.hireTitle)) {
      // warnStr_2 = "不能为空";
      pan++
    } else if (this.isEmpty(data.hireContacts)) {
      // warnStr_2 = "不能为空";
      pan++
    } else if (this.isEmpty(data.hireCode)) {
      // warnStr_3 = "不能为空";
      pan++
    } else if (this.isEmpty(data.districtId)) {
      // warnStr_4 = "不能为空";
      pan++
    } else if (this.isEmpty(data.workerTypeId)) {
      // warnStr_5 = "不能为空";
      pan++
    } else if (this.isEmpty(data.hirePepoleNum)) {
      // warnStr_6 = "不能为空";
      pan++
    } else if (this.isEmpty(data.hireSalary)) {
      // warnStr_7 = "不能为空";
      pan++
    } else if (this.isEmpty(data.hireRequest)) {
      // warnStr_8 = "不能为空";
      pan++
    } else if (util.isPhone(data.hirePhone) == false) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      pan++
    }
    if (pan === 0) {
      isSubmitAble = true;
    }
    // 判断填写字符的格式，限制辱骂或者垃圾信息
    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.5,
      // warnStr: warnStr,
      warnStr_2: warnStr_2,
      warnStr_3: warnStr_3,
      warnStr_4: warnStr_4,
      warnStr_5: warnStr_5,
      warnStr_6: warnStr_6,
      warnStr_7: warnStr_7,
      warnStr_8: warnStr_8,
    });
  },

  /*提交 */
  doSubmit: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      isSubmitAble: false
    })
    app.func.req('projectHires/userAddHire', {
      projectName: that.data.hireTitle,
      streetAddress: that.data.hireRegion,
      contacts: that.data.hireContacts,
      phone: that.data.hirePhone,
      memo: that.data.hireRequest,
      teamTypeId: that.data.workerTypeId,
      peopleNumber: that.data.hirePepoleNum,
      salary: that.data.hireSalary,
      hireCode: that.data.hireCode,
      districtStr: that.data.districtStr,
      districtId: that.data.districtId,
      type:'PROJECT_TYPE_DISPATCH'
    }, function (data) {
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      });
      that.setData({
        mapTitle: {},
        mapId: {},
        map: {},
        multiArray: [[], []],
        multiIndex: [0, 0],
        region: ['广东省', '深圳市', '福田区'],
        isSubmitAble: false,
        // warnStr: "招工标题未填写~",
        hireSalary: "",
        workerType: "",
        hireTitle: "",
        hireContacts: "",
        //hireDeadline:"",
        hireRegion: "",
        workerTypeId: null,
        hirePepoleNum: null,
        hireRequest: "",
        hirePhone: "",
        hireCode: null,
        isInCode: 1,
        isCodeTime: 60
      });
    });
  },
  /**
   * 获取 公告信息
   */
  getNotes: function () {
    //function 里面已经不是this所以使用this.setData不起作用
    var that = this;
    app.func.req('notes/getNotes', {
      status: 1,
      typeId: 4
    }, function (data) {
      if (data) {
        that.setData({
          notes: data,
          showNote: true
        });
      }
    });
  },
  /**获取验证码 */
  getVerifyCode: function () {
    var that = this;
    if (util.isPhone(that.data.hirePhone) == false) {
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
    util.sendVerifyCode(that.data.hirePhone, function(){
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

  bindHiresalary: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireSalary: e.detail.value
    })

    this.doVerifyValues()
  },

  bindHireCode: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireCode: e.detail.value
    });
    this.doVerifyValues();
  },
  blurfocusPhone: function (e) {

  },
  bindHirePhone: function (e) {
    this.setData({
      hirePhone: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHireRequest: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireRequest: e.detail.value
    });
    this.doVerifyValues()
  },

  bindHirePepoleNum: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hirePepoleNum: e.detail.value
    });
    this.doVerifyValues()
  },

  bindHireContacts: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireContacts: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHireTitle: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireTitle: e.detail.value
    });
    this.doVerifyValues();
  },

  bindDateChange: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireDeadline: e.detail.value
    })
    this.doVerifyValues();
  },
  //工种切换
  changeTeamType: function (event) {
    this.setData({
      workerType: event.detail.teamTypeName,
      workerTypeId: event.detail.teamTypeId
    });
  },
  // 地区选择
  changeThirdArea: function (event) {
    console.log(event);
    this.setData({
      localType: event.detail.areaTitle,
      districtStr: event.detail.areaTitle,
      districtId: event.detail.countyId,
    });
  },
  bindRegionChange: function (e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      region: e.detail.value,
      districtStr: e.detail.value[2],
      hireRegion: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    });

    this.doVerifyValues();
  },
  onShow: function () {
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNotes();
  },
  onPullDownRefresh: function () {

  }
})

function filtion(val) {
  var inputContent = val;
  // 多个敏感词
  var arrMg = [];
  var showContent = inputContent;
  for (var i = 0; i < arrMg.length; i++) {
    // replace 只会替换第一个，后面如果还有相同的内容，就不会替换了
    showContent = showContent.replace(arrMg[i], "");
  }
  return showContent;
}
