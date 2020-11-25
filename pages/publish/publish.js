//todo list 手机号码正确性验证
const app = getApp();
const util = require('../../utils/util.js');

Page({
  data: {
    is_modal_Hidden: true,
    //isprop: "none",//发布招工类型说明
    isprop: false,
    hireRequestFlag:false,
    page: {
      index: 0
    },
    hiddenStamp:true,//发布招工类型说明
    isShow: true,
    isOrdinary:true,
    opacity: 0.5, //设置透明度
    toView: 'red',
    multiArray: [
      [],
      []
    ],
    // whetherEnter:0,
    multiIndex: [0, 0],
    region: ['广东省', '深圳市', '福田区'],
    isSubmitAble: false,
    hireSalary: "",
    workerType: "",
    typeOfWork:"",
    hireTitle: "",
    hireContacts: "",
    //hireDeadline:"",
    hireRegion: "",
    districtStr: null, //区
    workerTypeId: null,
    hirePepoleNum: null,
    hireRequest: "",
    hirePhone: "",
    hireCode: null,

    generate1: [ // 保存的省市区
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
    localArray: [
      [],
      [],
      []
    ],
    localIndex: '',
    localType: "",
    proed: 0,
    cityed: 0,
    qued: 0,
    isInCode: 1,
    isCodeTime: 60,
    formId: "",
    current: 0,//详情输入的字符
    max: 100,//详情最大输入字符

    districtId: 0,
    cityId: 0,// 市id
    provinceId:0,//省id
    quickInput:[{tipName: "有证优先"},{tipName: "包吃住"},{tipName: "急招"},{tipName: "少数民族非诚勿扰"},{tipName: "宿舍有空调"}]
  },
  formSubmit: util.throttle(function (e) {
    this.setData({
      formId: e.detail.formId
    });
    app.isBind().then(value => {
      this.doSubmit();
    })
  }, 1000),


  // 地区选择
  changeThirdArea: function (event) {
    var that = this;
    that.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      districtId: event.detail.countyId,
      localType: event.detail.areaTitle,
      hireTitle: event.detail.areaTitle + '-招' + that.data.typeOfWork
    });

    console.log(event.detail.areaTitle);
  },

  isEmpty: function(str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  auth: function() {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo === null) {
      wx.navigateTo({
        url: '../auth/auth',
      })
      return false
    } else {
      return true
    }
  },
  isBindPhone: function() {
    if (app.globalData.mPhone != null && app.globalData.mPhone != '') {
      return true;
    } else {
      return false;
    }
  },
  /**跳转 我的招工信息 */
  goMyHire: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wdzg/wdzg?mPhone=' + app.globalData.mPhone
      })
    })
  }, 1000),
  /** 验证输入值 */
  doVerifyValues: function() {
    var data = this.data;
    var isSubmitAble = false;
    var warnStr_2 = "";
    var warnStr_3 = "";
    var warnStr_4 = "";
    var warnStr_5 = "";
    var warnStr_6 = "";
    var warnStr_7 = "";
    var warnStr_8 = "";
    var pan = 0
    if (!this.data.isShow && this.isEmpty(data.hireCode)) {
      pan++
    }
    if (this.isEmpty(data.hirePhone)) {
      pan++
    }
    else if (this.isEmpty(data.districtId)) {
      pan++
    } else if (this.isEmpty(data.workerTypeId)) {
      pan++
    } else if (this.isEmpty(data.hirePepoleNum)) {
      pan++
    } else if (this.isEmpty(data.hireSalary)) {
      pan++
    } else if (this.isEmpty(data.hireRequest)) {
      pan++
    } else {
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

/*ios用户调取弹框*/
  iosTarget:function(){
    var that = this;
    that.setData({
      isprop:true
      // isprop: "flex"
    });
  },
/*复制客服微信号*/
  copyText:function(e){
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
  getUrgentWxQrcode:function(){
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
  saveQR:function(){
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
  close_model:function(){
    var that = this;
    that.setData({
      isprop: false
      // isprop: "none"
    });
  },
  /*提交 */
  doSubmit: util.throttle(function (e) {
      var that = this;
      var token = wx.getStorageSync('token');
      if (app.compareVersion()) {
        wx.requestSubscribeMessage({
          tmplIds: ['tXpr_nXk9wBsnrAAfsiIx5lFjEgRpsg8VLcY4jXD278', 'uYvyuyxSltmJle6b9btUaSCHbXOQSQNgxs6d8Xf4EGU', '19ZOOpihaiDPpwnJk_VnbfrZHaEjRPOwEl0OyINTHHc'],
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
      if (!that.data.districtId) {
        var that=this;
        that.setData({
          districtId: ""
        })
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
      if (that.data.isShow){
        var isHired = '';
      }else{
        var isHired = that.data.hireCode;
      }
      wx.showLoading({
        title: '发布中...',
      })
      if (that.data.isOrdinary){/*普通招工*/
        var url = 'projectHires/wechatAddHire';
      } else {/*急聘招工*/
        var url ='projectHires/userReleaseHire';
      }
      // app.func.req('projectHires/userAddHire', {
      app.func.req(url, {
        projectName: that.data.hireTitle,
        streetAddress: that.data.hireRegion,
        contacts: that.data.hireContacts,
        phone: that.data.hirePhone,
        memo: that.data.hireRequest,
        teamTypeId: that.data.workerTypeId,
        peopleNumber: that.data.hirePepoleNum,
        salary: that.data.hireSalary,
        districtStr: that.data.districtStr,
        provinceId: that.data.provinceId,
        cityId: that.data.cityId ? that.data.cityId : (that.data.provinceId),
        districtId: that.data.districtId ? that.data.districtId : (that.data.cityId),
        formId: that.data.formId,
        hireCode: isHired
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
                page: {
                  index: 0
                }
              })
          }else{
           // that.payMoney(data.data);
           /*先询问是否使用推客余额*/
            that.setData({
              hireId: data.data
            })
            util.paymentMethod(data.data, app.globalData.openId,1,20).catch(error => {
              that.setData({
                is_modal_Hidden: true,
                hireRequestFlag:false
              });
            })
            .then(value => {
              console.log('余额'+value);
              if (value == 2) {/*有余额，可显示积分兑换，显示弹框*/
                that.paySuccess();
              } else {/*付款成功*/
                if (value != undefined){
                  that.setData({
                    is_modal_Hidden: false,
                    hireRequestFlag:true,
                    total: value/100,/*推客积分剩余金额*/
                    use: 20/*需要使用推客积分*/
                  });
                }
              }
            })
          }
        }
      });
  }, 1000),

  /**获取验证码 */
  sendCode: function(){
    app.isBind().then(value => {
      this.getVerifyCode();
    })
  },
  getVerifyCode: function() {
    var that = this;
    if (this.isEmpty(that.data.hirePhone)) {
      wx.showModal({
        title: '提示',
        content: "手机号码不能为空~",
        success: function(res) {}
      })
      return;
    }
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

  bindHiresalary: function(e) {
    this.setData({
      hireSalary: e.detail.value
    })

    this.doVerifyValues()
  },

  bindHireCode: function(e) {
    this.setData({
      hireCode: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHirePhone: function(e) {
    var that = this
    that.setData({
      hirePhone: e.detail.value
    });
    that.doVerifyValues();
    app.isBind().then(value => {
        if (that.data.hirePhone.length == 11) {
          app.func.req('projectHires/countByPhone', {
            phone: that.data.hirePhone
          }, function (data) {
            if (data.count > 0) {
              that.setData({
                isShow: true
              })
            } else {
              that.setData({
                isShow: false
              })
            }
          })
        }
    })
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

  bindHireRequest: function(e) {
    var that=this
    var value = e.detail.value;
    var length = parseInt(value.length);

    if (length > this.data.max) {
      return;
    }
    this.setData({
      current: length,
      hireRequest: e.detail.value
    });
    console.log(that.data.hireRequest)

    this.doVerifyValues()
  },

  bindHirePepoleNum: function(e) {
    this.setData({
      hirePepoleNum: e.detail.value
    });
    this.doVerifyValues()
  },

  bindHireContacts: function(e) {
    this.setData({
      hireContacts: e.detail.value
    });
    this.doVerifyValues();
  },

  bindHireTitle: function(e) {
    this.setData({
      hireTitle: e.detail.value
    });
    this.doVerifyValues();
  },

  bindDateChange: function(e) {
    this.setData({
      hireDeadline: e.detail.value
    })
    this.doVerifyValues();
  },

  bindRegionChange: function(e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      region: e.detail.value,
      districtStr: e.detail.value[2],
      hireRegion: e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    });

    this.doVerifyValues();
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
  changetype: function () {
    wx.navigateTo({
      url: '../dl/dl?publish=1',
    })
  },
  onShow: function() {
    app.isBind().then(value => {
      this.getSearch(); // 查询最近发布的招工信息
    })
    this.setData({
      hireCode:''
    })
  },

  getSearch: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      isSubmitAble: true,
      opacity: 1
    })
    if (that.data.page.index >= that.data.cont) {
      that.setData({
        page: {
          index: 0
        }
      })
    }
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      hireTitle: '',
      hireContacts: '',
      hirePhone: '',
      localType: '',
      workerType: '',
      districtId: '',
      workerTypeId: '',
      hirePepoleNum: '',
      hireSalary: '',
      hireRequest: '',
      isShow: true,
      cont: '',
      provinceId: '',
      cityId: '',

    })
    app.func.req('projectHires/getLastHireInfo', {
      num: that.data.page.index,
      phone:wx.getStorageSync('mobile')
    }, function(data) {
      wx.hideLoading()
      if (data.code == 200 && data.count != 0){
          that.setData({
            hireTitle: data.data.projectName ? data.data.projectName : data.data.districtStr + '-招' + data.data.workerTypeName,
            hireContacts: data.data.contacts,
            hirePhone: data.data.phone ? data.data.phone : wx.getStorageSync('mobile') || app.globalData.mPhone,
            localType: data.data.districtStr,
            workerType: data.data.workerTypeName,
            typeOfWork: data.data.workerTypeName,
            districtId: data.data.districtId,
            workerTypeId: data.data.workerType,
            hirePepoleNum: data.data.workerNum,
            hireSalary: data.data.salary,
            hireRequest: data.data.memo,
            isShow: true,
            cont: data.count,
            provinceId: data.data.provinceId,
            cityId: data.data.cityId,
          })
       // console.log(that.data.hirePhone)
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        that.setData({
          workerType: currPage.data.name ? currPage.data.name : that.data.workerType,
          workerTypeId: currPage.data.id ? currPage.data.id : that.data.workerTypeId
        })
        }
    })
  },
  rePlace: function() {
    app.isBind().then(value => {
      this.setData({
        page: {
          index: ++this.data.page.index
        }
      })
      this.getSearch()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getUrgentWxQrcode();
    wx.getSystemInfo({
      success(res) {
        that.setData({
          platform: res.platform
        });
      }
    })
  },
  onPullDownRefresh: function() {

  },
/**查看发布类型说明*/
  typeDescription: function () {
    app.isBind().then(value => {
      this.setData({
        hiddenStamp: false,
        hireRequestFlag:true
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

  /*使用微信支付*/
  payDirectly:function(){
    var that = this;
    that.setData({
      is_modal_Hidden:true,
      hireRequestFlag:false
    });
    util.getWechatIP(that.data.hireId,app.globalData.openId,20).catch(error => { 
      wx.showToast({
        title: '操作失败，请稍后再试',
        icon: 'none',
        duration: 2000
      })
     })
    .then(value => {
      if(value==1){
        that.paySuccess();
      }
    })
  },
 /*使用余额*/
  balancePayment:function(){
    var that = this;
    that.setData({
      is_modal_Hidden: true,
      hireRequestFlag:false
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
  paySuccess:function(){
    var that= this;
    wx.switchTab({
      url: '../index/index'
    });
    wx.showToast({
      title: '急聘招工发布成功',
      icon: 'success',
      duration: 2000
    });
    that.setData({
      page: {
        index: 0
      }
    })
  },
  modal_click_Hidden:function(){
    this.setData({
      is_modal_Hidden: true,
      hireRequestFlag: false
    });
  },
  onShareAppMessage: function (ops) {
    return {
      title: '招工用工找建筑港',
      path: "pages/publish/publish?inviteCode=" + wx.getStorageSync('openId'),
      imageUrl: "https://static.jianzhugang.com/mini/image/publishShare.jpg",
      success: function (res) {
        wx.showToast({
          title: '邀请已发送，请耐心等待',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '邀请失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
})
/*敏感词*/
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
