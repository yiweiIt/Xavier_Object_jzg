//todo list 手机号码正确性验证
const app = getApp();
const util = require('../../utils/util.js');

Page({
    /*mapTitle = {"土建"：["木工","瓦工","钢筋"]}
    mapId = {"土建"：["12","34","45"]}
    map = {"土建": "TUJIAN"}*/
  data: {
    is_modal_Hidden: true,
    isprop: false,//发布招工类型说明
    isOrdinary:true,
    hiddenStamp: true,//发布招工类型说明
    hireRequestFlag: false,
    isShow:true,
    mapTitle:{},
    mapId: {},
    map:{},
    multiArray: [[], []],
    multiIndex: [0, 0],
    region: [[],[],[]],
    warnStr:"",

    hireSalary :"",
    workerType:"",
    hireTitle:"",
    typeOfWork:"",
    hireContacts:"",
    //hireDeadline:"",
    hireRegion: "",

    districtStr : null,    //区
    workerTypeId: null,
    hirePepoleNum: null,
    hireRequest: "",
    hirePhone: "",
    hireCode : null,
    // 地区修改参数
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
    quickInput:[{tipName: "有证优先"},{tipName: "包吃住"},{tipName: "急招"},{tipName: "少数民族非诚勿扰"},{tipName: "宿舍有空调"}]
  },
  setInfo: function(e) {
    var that = this
    var msg = new Array()
    if (e.target.dataset.tap) {
      msg.push(e.target.dataset.tap)
    }
    that.setData({
      hireRequest: that.data.hireRequest + msg
    })
    if (that.data.hireRequest.length > 200) {
      wx.showToast({
        title: '字数过多无法添加标签',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //城市切换
  changeThirdArea: function (event) {
    console.log(event.detail);
    var that = this;
    that.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      districtId: event.detail.countyId,
      localType: event.detail.areaTitle,
      hireTitle: event.detail.areaTitle + '-招' + that.data.typeOfWork
      // districtId: event.detail.countyId?event.detail.countyId:event.detail.cityId?event.detail.cityId:event.detail.provinceId,
      // localType: event.detail.areaTitle
    });
    console.log(that.data.districtId);
  },

  isEmpty: function(str){
    if(str == null || str == ""){
      return true;
    }else{
      return false;
    }
  },

  /** 验证输入值 */
  doVerifyValues : function(){
    var data = this.data;
    var isSubmitAble = false;
    var warnStr = "";
    // if (this.isEmpty(data.hireCode)){
    //   warnStr = "验证码未填写~";
    // } else
    if (this.isEmpty(data.hireContacts)){
      warnStr = "联系人未填写~";
    } /**else if (this.isEmpty(data.hireDeadline)){
      warnStr = "招工截止日期未填写~";
    }**/
    else if (this.isEmpty(data.hirePhone)) {
      warnStr = "手机号未填写~";
    } else if (this.isEmpty(data.hireTitle)) {
      warnStr = "招工标题未填写~";
    }
    else if (this.isEmpty(data.localType)) {
      warnStr = "地区未选择~";
    } else {
      isSubmitAble = true;
    }


    this.setData({
      isSubmitAble: isSubmitAble,
      warnStr: warnStr
    });
  },
  /*切换发布招工类型*/
  ordinary:function(e){
    if (e.currentTarget.dataset.type==0){
      this.setData({
        isOrdinary: true
      });
    }else{
      this.setData({
        isOrdinary: false
      });
    }
  },
  /**查看发布类型说明*/
  typeDescription: function () {
    app.isBind().then(value => {
      this.setData({
        hiddenStamp: false,
        hireRequestFlag: true
      })
    })
  },
  //确认按钮
  confirm: function (e) {
    var that = this;
    this.setData({
      hiddenStamp: true,
      hireRequestFlag: false
    });
  },
/*获取用户IP*/
getWechatIP:function(){
  var that = this;
  app.func.req('wxs/getWechatIP', {}, function (data) {
    if (data) {
      that.setData({
        ip: data
      })
    }
  })
},


  /*ios用户调取弹框*/
  iosTarget: function () {
    var that = this;
    that.setData({
      isprop: true
    });
  },
  /*复制客服微信号*/
  copyText: function (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  /*获取图片*/
  getUrgentWxQrcode: function () {
    var that = this;
    app.func.req('projectHires/getUrgentWxQrcode', {}, function (data) {
      if (data) {
        that.setData({
          wxName: data.data.name,
          dataImgUrl: data.data.url
        });
      }
    })
  },
  /*保存图片*/
  saveQR: function () {
    let that = this;
    var dataImgUrl = that.data.dataImgUrl;
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    util.checkPhotosAlbumPermissionByMP().catch(error => {
      wx.showToast({
        title: '您没有授权，无法保存到相册。请先到小程序设置页授权',
        icon: 'none'
      })
    })
      .then(value => {
        that.savePhoto(dataImgUrl);
      })
  },
  /*保存图片到相册*/
  savePhoto: function (dataImgUrl) {
    let that = this;
    wx.downloadFile({
      url: dataImgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
          }
        })
      }
    })
  },
  /*ios关闭弹框*/
  close_model: function () {
    var that = this;
    that.setData({
      isprop: false
    });
  },

  doSubmit: util.throttle(function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['tXpr_nXk9wBsnrAAfsiIx5lFjEgRpsg8VLcY4jXD278', 'uYvyuyxSltmJle6b9btUaSCHbXOQSQNgxs6d8Xf4EGU','19ZOOpihaiDPpwnJk_VnbfrZHaEjRPOwEl0OyINTHHc'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    that.setData({
      isSubmitAble: false
    })
    if (!that.data.hireTitle) {
      wx.showToast({
        title: '项目名不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.hireContacts) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.hirePhone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.workerTypeId) {
      wx.showToast({
        title: '工种不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.hirePepoleNum) {
      wx.showToast({
        title: '人数不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var regNum = new RegExp("^[0-9]*$");
    if (!regNum.test(that.data.hirePepoleNum)) {
      wx.showToast({
        title: '招聘人数必须为数字',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.hireSalary) {
      wx.showToast({
        title: '价格不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.hireRequest) {
      wx.showToast({
        title: '详情不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!util.isPhone(that.data.hirePhone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.data.isShow && !that.data.hireCode) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.isShow) {
      var isHired = '';
    } else {
      var isHired = that.data.hireCode;
    }
    wx.showLoading({
      title: '发布中...',
    })
    if (that.data.isOrdinary){
      var url = 'projectHires/wechatAddHire';
    }else{
      var url ='projectHires/userReleaseHire';
    }
    app.func.req(url, {
      projectName: that.data.hireTitle,
      streetAddress: that.data.hireRegion,
      contacts: that.data.hireContacts,
      phone: that.data.hirePhone,
      memo: that.data.hireRequest || '',
      teamTypeId: that.data.workerTypeId,
      peopleNumber: that.data.hirePepoleNum,
      salary: that.data.hireSalary,
      hireCode: isHired,
      districtStr: that.data.districtStr,
      provinceId: that.data.provinceId,
      cityId: that.data.cityId ? that.data.cityId : (that.data.provinceId),
      districtId: that.data.districtId ? that.data.districtId : (that.data.cityId),
      formId: that.data.formId
    }, function(data) {
      wx.hideLoading();
      if (data.code==200) {
        if (that.data.isOrdinary){
            wx.navigateTo({
              url: '../hireDetail/hireDetail?id=' + data.data,
            })
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
            });
          that.setData({
            isOrdinary:true,
            hiddenStamp:true,//发布招工类型说明
            isShow:true,
            mapTitle: {},
            mapId: {},
            map: {},
            multiArray: [[], []],
            multiIndex: [0, 0],
            region: ['广东省', '深圳市', '福田区'],
            isSubmitAble: false,
            warnStr: "",
            hireSalary: "",
            workerType: "",
            hireTitle: "",
            typeOfWork:"",
            hireContacts: "",
            hireRegion: "",
            workerTypeId: null,
            hirePepoleNum: null,
            hireRequest: "",
            hirePhone: "",
            hireCode: "",
            isInCode: 1,
            isCodeTime: 60
          });
        }else{
          that.setData({
            hireId: data.data
          })
          util.paymentMethod(data.data, app.globalData.openId, 1, 20).catch(error => {
            that.setData({
              is_modal_Hidden: true,
              hireRequestFlag: false
            });
          })
          .then(value => {
            if (value == 2) {/*有余额，可显示积分兑换，显示弹框*/
              that.paySuccess();
            } else {/*付款成功*/
              if (value != undefined) {
                that.setData({
                  is_modal_Hidden: false,
                  hireRequestFlag: true,
                  total: value / 100,/*推客积分剩余金额*/
                  use: 20/*需要使用推客积分*/
                });
              }
            }
          })
          // that.paymentMethod(data.data);
        }
      }
    });

  }, 1000),
  /*使用微信支付*/
  payDirectly: function () {
    var that = this;
    that.setData({
      is_modal_Hidden: true,
      hireRequestFlag: false
    });
    util.getWechatIP(that.data.hireId, app.globalData.openId, 20).catch(error => {
      wx.showToast({
        title: '操作失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
      .then(value => {
        if (value == 1) {
          that.paySuccess();
        }
      })
  },
  /*使用余额*/
  balancePayment: function () {
    var that = this;
    that.setData({
      is_modal_Hidden: true,
      hireRequestFlag: false
    });
    util.balancePayment(that.data.hireId, 1).catch(error => {
      wx.showToast({
        title: '操作失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
    })
      .then(value => {
        if (value == 1) {
          that.paySuccess();
        }
      })
  },
  /* 支付成功界面跳转*/
  paySuccess: function () {
    var that = this;
    wx.switchTab({
      url: '../index/index'
    });
    wx.showToast({
      title: '急聘招工发布成功',
      icon: 'success',
      duration: 2000
    });
  },
/**获取验证码 */
  getVerifyCode: function(){
    var that = this;
    if (util.isPhone(that.data.machineMoblie)) {
      wx.showModal({
        title: '提示',
        content: "手机号码格式错误~",
        success: function (res) {
        }
      })
      return;
    }
    var isCodeFun = setInterval(() => {
      var isCodeTime = that.data.isCodeTime - 1
      if (isCodeTime < 0) {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        clearInterval(isCodeFun)
      } else {
        that.setData({
          isCodeTime: isCodeTime
        })
      }

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

  bindHiresalary : function(e){
    this.setData({
      hireSalary: e.detail.value
    })
  },

  bindHireCode:function(e){
    this.setData({
      hireCode: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHirePhone: function(e){
    this.setData({
      hirePhone: e.detail.value
    });
    
    app.isBind().then(value => {
        if (this.data.hirePhone.length == 11){
          this.isHirePhone(this.data.hirePhone);
        }
    })

    this.doVerifyValues();
  },
  /*判断是否是本人*/
  isHirePhone:function(hirePhone){
    var that = this;
    app.func.req('projectHires/countByPhone', {
       phone: hirePhone
    }, function (data) {
      if (data.count > 0) {//是本人
        that.setData({
          isShow: true
        })
      } else {
        that.setData({
          isShow: false
        })
      }
    })
  },

  bindHireRequest: function(e){
    this.setData({
      hireRequest: e.detail.value
    });
  },

  bindHirePepoleNum: function(e){
    this.setData({
      hirePepoleNum: e.detail.value
    });
  },

  bindHireContacts:function(e){
    this.setData({
      hireContacts: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHireTitle: function(e){
    this.setData({
      hireTitle: e.detail.value
    });
    this.doVerifyValues();
  },

  bindDateChange: function(e){
    this.setData({
      hireDeadline: e.detail.value
    })
    this.doVerifyValues();
  },

  bindRegionChange: function(e){
    console.log(this.data.hireRegion)
    this.setData({
      region: e.detail.value,
      districtStr: e.detail.value[2],
      hireRegion: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    });
    console.log(e);
    this.doVerifyValues();
  },

  getHireInfo: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('projectHires/getWxHireDetail', {
          code:res.code,
          id: that.data.hireId
          }, function (data) {
          that.setData({
            invCode: data.source,
            hireInfo:data,
            hireTitle: data.title,
            hireContacts: data.contacts,
            hirePhone: data.phone,
            // hireRegion: data.area.fullTitle,
            localType: data.displayAddress,
            districtStr: data.displayAddress,
            districtId: data.districtId,
            provinceId:data.provinceId,
            cityId:data.cityId,
            // hireRegion: data.project.displayAddress,
            // localType: data.project.displayAddress,
            // districtStr: data.project.displayAddress,
            // workerType: data.teamType == null ? '' : data.teamType.category.text + "/" + data.teamType.title,
            workerType: data.teamType.title,
            typeOfWork:data.teamType.title,
            hirePepoleNum: data.peopleNumber,
            hireSalary: data.salary,
            hireRequest:data.memo,
            // districtStr: data.project.district.title,
            workerTypeId: data.teamType == null ? '' : data.teamType.id
          });
            if (data.phone !=null){
              that.setData({
                _phone: data.phone
              })
            }
            that.isHirePhone(data.phone);
        });
      }
    })
  },
  /**districtId
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      hireId: options.id
    });
    that.getHireInfo();
    that.getWechatIP();
    that.getUrgentWxQrcode();
    wx.getSystemInfo({
      success(res) {
        that.setData({
          platform: res.platform
        });
      }
    })
  },

  onShow: function(){
    this.setData({
      hireCode: ''
    })
  },
  //工种切换
  changeTeamType: function (event) {
    var typeOfWork = event.detail.teamTypeName.split("-")[1].replace(/\s/g, '');
    this.setData({
      workerType: typeOfWork,
      workerTypeId: event.detail.teamTypeId,
      typeOfWork: typeOfWork,
      hireTitle: this.data.localType + '-招' + typeOfWork
    });
  },
  modal_click_Hidden: function () {
    this.setData({
      is_modal_Hidden: true,
      hireRequestFlag: false
    });
  },
  onPullDownRefresh: function () {

  }
})
