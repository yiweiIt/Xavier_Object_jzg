// pages/machinepublish/machinepublish.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    page: {
      index: -1,
      size: 20,

      winWidth: 0,
      winHeight: 0,
      currentTab: 0,
      duration: 100
    },
    currentTab: 0,
    queryWord: "", //搜索关键字
    canLoadMore: false, //是否有下一页

    jxNamesArray: [
      [],
      []
    ],
    jxIdsArrayed: [
      [],
      []
    ],
    jxIdsArray: [
      [],
      []
    ],
    jxIdsArray2: [],
    jxIdsArraying: [
      [],
      []
    ],
    jxIndex: [0, 0],
    jxName: '选择地区',

    localArray: [
      [],
      [],
      []
    ],
    localIndex: '',

    cityId: null,
    provinceId: null,
    machineries: [],
    height: 1200,
    cityId: null,
    provinceId: null,

    name: "",
    typeArray: [
      [],
      []
    ],
    typeIndex: [0, 0],
    typeId: '',
    mt: [],
    mtk: [],

    jxlNamesArray: [
      [],
      []
    ],
    jxlIdsArray: [
      [],
      []
    ],
    jxlIndex: [0, 0],
    machineName: "选择机械",
    jxlName: "选择机械",


    typeArray2: [
      [],
      []
    ],
    typeIndex2: [0, 0],
    typeId2: '',
    mt2: [],
    mtk2: [],

    typeName: "机械分类", //工种名称
    teams: [],
    shuoming: '',
    // memo: "",
    code: '',
    types: '',
    allMachineAsk: [], // 机械分类总数据
    allArea: [], // 地区分类总数据
    districtId: '', // 地区期筛选信息
    machineAskId: '', // 机械分类筛选信息
    cateId: '', // 机械列表的机械分类选中 id

    allMachineAsk2: '', // 机械分类总数据
    allArea2: [], // 地区分类总数据
    districtId2: '', // 地区期筛选信息
    machineAskId2: '', // 机械分类筛选信息
    opacity: 0.5, //设置透明度

    // 限定高度
    heighted: '',
    isInCode: 1,
    isCodeTime: 60,
    priceArray: ['元/天', '元/月'],
    machinePriceArray: ['元/天', '元/月','台/班'],
    pricevalue: '元/天',
    priceindex: 0
  },

  /**
   * 获取机械入驻表单的机械分类信息
   */
  getMechanicalForm() {
    var that = this;
    app.func.req('dicts/getDictsCategory', {
      categoryKey: "MACHINE_CATEGORY"
    }, function(data) {
      var arr1 = []
      var allMachineAsk2 = []
      var titles = []
      data.forEach((v, k) => {
        arr1.push(v.categroy)
        allMachineAsk2.push(v)
      })

      data[0].titles.forEach((v, k) => {
        titles.push(v.title)
      })
      that.setData({
        jxlNamesArray: [arr1, titles],
        allMachineAsk2: allMachineAsk2
      })
    });
  },

  isEmpty: function(str) {
    if (str == null || str == " " || str == "" || str == undefined) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 获取验证码
   */
  getVerifyCode: function() {
    var that = this;
    if (!util.isPhone(that.data.machineMoblie)) {
      wx.showModal({
        title: '提示',
        content: "手机号码格式错误~",
        success: function(res) {}
      })
      return;
    }
    var isCodeFun = setInterval(() => {
      var isCodeTime = that.data.isCodeTime - 1
      that.setData({
        isCodeTime: isCodeTime
      })
    }, 1000)
    util.sendVerifyCode(that.data.machineMoblie, function() {
      that.setData({
        isInCode: 0 // 已经发送后要过1分钟才能在发送
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
  // 找机械提交表单
  rentSubmit: function(e) {
    var that = this;
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['QHcUMKsJPvYxehjTpyO9GlOb0_41FtoDp_02c7b5HUY'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    if(that.isEmpty(that.data.cateId)){
      wx.showToast({
        title: '机械分类未选择',
        icon: 'none',
        duration: 2000
      })
    }else if (that.isEmpty(that.data.machineAmount)) {
      wx.showToast({
        title: '数量不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        amount: true
      })
    } else if (that.isEmpty(that.data.machinePrice)) {
      wx.showToast({
        title: '价格不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        price: true
      })
    } else if (that.isEmpty(that.data.machineContacts)) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        contacts: true
      })
    } else if (that.isEmpty(that.data.machineMoblie)) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        phone: true
      })
    } else if (!that.data.isShow && that.isEmpty(that.data.code)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.districtId) {
      wx.showToast({
        title: '机械地区未选择',
        icon: 'none',
        duration: 2000
      })
    } else if (that.isEmpty(that.data.streetaddress)) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        addressInput: true
      })
    }
    // else if (that.isEmpty(that.data.dates)) {
    //   wx.showToast({
    //     title: '请选择工期',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // } else if (that.isEmpty(that.data.ends)) {
    //   wx.showToast({
    //     title: '请选择工期',
    //     icon: 'none',
    //     duration: 2000
    //   })
    // }
    else if (that.isEmpty(that.data.mark)) {
      wx.showToast({
        title: '备注不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        marks: true,
      })
    } else {
      var title = that.data.districtStr + '项目-找' + that.data.jxlName;
      var address = that.data.districtStr + that.data.streetaddress;
      var token = wx.getStorageSync('token');
      var strPrice = that.data.machinePrice + that.data.pricevalue;
      app.func.req('machine/machineIns/saveMachineIn', {
        title: title,
        machineTypeId: that.data.cateId, // 机械分类
        number: that.data.machineAmount, // 机械数量
        price: strPrice, // 价格
        priceType: that.data.machinePriceIndex, //价格类型
        contract: that.data.machineContacts, // 联系人
        phone: that.data.machineMoblie, // 联系电话
        code: that.data.code|| '', // 验证码
        areaId: that.data.districtId,
        address: address, // 详细地址
        // lastInTime: that.data.ends,
        // firstInTime: that.data.dates,
        remark: that.data.mark
      }, function (data) {
        that.setData({
          isInCode: 1,
          isCodeTime: 60,
        })
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500,
          complete: function () {
            that.removeStorage();
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      });
    }
  },

  // 出租机械提交表单
  letSubmit: function(e) {
    var that = this;
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['QHcUMKsJPvYxehjTpyO9GlOb0_41FtoDp_02c7b5HUY'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    if(that.isEmpty(that.data.cateId)){
      wx.showToast({
        title: '机械分类未选择',
        icon: 'none',
        duration: 2000
      })
    }
     else if (that.isEmpty(that.data.model)) {
      wx.showToast({
        title: '型号不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        inmodel: true
      })
    } else if (that.isEmpty(that.data.machineContacts)) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        contacts: true
      })
    } else if (that.isEmpty(that.data.machineMoblie)) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        phone: true
      })
    } else if (!that.data.isShow && that.isEmpty(that.data.code)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.districtStr) {
      wx.showToast({
        title: '请先获取当前机械定位',
        icon: 'none',
        duration: 2000
      })
    }  else if (that.isEmpty(that.data.machinePrice)) {
      wx.showToast({
        title: '价格不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        price: true,
      })
    }
    else {
      var title = that.data.districtAddrss + '-出租' + that.data.jxlName;
      var strPrice = that.data.machinePrice + that.data.pricevalue;
      var token = wx.getStorageSync('token');
      app.func.req('machine/machineOuts/saveMachineOut', {
        title: title,
        machineTypeId: that.data.cateId, // 机械分类
        version: that.data.model, // 机械型号
        contract: that.data.machineContacts, // 联系人
        phone: that.data.machineMoblie, // 联系电话
        code: that.data.code || '', // 验证码
        price: strPrice, // 价格
        priceType: that.data.machinePriceIndex, //价格类型
        // areaId: that.data.districtId,
        // address: address, // 详细地址
        remark: that.data.mark?that.data.mark:''
      }, function (data) {
          that.setData({
            isInCode: 1,
            isCodeTime: 60,
          })
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 1500,
            complete: function () {
              that.removeStorage();
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
      });
    }
  },

  // 机手入驻
  applySubmit: function(e) {
    var that = this;
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['uYvyuyxSltmJle6b9btUacfH0DaKa54sgvwhS7871IE'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    if(that.isEmpty(that.data.cateId)){
      wx.showToast({
        title: '机械分类未选择',
        icon: 'none',
        duration: 2000
      })
    } else if (that.isEmpty(that.data.age)) {
      wx.showToast({
        title: '驾机工龄不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        inage: true
      })
    } else if (that.isEmpty(that.data.machinePrice)) {
      wx.showToast({
        title: '工资不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        price: true
      })
    } else if (that.isEmpty(that.data.machineContacts)) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        contacts: true
      })
    } else if (that.isEmpty(that.data.machineMoblie)) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        phone: true
      })
    } else if (!that.data.isShow && that.isEmpty(that.data.code)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.districtStr) {
      wx.showToast({
        title: '请先获取当前定位',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var title = that.data.districtAddrss + '-' + that.data.jxlName + '司机';
      var address = that.data.districtStr + that.data.streetaddress;
      var token = wx.getStorageSync('token');
      var strPrice = that.data.machinePrice + that.data.pricevalue;
      app.func.req('machine/machinerWants/saveMachinerWant', {
        title: title,
        machineTypeId: that.data.cateId, // 机械分类
        workYear: that.data.age, // 工龄
        pay: strPrice, //期望工资
        payType: that.data.priceindex, // 工资类型
        contract: that.data.machineContacts, // 联系人
        phone: that.data.machineMoblie, // 联系电话
        code: that.data.code || '', // 验证码
        // areaId: that.data.districtId,
        // address: address, // 详细地址
        remark: that.data.mark?that.data.mark:''
      }, function (data) {
        that.setData({
          isInCode: 1,
          isCodeTime: 60,
        })
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500,
          complete: function () {
            that.removeStorage();
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      });
    }
  },

  // 招聘机手
  mechanicSubmit: function (e) {
    var that = this;
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['uYvyuyxSltmJle6b9btUae_LpG8UeTORJFxgGAYytQQ'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    if(that.isEmpty(that.data.cateId)){
      wx.showToast({
        title: '机械分类未选择',
        icon: 'none',
        duration: 2000
      })
    }
    else if (that.isEmpty(that.data.peopleNumber)) {
      wx.showToast({
        title: '机手人数不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        peopleNumber: true
      })
    } else if (that.isEmpty(that.data.machinePrice)) {
      wx.showToast({
        title: '工资不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        price: true
      })
    } else if (that.isEmpty(that.data.machineContacts)) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        contacts: true
      })
    } else if (that.isEmpty(that.data.machineMoblie)) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        phone: true
      })
    } else if (!that.data.isShow && that.isEmpty(that.data.code)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
    } else if (!that.data.districtStr) {
      wx.showToast({
        title: '所在区域未选择',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      var title = that.data.districtStr + '-招' + that.data.jxlName+'机械手';
      var address = that.data.districtStr + that.data.streetaddress;
      var token = wx.getStorageSync('token');
      var strPrice = that.data.machinePrice + that.data.pricevalue;
      app.func.req('machineRecruit/saveMachineRecruit', {
        title: title,
        machineTypeId: that.data.cateId, // 机械分类
        // workYear: that.data.age, // 工龄
        peopleNumber: that.data.peopleNumber,
        salary: strPrice, //工资
        payType: that.data.priceindex, // 工资类型
        contract: that.data.machineContacts, // 联系人
        phone: that.data.machineMoblie, // 联系电话
        code: that.data.code|| '', // 验证码
        areaId: that.data.districtId,
        // address: address, // 详细地址
        remark: that.data.mark?that.data.mark:''
      }, function (data) {
        that.setData({
          isInCode: 1,
          isCodeTime: 60,
        })
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1500,
          complete: function () {
            that.removeStorage();
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.id === 'rent') {
      this.setData({
        machineType: 'rent'
      })
    }
    if (options.id === 'let') {
      this.setData({
        machineType: 'let'
      })
    }
    if (options.id === 'mechanic'){
      this.setData({
        machineType: 'mechanic'
      })
    }
    if (options.id === 'apply') {
      this.setData({
        machineType: 'apply'
      })
    }
    this.getMechanicalForm();
  },

  onShow: function() {
    this.loadStorage();
    if (wx.getStorageSync("jx_machineMoblie")==wx.getStorageSync('mobile')){
      this.setData({
        isShow: true
      })
    }else{
      this.setData({
        isShow: false
      })
    }
  },

  changeThirdArea: function (event) {
    this.setData({
      districtId: event.detail.countyId,
      districtStr: event.detail.areaTitle
    })
    if (!event.detail.countyId) {
      wx.showToast({
        title: '请选择完整机械地区',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.setStorageSync("jx_districtId", event.detail.countyId);
      wx.setStorageSync("jx_districtStr", event.detail.areaTitle);
    }
  },
  /*自动获取用户定位*/
  checkHasLocationPermissionByMP:function(){
    wx.showLoading({ title: '加载中'})
    util.checkHasLocationPermissionByMP().catch( error => {
       wx.hideLoading();
       console.log(error);
    })
    .then( value => {
      wx.hideLoading();
      var districtAddrss = value.result.address_component.province+value.result.address_component.city+value.result.address_component.district;
      console.log(districtAddrss);
      this.setData({
        districtStr:value.result.address,
        districtAddrss:districtAddrss
      })
       wx.setStorageSync("jx_districtStr", value.result.address);
       wx.setStorageSync("jx_districtAddrss", districtAddrss);
    })
  },
  priceChange: function (e) {
    console.log(this.data.priceArray[e.detail.value]);
    this.setData({
      pricevalue: this.data.priceArray[e.detail.value],
      priceindex: e.detail.value
    })
    wx.setStorageSync('jx_pricevalue', this.data.priceArray[e.detail.value]);
    wx.setStorageSync('jx_priceindex', e.detail.value);
  },

  machinePriceChange: function (e) {
    this.setData({
      machinePriceValue: this.data.machinePriceArray[e.detail.value],
      machinePriceIndex: e.detail.value
    })
    wx.setStorageSync('jx_machinePriceValue', this.data.machinePriceArray[e.detail.value]);
    wx.setStorageSync('jx_machinePriceIndex', e.detail.value);
  },


  bindMechanicalFormChange: function (e) {
    var cateId = ''
    var typeName = ''
    var idx = e.detail.value[0];

    cateId = this.data.allMachineAsk2[idx].titles[e.detail.value[1]].id;
    typeName = this.data.allMachineAsk2[idx].categroy +
      '/' +
      this.data.allMachineAsk2[idx].titles[e.detail.value[1]].title;
    var jxlName = this.data.allMachineAsk2[idx].titles[e.detail.value[1]].title;

    wx.setStorageSync("jx_cateId", cateId);
    wx.setStorageSync("jx_machineName", typeName);
    wx.setStorageSync("jx_jxlName", jxlName);

    this.setData({
      cateId: cateId,
      machineName: typeName,
      jxlName: jxlName
    })
  },
  bindMechanicalFormColumnChange: function (e) {
    let result = this.data
    let that = this
    let fen = [] // 子级数组
    that.data.allMachineAsk2[e.detail.value].titles.forEach((v, k) => {
      fen.push(v.title)
    })
    if (e.detail.column == 0) {
      this.setData({
        jxlNamesArray: [that.data.jxlNamesArray[0], fen],
        jxlIndex: [e.detail.value, 0]
      })
    }
  },

  //数量
  bindAmountInput: function(e) {
    this.setData({
      machineAmount: e.detail.value
    })
    wx.setStorageSync("jx_machineAmount", e.detail.value)
  },
  //价格
  bindPriceInput: function(e) {
    this.setData({
      machinePrice: e.detail.value
    })
    wx.setStorageSync("jx_machinePrice", e.detail.value)
  },
  //联系人
  bindContactsInput: function(e) {
    this.setData({
      machineContacts: e.detail.value
    })
    wx.setStorageSync("jx_machineContacts", e.detail.value)
  },
  //联系电话
  bindMoblieInput: function(e) {
    var that = this;
    that.setData({
      machineMoblie: e.detail.value
    })
    wx.setStorageSync("jx_machineMoblie", e.detail.value);
    if (wx.getStorageSync('mobile') && wx.getStorageSync('mobile') != e.detail.value){
      this.setData({
        isShow: false
      });
    }else{
      this.setData({
        isShow: true
      });
    }
  },

  //验证码
  bindCodeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 详细地址
  bindStreetInput: function(e) {
    this.setData({
      streetaddress: e.detail.value
    })
    wx.setStorageSync("jx_streetaddress", e.detail.value)
  },
  // 最迟入场时间
  bindDateChange: function(e) {
    this.setData({
      dates: e.detail.value
    })
    wx.setStorageSync("jx_dates", e.detail.value)
  },
  // 止
  bindEndChange: function(e) {
    this.setData({
      ends: e.detail.value
    })
    if (util.transTime(this.data.ends + ' 00:00:00') <= util.transTime(this.data.dates + ' 00:00:00')) {
      wx.showModal({
        title: '提示',
        content: '工期截止期选择错误，请重新选择',
      })
      this.setData({
        ends: ''
      })
    } else {
      wx.setStorageSync("jx_ends", e.detail.value)
    }
  },
  // 备注
  bindMarkInput: function(e) {
    this.setData({
      mark: e.detail.value
    });
    wx.setStorageSync("jx_mark", e.detail.value)
  },
  // 型号
  bindmodelIpnut: function(e) {
    this.setData({
      model: e.detail.value
    });
    wx.setStorageSync("jx_model", e.detail.value)
  },

  bindageInput: function(e) {
    this.setData({
      age: e.detail.value
    });
    wx.setStorageSync("jx_age", e.detail.value)
  },

  bindPeopleNumberInput: function(e) {
    this.setData({
      peopleNumber: e.detail.value
    });
    wx.setStorageSync("jx_peopleNumber", e.detail.value)
  },

  loadStorage(){
    var cateId= wx.getStorageSync("jx_cateId");
    var machineName = wx.getStorageSync("jx_machineName");
    var jxlName = wx.getStorageSync("jx_jxlName");
    var machineAmount = wx.getStorageSync("jx_machineAmount");
    var machinePrice = wx.getStorageSync("jx_machinePrice");
    var pricevalue = wx.getStorageSync("jx_pricevalue");
    var priceindex = wx.getStorageSync("jx_priceindex");
    var machinePriceValue = wx.getStorageSync("jx_machinePriceValue");
    var machinePriceIndex = wx.getStorageSync("jx_machinePriceIndex");
    var machineContacts = wx.getStorageSync("jx_machineContacts");
    var machineMoblie = wx.getStorageSync("jx_machineMoblie");
    var districtId = wx.getStorageSync("jx_districtId");
    var districtStr = wx.getStorageSync("jx_districtStr");
    var streetaddress = wx.getStorageSync("jx_streetaddress");
    var dates = wx.getStorageSync("jx_dates");
    var ends = wx.getStorageSync("jx_ends");
    var mark = wx.getStorageSync("jx_mark");
    var age = wx.getStorageSync("jx_age");
    var model = wx.getStorageSync("jx_model");
    var peopleNumber = wx.getStorageSync("jx_peopleNumber");
    var districtAddrss = wx.getStorageSync("jx_districtAddrss");

    this.setData({
      cateId: cateId ? cateId : '',
      machineName: machineName ? machineName : "选择机械",
      jxlName: jxlName ? jxlName : '',
      machineAmount: machineAmount ? machineAmount : '',
      machinePrice: machinePrice ? machinePrice : '',
      pricevalue: pricevalue ? pricevalue : '元/天',
      priceindex: priceindex ? priceindex : 0,
      machinePriceValue: machinePriceValue ? machinePriceValue : '元/天',
      machinePriceIndex: machinePriceIndex ? machinePriceIndex : 0,
      machineContacts: machineContacts ? machineContacts : '',
      machineMoblie: machineMoblie ? machineMoblie : '',
      districtId: districtId ? districtId : '',
      districtStr: districtStr ? districtStr : '',
      districtAddrss:districtAddrss?districtAddrss:'',
      streetaddress: streetaddress ? streetaddress : '',
      dates: dates ? dates : '',
      ends: ends ? ends : '',
      mark: mark ? mark : '',
      age: age ? age : '',
      model: model ? model : '',
      peopleNumber: peopleNumber ? peopleNumber : '',
    })
  },

  removeStorage(){
    wx.removeStorageSync("jx_cateId")
    wx.removeStorageSync("jx_machineName")
    wx.removeStorageSync("jx_jxlName")
    wx.removeStorageSync("jx_machineAmount")
    wx.removeStorageSync("jx_machinePrice")
    wx.removeStorageSync("jx_pricevalue")
    wx.removeStorageSync("jx_priceindex")
    wx.removeStorageSync("jx_machinePriceValue")
    wx.removeStorageSync("jx_machinePriceIndex")
    wx.removeStorageSync("jx_machineContacts")
    wx.removeStorageSync("jx_machineMoblie")
    wx.removeStorageSync("jx_districtId")
    wx.removeStorageSync("jx_districtStr")
    wx.removeStorageSync("jx_streetaddress")
    wx.removeStorageSync("jx_dates")
    wx.removeStorageSync("jx_ends")
    wx.removeStorageSync("jx_mark")
    wx.removeStorageSync("jx_age")
    wx.removeStorageSync("jx_model")
    wx.removeStorageSync("jx_peopleNumber")
  }

})
