// pages/pqdetail/pqdetail.js
/**派遣详情 */
const app = getApp()
Page({
  data: {
    hireInfo: {},
    hireId: 0,
    phone: '',
    kefuWeChat: 'Jzg-hg',

    openType:true,
    firstShare:'',
    shareTitle:'',

    isFullPhone: false,   //招工号码是否完整
    hiddenmodalput: true, // 举报模态框判定
    is_modal_Hidden: true, // 公共模态框判定
    is_modal_Msg: '分享查看更多信息',

    mReportCategory: "",
    reportCategorys: []   //举报内容选项
  },

  onLoad: function (options) {
    var that = this;
    that.getKeFuWeChat();
    that.setData({
      hireId: options.id
    });

    that.getHireInfo();
    // that.getHireReportCategory();
  },

  onShow: function() {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },

  // 复制微信
  copyText: function () {
    wx.setClipboardData({
      data: this.data.kefuWeChat,
      success(res) {
      }
    })
  },
  // 拨打电话
  Callphone: function () {
    var that = this;
    var phoneNumber = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber,
    })
  },

  doPublish: function () {
    var that = this;
    app.isBind().then(value => {
      app.func.req('workerDispatchs/applyHire', {
        hireId: that.data.hireId
      }, function (data) {
        wx.showModal({
          title: '温馨提示！',
          content: '报名成功，请耐心等候客服筛查，通过会有电话通知',
        })
      })
    })
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

  // 获取完整手机号
  getContactPhone: function () {
    var that = this;
    app.isBind().then(value => {
        app.func.req3("projectHires/getFullPhone", {
          hireId: that.data.hireId
        }, function (data) {
          if(data.status ==200){
            wx.showToast({
              title: '获取成功，消耗1积分',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              openType:true,
              phone: data.phone,
              isFullPhone: true
            })
            setTimeout(function () {
              wx.hideToast()
            }, 1000);
          }else{
            if(data.type==1){//积分不足
                that.setData({
                  openType:false,
                  shareTitle:data.msg,
                  firstShare:false
                })
            }else{//首次转发
              that.setData({
                openType:false,
                shareTitle:data.msg,
                firstShare:true
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
  getHireInfo: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req3('projectHires/getWxHireDetail', {
      id: that.data.hireId
    }, function (data) {
      that.setData({
        hireInfo: data,
        phone: data.phone,
        isFullPhone: !data.hiddenPhone
      });
    });
  },

  getKeFuWeChat: function () {
    var that = this;
    app.func.req('dicts/getKeFuWeChat', {
    }, function (data) {
      that.setData({
        kefuWeChat: data.text
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    console.log(ops);
    if (ops.from === 'button') {
      that.shareNow();
      if (app.isBindPhone()) {
        app.func.req3('scores/wxShare', {}, function (data) {
          if (data.error) {
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
      title: that.data.hireInfo.title ? that.data.hireInfo.title : that.data.hireInfo.areaFullTitle + '-招' + that.data.hireInfo.teamType.title,
        path: '/pages/hireDetail/hireDetail?id=' + that.data.hireId,
        success: function (res) {

        },
        fail: function (res) {

        }
      }
    }else{/*右上角分享*/
      if (app.isBindPhone()) {
        app.func.req3('scores/wxShare', {}, function (data) {
          if (data.error) {
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
      title: that.data.hireInfo.title ? that.data.hireInfo.title : that.data.hireInfo.areaFullTitle + '-招' + that.data.hireInfo.teamType.title,
        path: '/pages/hireDetail/hireDetail?id=' + that.data.hireId,
        success: function (res) {

        },
        fail: function (res) {

        }
      }
    }
  },

  goIndex: function () {
    wx.navigateTo({
      url: "../tcpq/tcpq"
    });
  },

  getHireReportCategory: function () {
    var that = this;
    app.func.req('dicts/getDictsByCategory', {
      categoryKey: "HIRE_REPORT"
    }, function (data) {
      that.setData({
        reportCategorys: data
      })
    });
  }
})
