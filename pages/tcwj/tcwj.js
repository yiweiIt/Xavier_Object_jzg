const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    iscode: 1,
    isInCode: 1,
    iscodeTime: 60,
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
    canLoadMore: true,  //是否有下一页
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
    allAddress: '',
    jxNamesArray: [[], []],
    jxIdsArrayed: [[], []],
    jxIdsArray: [[], []],
    jxIdsArray2: [],
    jxIdsArraying: [[], []],
    jxIndex: [0, 0],
    jxName: '班组地区',

    heighted: '',
    userName: "",// 初始化手机号
    // code: "",// 初始化验证码
    verificationCode: "",
    password: "",// 初始化密码
    title: "",//  初始化商店名称
    ownerName: "",// 初始化店主姓名
    phone: "",//  初始化联系电话
    streetAddress: "",//  初始化街道地址
    isSubmitAble: false,
    warnStr: "手机号未填写~",
    opacity: 0.5,
    localArray: [[], [], []],
    record1: [],        // 生成下来的省市区
    record2: [],
    record3: [],
    localIndex: '',
    localType: "",
    districtStr: null,
    proed: 0,
    cityed: 0,
    qued: 0,
    district_id: 0,
    formId: ''
  },
  // 提交数据
  formSubmit: function (e) {
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
   * 跳转 五金店铺详情
   */
  goShopDetail: util.throttle(function (e) {
    wx.navigateTo({
      url: '../tcwj/wjdetail/wjdetail?id=' + e.currentTarget.dataset.name,
    })
  }, 1000),

  /* 上拉 */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.setData({
      page: { index: -1, size: this.data.page.size },
    });
    this.loadMoreTeams();
  },

  /*下拉加载更多*/
  onReachBottom: function () {

    if (parseInt(this.data.currentTab) === 0) {
      this.loadMoreTeams();
    } else {
      // console.log('不回加载')
    }
  },

  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },

  loadMoreTeams: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: { index: ++this.data.page.index, size: this.data.page.size }
      });
      this.getTeams();
    }
  },

  getTeams: function () {
    var that = this;
    app.func.req('shops/query', {
      page: that.data.page.index,
      size: that.data.page.size
    }, function (data) {
      if (data) {
        that.setData({
          canLoadMore: !data.last,
          teams: that.data.teams.concat(data.content),
        });
      }
      that.setData({
        height: that.data.teams.length * 200,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.loadMoreTeams();
    var that = this;
    this.getNotes();
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
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (app.isBindPhone()) {
      app.func.req3('scores/wxShare', {}, function (data) {
        if (data.error) {
          wx.showToast({
            title: data.message,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '恭喜你，获得2积分',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    return {
      title: '建筑港五金店铺',
      path: '/pages/tcwj/tcwj',
      success: function (res) {  // 转发成功
      },
      fail: function (res) { // 转发失败
      }
    }
  },
  showMask: function () {
    this.setData({ isMaskHidden: false });
  },

  //消失
  hideMask: function () {
    this.setData({ isMaskHidden: true });

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
  bindName: function (e) {
    this.setData({
      ownerName: e.detail.value
    })
    this.doVerifyValues()
  },
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    this.doVerifyValues()
  },
  bindStreetaddr: function (e) {
    this.setData({
      streetAddress: e.detail.value
    })
    this.doVerifyValues()
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
          iscode: 1,
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
  /**
   * 验证输入值
   */
  doVerifyValues: function () {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";

    if (this.isEmpty(data.userName)) {
      warnStr = "手机号未填写~";
    } else if (this.isEmpty(data.verificationCode)) {
      warnStr = "验证码未填写~";
    } else if (this.isEmpty(data.password)) {
      warnStr = "登入密码未填写~";
    } else if (this.isEmpty(data.title)) {
      warnStr = "商店名称未填写~";
    } else if (this.isEmpty(data.ownerName)) {
      warnStr = "店主姓名未填写~";
    } else if (this.isEmpty(data.phone)) {
      warnStr = "联系电话未填写~";
    } else if (this.isEmpty(data.district_id)) {
      warnStr = "区域未选择~";
    } else if (this.isEmpty(data.streetAddress)) {
      warnStr = "街道地址未填写~";
    } else {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
      var phoneNum1 = data.userName;
      var phoneNum = data.phone;//联系电话
      var flag1 = reg.test(phoneNum1);
      var flag = reg.test(phoneNum); //true
      if (!flag1) {
        warnStr = '手机号格式不正确！'
      } else if (!flag) {
        warnStr = '联系电话格式不正确！'
      } else {
        isSubmitAble = true;
      }

    }

    // 判断填写字符的格式，限制辱骂或者垃圾信息

    /**提交按钮disabled状态 */
    this.setData({
      isSubmitAble: isSubmitAble,
      opacity: isSubmitAble ? 1 : 0.5,
      warnStr: warnStr
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
      typeId: 3
    }, function (data) {
      if (data) {
        that.setData({
          notes: data
        });
      }
    });
  },

  doSearch: function () {
    this.setData({
      canLoadMore: true,
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

  getHires: function () {
    var that = this;

    // app.func.req('projectHires/query', {
    app.func.req('teams/query', {
      page: that.data.page.index,
      size: that.data.page.size,
      // status: 'AUDITED',
      status: 'TEAM_STATUS_NORMAL',
      queryWord: that.data.queryWord,
      // typeId: that.data.typeId ? that.data.typeId : '',
      typeId: that.data.typeResArr ? that.data.typeResArr : '',
      category: that.data.typeResArr2 ? that.data.typeResArr2 : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
    }, function (data) {
      if (data) {
        that.setData({
          canLoadMore: !data.last,
          teams: that.data.teams.concat(data.content),
        });
      }
    });
  },


  doSubmit: function () {
    var that = this;
    that.setData({
      isSubmitAble: false
    })
    app.func.req('shops/insertShop', {
      userName: that.data.userName,
      code: that.data.verificationCode,
      password: that.data.password,
      title: that.data.title,
      ownerName: that.data.ownerName,
      phone: that.data.phone,
      hireCode: that.data.hireCode,
      // districtStr: that.data.districtStr,
      district_id: that.data.district_id,
      streetAddress: that.data.streetAddress,
    }, function (data) {
      wx.showToast({
        title: '入驻成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          setTimeout(function () {
            wx.redirectTo({
              url: '../tcwj/tcwj'
            });
          }, 1500);
        }
      });
      that.setData({
        currentTab: 0
      });
    });
  }
})
