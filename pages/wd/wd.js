const app = getApp();
const util = require('../../utils/util.js');
// pages/wd/wd.js
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    Name: "监听页面加载",
    mScore: 0,
    id:0,
    isPerfect: false
  },
/*增加锚点*/
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.target.dataset.type);
    if (wx.getStorageSync('token')) {
      var that = this;
      app.func.req('accounts/updateAccountFormId', {
        formId: e.detail.formId
      }, function (data) {
        if (data) {
          console.log("更新成功");
        }
      });
    }
  },
  
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg);
      app.globalData.messageBack = function (res) {
        that.setData({
          checked: JSON.parse(res).checked,
          count:JSON.parse(res).count
        });
        var count = JSON.stringify(JSON.parse(res).count);
        if (JSON.parse(res).checked) {
          wx.setTabBarBadge({ index: 2,  text: count	})
        } else {
          wx.removeTabBarBadge({ index: 2});
        }
        resolve(res)
      };
      app.globalData.callback = function (res) {
        that.setData({
          checked: JSON.parse(res).checked,
          count:JSON.parse(res).count
        });
        var count = JSON.stringify(JSON.parse(res).count);
        if (JSON.parse(res).checked) {
          wx.setTabBarBadge({ index: 2,  text:count	})
        } else {
          wx.removeTabBarBadge({ index: 2});
        }
        resolve(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      checked: app.globalData.checked
    });
  },


  onShow: function() {
    var that = this;
    that.sendSocketMessage();
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      isBindMobile: wx.getStorageSync('isBindMobile'),
      mobile: wx.getStorageSync('mobile') ? wx.getStorageSync('mobile') : app.globalData.mPhone
    });
    that.getRealStatus();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(ops) {
    var that = this;
    app.globalData.fromAccId = 1;
    if (ops.from === 'button') {
      console.log(ops.target);
      return {
        title: '中国建筑行业第一平台',
        path: "pages/wd/wd?fromAccId=" + app.globalData.mAccId,
        imageUrl: "https://static.jianzhugang.com/mini/image/indexShare.jpg",
        success: function(res) {
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
    }else{/*右上角分享*/
      if (app.isBindPhone()) {
        app.func.req3('scores/wxShare', {}, function (data) {
          if (!data.error) {
            wx.showToast({
              title: '恭喜你，获得2积分',
              icon: 'none',
              duration: 1500
            })
          }
        })
        return {
          title: '建筑行业综合服务商',
          path: "pages/index/index"
        }
      }
    }
  },

  // 获取实名认证状态
  getRealStatus: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    if (!wx.getStorageSync('token')) {
      that.setData({
        realName: wx.getStorageSync('userInfo').nickName,
      })
    }
    app.isAuthorize().then(value => {
      app.func.req('accounts/myProfile', { }, function(data) {
        that.setData({
           isCert: data.auditStatus,
           id: data.id,
           realName: data.name ? data.name : data.nickName,
           avatarUrl: data.avatarUrl
         })
      })
      app.isBind().then(value => {
          that.getScore();
          that.checkIsTeam();
      })
    })
  },

  /** 跳转登入界面 */
  Login: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /** 退出操作 */
  Close: function() {
    wx.showModal({
      title: '提示',
      content: '确定退出当前账户',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('user', ''); // 退出置空
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**跳转 我的招工信息 */
  goMyHire: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/wdzg/wdzg'
      })
    })
  }, 1000),


  bankSuccess:function(e){
    console.log(e.detail);
  },
  /**跳转 个人信息 */
  goUser: function () {
    var that=this;
    wx.navigateTo({
      url: '/pages/wd/userdetail/userdetail?nickName=' + that.data.userInfo.nickName
    })
  },
  // 我的找活
  goMyWork: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/works/mework/mework'
      })
    })
  }, 1000),

 /*跳转收付款项目*/
  goWallet:util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/wallet/wallet'
      })
    })
  }, 1000),
  /*跳转我的余额*/
  goBalance: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/wallet/balance/balance'
      })
    })
  }, 1000),
  /**
   * 跳转 我的机械
   */
  goMyMachine: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wdjx/wdjx'
      })
    })
  }, 1000),
 /*跳转积分明细*/
  goPointsDetails: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wd/pointsDetails/pointsDetails'
      })
    })
  }, 1000),
  /*报名记录*/
  goSignUp:function(){
    var that = this;
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wd/signUp/signUp'
      })
    })
  },

  /**跳转 举报骗子*/
  goReportList: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../jbfk/jbfk',
      })
    })
  }, 1000),
  /*跳转推客*/
  goPushGuest: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../pushGuest/pushGuest',
      })
    })
  }, 1000),
  /*跳转三方合作-阳光*/
  goThree: util.throttle(function (e) {
    if (e.currentTarget.dataset.type==1){
      var url = 'https://jianzhugang.oss-cn-shenzhen.aliyuncs.com/mini/personalIcon/ThreeBankWrite.jpg';
      wx.navigateTo({
        url: '../guide/guide?status=3&url=' + url,
      })
    }else{
      var url = 'https://m.75510010.com/view/71de47c3c7';
      wx.navigateTo({
        url: '../out/out?url=' + encodeURIComponent(url),
      })
    }
  }, 1000),

  /**
   * 跳转 使用指南不需要认证
   */
  goGuide: util.throttle(function (e) {
    wx.navigateTo({
      url: '../guide/guide?status=0',
    })
  }, 1000),
  /**
   * 跳转 实名认证
   */
  goMyRealName: util.throttle(function (e) {
    var that = this;
    app.isBind().then(value => {
      if (that.data.isCert == 1) {
        wx.navigateTo({
          url: '../cardDetail/cardDetail',
        })
      } else if (that.data.isCert == 0) {
        wx.showToast({
          title: '已提交认证申请，请耐心等待审核',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (app.compareVersion()) {
          wx.requestSubscribeMessage({
            tmplIds: ['3M-30QZrNCC5RAnAjpdTCmesOGhi8BZ2msmWaP_uQ3k', 'uvKC5ZgunrZOcQa6qwJ8O0Ezr37pZ3lCbiBW1I1qq6k'],
            success(res) {
              console.log("res=============", res);
            },
            fail(res) {
              console.log("res=============", res);
            }
          })
        }
        wx.navigateTo({
          url: '../idcard/idcard',
        })
      }
    })
  }, 1000),

  /** 获取微信头像*/
  getImages: function() {
    if (this.auth()) {
      app.func.req2('accounts/saveAcconut', {
        wxOpenId: app.globalData.openId,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        gender: app.globalData.userInfo.gender,
        nickName: app.globalData.userInfo.nickName
      }, function(data) {
        if (data.state.code == 10000) {
          wx.showToast({
            title: '头像已授权成功',
            icon: 'none',
            duration: 2000
          })
        }
        if (data.state.code == 10001) {
          wx.showToast({
            title: data.body.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  auth: function() {
    if (app.globalData.userInfo === null || app.globalData.userInfo === undefined) {
      wx.navigateTo({
        url: '../auth/auth',
      })
      return false
    } else {
      return true
    }
  },

  /**获取我的积分**/
  getScore: function() {
    var that = this;
    app.isBind().then(value => {
      app.func.req('scores/getScoreByAccId', {}, function(data) {
        if (!data.error) {
          that.setData({
            mScore: data.currentScore
          })
        }
      });
    })
  },


  /*** 获取积分跳转 */
  getJifen: util.throttle(function (e) {
    var that = this;
    app.isBind().then(value => {
      if (that.data.isBindMobile) {
        wx.navigateTo({
          url: '../integral/integral',
        })
      } else {
        wx.navigateTo({
          url: '../smrz/smrz',
        })
      }
    })
  }, 1000),

  goExplain: function() {
    wx.navigateTo({
      url: '../explain/explain',
    })
  },

  // 提示绑定手机
  showBindMobile: function() {
    var that=this;
    wx.showModal({
      title: '温馨提示!',
      content: '请先绑定手机号',
      confirmText: "绑定手机",
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../smrz/smrz'
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  // 提示授权登录
  showSign: function() {
    wx.showModal({
      title: '温馨提示!会员中心',
      content: '请先授权登录',
      confirmText: "前往登录",
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../auth/auth'
          })
        } else if (res.cancel) {


        }
      }
    })
  },

  goAuth: function() {
    var that = this;
    if (that.data.userInfo) {
      return;
    } else {
      wx.navigateTo({
        url: '../auth/auth',
      })
    }
  },

  goWyrz: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/wyrz/wyrz',
      })
    })
  }, 1000),

 // 查询是否入驻班组
  checkIsTeam: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    app.isBind().then(value => {
      app.func.req('teams/myProfile', { }, function (data) {
        if (data) {
          that.setData({
            isTeamSignUp: true
          });
          if (data.teamType){
            that.setData({
              isPerfect: false
            });
          }else{
            that.setData({
              isPerfect: true
            });
          }
        }else{
          that.setData({
            isPerfect: true
          });
        }
      });
    })
  },
})
