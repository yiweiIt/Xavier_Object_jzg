const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    isMaskHidden: true,  //遮罩是否隐藏
    isShare: false,     //是否分享
    opacity: 0.5,    //设置透明度
    page: {
      index: -1,
      size: 20,
      winWidth: 0,
      winHeight: 0,
      // tab切换
      currentTab: 0,
      duration: 100
    },
    currentTab: 0,
    queryWord: "",      //搜索关键字
    canLoadMore: false,  //是否有下一页

    typeTitles: {},
    typeIds: {},
    typeName: "全部工种",    //工种名称

    typeId: null,       // 工种id
    typeArray: [[], []],
    typeArrayId: [[], []],
    allTypeArray: [],   // 全部工种信息
    typeResId: [],
    typeResArr: '',    //  存储被选中的id,第二分类
    typeResArr2: '',   // 存储被选中的id，第一分类
    idArr: [],      // 第二级的工种信息
    // areaNamesArray: [[], []],
    // areaIdsArray: [[], []],
    // areaIndex: [0, 0],
    areName: "全部地区",
    cityId: null,
    provinceId: null,


    name: "",
    phone: "",
    verificationCode: "",
    password: "",
    confirmPsw: "",
    typeArray: [[], []],
    typeIndex: [0, 0],
    areaNamesArray: [[], []],
    areaIdsArray: [[], []],
    areaIndex: [0, 0],

    teams: [],
    height: 1200,
    mapTitle: {},
    mapId: {},
    map: {},
    multiTitles: {},
    multiArray: [[], []],
    multiIndex: [0, 0],
    region: ['广东省', '深圳市', '福田区'],
    isSubmitAble: false,
    warnStr: "班组姓名未填写~",

    hireSalary: "",
    workerType: "",
    hireTitle: "",
    hireContacts: "",
    //hireDeadline:"",
    hireRegion: "",

    districtStr: null,    //区
    workerTypeId: null,
    address: '',
    // allAddress: '',
    idNumber:'',
    bankName:'',
    cardNumber:'',

    jxNamesArray: [[], []],
    jxIdsArrayed: [[], []],
    jxIdsArray: [[], []],
    jxIdsArray2: [],
    jxIdsArraying: [[], []],
    jxIndex: [0, 0],
    jxName: '选择地区',

    heighted: '',
    isInCode: 1,
    isCodeTime: 60,
    formId: '',
    localArray: [
      [],
      [],
      []
    ],
    localIndex: '',
    localType: "",
    pro: [],
    city: [],
    qu: [],
    proed: 0,
    cityed: 0,
    qued: 0,
    districtId: 0,
    array:
      ['工商银行', '光大银行', '广发银行', '华夏银行', '建设银行',
        '交通银行', '民生银行', '农业银行', '平安银行', '浦发银行',
        '兴业银行', '邮政银行', '招商银行', '中国银行', '中信银行'],
  },
  // 提交数据
  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    app.isBind().then(value => {
      this.doSave();
    })
  },
  bindCardNumber: function (e) {
    this.setData({
      cardNumber: e.detail.value
    });
    this.doVerifyValues();
  },
  bindIdnumber: function (e) {
    this.setData({
      idNumber: e.detail.value
    });
    this.doVerifyValues();
  },

  bindAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
    this.doVerifyValues();
  },

  bindWorkerTypeId: function (e) {
    this.setData({
      workerTypeId: e.detail.value
    });
    this.doVerifyValues();
  },

  bindName: function (e) {
    this.setData({
      name: e.detail.value
    });
    this.doVerifyValues();
  },

  bindCode: function (e) {
    this.setData({
      verificationCode: e.detail.value
    });
    this.doVerifyValues();
  },
  bindPsw: function (e) {
    this.setData({
      password: e.detail.value
    });
    this.doVerifyValues();
  },
  bindConfirmPsw: function (e) {
    this.setData({
      confirmPsw: e.detail.value
    });
    this.doVerifyValues();
  },
  userbindbankName: function (e) {
    this.setData({
      index: e.detail.value,
      bankName: this.data.array[e.detail.value]
    })
  },
  /* 上拉 */
  onPullDownRefresh: function () {

  },

  /*下拉加载更多*/
  onReachBottom: function () {

  },
  //工种切换
  changeTeamType: function (event) {
    console.log(event);
    this.setData({
      workerType: event.detail.teamTypeName,
      workerTypeId: event.detail.teamTypeId
    });
    this.doVerifyValues();
  },
  // 地区选择
  changeThirdArea: function (event) {
    var that = this;
    that.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      districtId: event.detail.countyId,
      localType: event.detail.areaTitle,
      districtStr:event.detail.areaTitle
    });
    this.doVerifyValues();
  },
  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  showMask: function () {
    this.setData({ isMaskHidden: false });
  },

  //消失
  hideMask: function () {
    this.setData({ isMaskHidden: true });

  },
  /** 验证输入值 */
  doVerifyValues: function () {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";
    if (this.isEmpty(data.name)) {
      warnStr = "班组姓名未填写~";
    } else if (this.isEmpty(data.workerTypeId)) {
      warnStr = "工种未填写~";
    } else if (!this.data.districtId) {
      warnStr = "地区未填写"
    } else {
      isSubmitAble = true;
    }

    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.5,
      warnStr: warnStr
    });
  },

  // // 班组列表全部工种
  // getTeamType: function () {
  //   var that = this;
  //   app.func.req('teamTypes/getAllList', {}, function (data) {
  //     that.initTeamType(data);
  //   });
  // },

  doSearch: function () {
    this.setData({
      canLoadMore: false,

      page: { index: -1, size: this.data.page.size },
      hires: [],
      teams: []
    });
    this.loadMoreHires();
  },


  loadMoreHires: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: { index: ++this.data.page.index, size: this.data.page.size }
      });
      this.getHires();
    }
  },


  doSave: function () {
    // 插入formId
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.bankName == null) {
      that.data.bankName = '';
    }
    if (that.data.idNumber) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(that.data.idNumber)) {
        wx.showToast({
          title: '身份证号不合法',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.cardNumber) {

      var idcardReg = /^([1-9]{1})(\d{14}|\d{18})$/;
      if (!idcardReg.test(that.data.cardNumber)) {
        wx.showToast({
          title: '银行卡号不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }

    app.func.req('teams/finishSignUp', {
      // code: that.data.verificationCode,
      // userName: that.data.phone,
      // password: that.data.password,
      title: that.data.name,
      // address: that.data.hireRegion,
      address: that.data.districtStr,
      "teamType.id": that.data.workerTypeId,
      "district.id": that.data.districtId,
      idNumber:that.data.idNumber,
      bankInfo: that.data.bankName,
      bankCardNo: that.data.cardNumber,
      formId: that.data.formId
      // provinceId: that.data.provinceId,
      // cityId: that.data.cityId
    }, function (data) {
      that.setData({
        isInCode: 1,
        isCodeTime: 60,
      })
      wx.showToast({
        title: '入驻成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/wd/wd',
            })
          }, 1500);
        }
      });
    });
  },

  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
    this.doVerifyValues();
  }
})
