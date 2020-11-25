/**招工详情 */
const app = getApp()
Page({
  data: {
    hireInfo: {},
    hireId: 0,
    phone: '',
    kefuWeChat: 'Jzg-hg',
    isFullPhone: false,   //招工号码是否完整
    hiddenmodalput: true, // 举报模态框判定
    is_modal_Hidden: true, // x
    is_modal_Msg: '分享查看更多信息',
    mReportCategory: "",
    reportCategorys: [] ,  //举报内容选项
    buttons: [{ text: '取消' }, { text: '确定' }],
    remark:"",
    mScore:'',
    openType:true,
    firstShare:'',
    shareTitle:'',
    isRegistered:''//是否报名
  },

  onLoad: function (options) {
    var that = this;
    this.getKeFuWeChat();
    this.setData({
      hireId: options.id ? options.id : options.scene ? options.scene : '',
      userInfo: wx.getStorageSync('userInfo'),
      // imagePath: options.src
    });
    this.getHireInfo();
    this.getHireReportCategory();
    // 用户是否初次使用小程序
    if (app.globalData.accountType === 'NEW_MINI_APP_USER') {
      that.setData({
        isRuleTrue: true
      })
    }
  },


  onShow: function () {
    this.checkIsRegistered();
  },

  isShiMinFun: function () {
    if (!app.globalData.isShiMin) {
      wx.showModal({
        title: '温馨提示',
        content: '请先绑定手机号！',
        confirmText: "绑定手机",
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../smrz/smrz',
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  downLoad: function () {
    wx.showLoading({
      title: '页面跳转中',
    })
    wx.navigateTo({
      url: '../../pages/jzgpublic/jzgpublic',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  // 复制微信号
  copyText: function (e) {
    console.log(e);
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
  /**获取我的积分**/
  getScore: function () {
    var that = this;
    app.func.req('scores/getScoreByAccId', {}, function (data) {
      if (!data.error) {
        if (data.currentScore>0){
          that.setData({
            mScore: true
          })
        }else{
          that.setData({
            mScore: false
          })
        }
      }
    });
  },
  // 获取完整手机号
  getContactPhone: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req3("projectHires/getFullPhone", {
        hireId: that.data.hireId
      }, function (data) {
        if (data.status == 200) {
          if (data.type == 3){//每天前三次免费
            wx.showToast({
              title: '获取成功',
              icon: 'none',
              duration: 1000
            })
          }else{
            wx.showToast({
              title: '获取成功，消耗1积分',
              icon: 'none',
              duration: 1000
            })
          }
          that.setData({
            openType: true,
            phone: data.phone,
            isFullPhone: true
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1000);
        } else {
          if (data.type == 1) {//积分不足
            that.setData({
              openType: false,
              shareTitle: data.msg,
              firstShare: false
            })
          } else {//首次转发 2
            that.setData({
              openType: false,
              shareTitle: data.msg,
              firstShare: true
            })
          }
        }
      })
    })
  },
  cancelSharing:function(){
    this.setData({
      openType:true
    })      
  },
  shareNow:function(){
    this.setData({
      openType:true
    }) 
  },
  getPoints:function(){
    this.setData({
      openType:true
    }) 
    wx.navigateTo({
      url: '../integral/integral',
    })
  },
  // 拨打电话
  Callphone: function (e) {
    var that = this;
    var phoneNumber = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },
  //拨打客服电话
  callCustomer:function(){
    wx.makePhoneCall({
      phoneNumber:'4008606025'
    })
  },
  // 获取举报弹窗
  Complain: function () {
    app.isBind().then(value => {
      this.setData({
        hiddenmodalput:! this.data.hiddenmodalput
      })
    })
  },
  radioChange: function (e) {
    this.setData({
      mReportCategory: e.detail.value
    })
    if (this.data.mReportCategory == 'HIRE_REPORT_3') {
      this.setData({
        isremark: true
      })
    } else {
      this.setData({
        isremark: false
      })
    }
  },
  bindinputValue: function (e) {
    var that=this;
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },
  //取消按钮
  cancel: function (e) {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认按钮
  confirm: function (e) {
    var that=this;
    console.log(that.data.remark)
    if (this.data.mReportCategory == "") {
      wx.showToast({
        title: '请选择一条要举报内容！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      hiddenmodalput: true
    });
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('hireReports/addReport', {
          code: res.code,
          // accId: app.globalData.mAccId,
          hireId: e.currentTarget.dataset.id,
          reportCategory: this.data.mReportCategory,
          remark: this.data.remark || ''
        }, function (data) {
          if (data) {
            wx.showToast({
              title: '举报成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 关闭层 
  hideRule: function () {
    this.setData({
      isRuleTrue: false
    })
  },
  doPublish: function () {
    wx.switchTab({
      url: '../publish/publish'
    });
  },

  doCall: function (e) {
    var phoneNumber = "";
    app.func.req('virtualNums/getVirtualNumByHireId', {
      hireId: e.currentTarget.dataset.name
    }, function (data) {
      phoneNumber = data + "";
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
      })
    })
  },

  doCallAbc: function () {
    wx.makePhoneCall({
      phoneNumber: '4008 - 6060 - 25'
    })
  },

  doCallNumber: function () {
    var phoneNum = '';
    if (this.data.hireInfo.phone == null || this.data.hireInfo.phone == '') {
      phoneNum = this.data.hireInfo.project.company.userName;
    } else {
      phoneNum = this.data.hireInfo.phone
    }
    wx.makePhoneCall({
      phoneNumber: phoneNum
    })
  },

  getHireInfo: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        app.func.req('projectHires/getWxHireDetail', {
          id: that.data.hireId,
          code:res.code
        }, function (data) {
          if (data.status.text == '正在招聘') {
            that.setData({
              isShow: true
            })
          }
          if (data.status.text != '正在招聘') {
            that.setData({
              is_show: true
            })
          }
          that.setData({
            hireInfo: data,
            phone: data.phone,
            isFullPhone: !data.hiddenPhone,
            isUrgently: false,
            teamTypeId: data.teamType.id,
            provinceId: data.provinceId
          });
          that.getWxQuery();
        })
      }
    })
  },
  /*获取精选推荐列表*/
  getWxQuery:function(){
    var that = this;
    app.func.req('projectHires/identicalWxQuery', {
      page: 0,
      size:2,
      teamTypeId: that.data.teamTypeId || '',
      provinceId: that.data.provinceId || '',
      hireId: that.data.hireId
    }, function (data) {
      that.setData({
        hires: data
      });
    });
  },
  goHireDetail: function (e) {
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['uYvyuyxSltmJle6b9btUaWx3BsV3_1wVE2Bs8xRCH50'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
    wx.navigateTo({
      url: '../hireDetail/hireDetail?id=' + e.currentTarget.dataset.name
    })
  },
  getKeFuWeChat: function () {
    var that = this;
    app.func.req('dicts/getKeFuWeChat', {
    }, function (data) {
      if (data) {
        that.setData({
          kefuWeChat: data.text
        })
      }
    });
  },
/*查询报名状态*/
 checkIsRegistered:function(){
   var that = this;
  app.func.req('hireApplys/check', {
    hireId: that.data.hireId
  }, function (data) {
      if(data.code==200){
        that.setData({
          isRegistered: data.data
        });
         that.getScore();
      }
  });
 },
 /*报名*/
 application:function(e){
    var that = this;
   app.isBind().then(value => {
      if (app.compareVersion()) {
        wx.requestSubscribeMessage({
          tmplIds: ['hvjlwkmvlkBMp6Ouf__z3O7DKdC9NT4111bzvn4NVL8'],
          success(res) {
            console.log("res=============", res);
          },
          fail(res) {
            console.log("res=============", res);
          }
        })
      }
      app.func.req('hireApplys/apply', {
        hireId: that.data.hireId
      }, function (data) {
        if(data.code==200){
          that.setData({
            isRegistered: true
          })
          wx.showToast({
            title: '报名成功，请耐心等待客服筛选，通过后会有电话通知',
            icon: 'none',
            duration: 2000
          })
          that.sendNotification();
        }else if(data.code==201){
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateTo({
              // url: '../idcard/idcard?',
              url: '../idcard/idcard?hireId=' + e.currentTarget.dataset.id,
            })
          }, 2000);
        }else if(data.code==202){
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })    
        }else{
          that.setData({
            isRegistered: false
          }) 
        }
      });
   })
 },
/*报名发送通知*/
  sendNotification:function(){
    var that = this;
    app.func.req('hireApplys/signup', {
      hireId: that.data.hireId
    }, function (data) {

    });
  },
  /*分享获得积分*/
  wxShare:function(){
    app.func.req3('scores/wxShare', {
    }, function (data) {
      if (data.error) {
      } else {
        wx.showToast({
          title: '恭喜你，获得2积分',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      that.shareNow();
      if (app.isBindPhone()) {
        that.wxShare();
      }
      return {
      title: that.data.hireInfo.title ? that.data.hireInfo.title : that.data.hireInfo.areaFullTitle + '-招' + that.data.hireInfo.teamType.title,
        path: '/pages/hireDetail/hireDetail?id=' + that.data.hireId + '&inviteCode=' + wx.getStorageSync('openId'),
        success: function (res) { }, fail: function (res) {}
      }    
    }else{/*右上角分享*/
      if (app.isBindPhone()) {
        that.wxShare();
      }
      return {
        title: that.data.hireInfo.title ? that.data.hireInfo.title : that.data.hireInfo.areaFullTitle + '-招' + that.data.hireInfo.teamType.title,
        path: '/pages/hireDetail/hireDetail?id=' + that.data.hireId + '&inviteCode=' + wx.getStorageSync('openId'),
        success: function (res) {}, fail: function (res) {}
      }    
    }
  },
   
  goIndex: function () {
    wx.navigateTo({
      url: "../zgxx/zgxx"
    });
  },

  getHireReportCategory: function () {
    var that = this;
    app.func.req('dicts/getDictsByCategory', {
      categoryKey: "HIRE_REPORT"
    }, function (data) {
      if (data) {
        that.setData({
          reportCategorys: data
        })
      }
    });
  }
})

