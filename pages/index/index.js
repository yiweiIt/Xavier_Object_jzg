const app = getApp()
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const util = require('../../utils/util.js');
/**自定义动画 */
var marqueeAnimation = wx.createAnimation({
  duration: 300,
  timingFunction: 'ease',
})

Page({
  data: {
    // isprop: "none",//发布招工类型说明
    isprop:false,
    pushOffBox: false,
    // pushOffBox:'none',
    bannerLink: '/pages/index/index',
    banners: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    hires: [],
    userInfo: null,
    hasUserInfo: false,
    index: "0",
    notes: "",
    aa: [{
        nickName: ""
      },
      {
        nickName: ""
      },
    ],
    starArr: '', // 用于模拟输出星级的数组
    enStarArr: '',
    _show: true,
    isDrawLucky:false,
    isDrawIntegral:false,
    isWorkRegister:false
  },
  formSubmit: function (e) {
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
  formReset: function () {
    console.log('form发生了reset事件')
  },
  /*判断是否显示积分抽奖转盘*/
  drawLucky:function(){
    var that = this;
    app.func.req('wxs/drawLucky', {}, function (data) {
      if(data==0){             
        that.setData({
           isDrawLucky:false
         }); 
      }else{
        that.setData({
          isDrawLucky:true
        }); 
      }
    })   
  },
  /*判断是否显示积分抽奖转盘*/
  drawIntegral: function () {
    var that = this;
    app.func.req('wxs/drawIntegral', {}, function (data) {
      if (data == 0) {
        that.setData({
          isDrawIntegral: false
        });
      } else {
        that.setData({
          isDrawIntegral: true
        });
      }
    })
  },
  /*判断是否显示备案*/
  isShowWorkRegister: function () {
    var that = this;
    app.func.req('wxs/isShowWorkRegister', {}, function (data) {
      if (data == 0) {
        that.setData({
          isWorkRegister: false
        });
      } else {
        that.setData({
          isWorkRegister: true
        });
      }
    })
  },

  singIner:function(){
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../integral/integral',
      })
    })
  },
  /*积分抽奖显示与否*/
  singIn: function() {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../wd/lottery/lottery',
      })
    }) 
  },
  situation: function () {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../register/register',
      })
    }) 
  },
  onShareAppMessage: function(ops) {
    var that = this;
    // 直接给用户加积分
    if (app.isBindPhone()) {
      app.func.req3('scores/doShare', {}, function (data) {
        if (data.error) {
        } else {
          wx.showToast({
            title: '恭喜你，获得2积分',
            icon: 'none',
            duration: 3000
          })
        }
      })
      return {
        title: '建筑行业综合服务商',
        path: "pages/index/index?inviteCode=" + wx.getStorageSync('openId'),
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
      // return {
      //   title: '建筑行业综合服务商',
      //   path: "pages/index/index?fromAccId=" + app.globalData.mAccId
      // }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.scene) {
        var scene = decodeURIComponent(options.scene);
        if (scene== "TEAM"){
            that.setData({
              // isprop: "flex",
              isprop: true,
              optionTeam: scene
            });
        }
    }
    that.getBanners();
    that.getHires();
    that.getInfo();
    that.getNotes();
    that.drawLucky();
    that.drawIntegral();
    that.isShowWorkRegister();
    if(options.teamId){
      wx.reLaunch({
        url: '../teamManagement/invite/invite?teamId=' + options.teamId+'&name='+ options.name+'&teamType='+ options.teamType,
      })
    }
  },
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg);
      app.globalData.messageBack = function (res) {
        console.log('收到服务器pong内容', res);
        var count = JSON.stringify(JSON.parse(res).count);
        if (JSON.parse(res).checked) {
          wx.setTabBarBadge({ index: 2, text:count	})  
        } else {
          wx.removeTabBarBadge({ index: 2});
        }
        resolve(res)
      };
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res);
        var count = JSON.stringify(JSON.parse(res).count);
        if (JSON.parse(res).checked) {
          wx.setTabBarBadge({ index: 2,  text: count	})
        } else {
          wx.removeTabBarBadge({ index: 2});
        }
        resolve(res)
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.sendSocketMessage();//连接webscoket
    setTimeout(function(){
      that.judgeGetLocations();
    },3000);
    if(app.globalData.userInfo){
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    that.isPushOffBox();
  },
  /*判断今天用户是否弹出过弹框*/
  isPushOffBox:function(){
    var that = this;
    util.isPushOffBox().catch(error => {
      that.setData({
        pushOffBox:false
        // pushOffBox: 'none'
      })
    })
    .then(value => {
      console.log(value);
      if(value){
        that.setData({
          pushOffBox: true
          // pushOffBox: 'flex'
        })
      }
    })
  },
  judgeGetLocations: function () {
    var that = this;
    if (wx.getStorageSync('token')){
      app.func.req('accounts/getLocations', {}, function (data) {
        if (data.code == 400) {
          app.getUserLocation();
        }else { 
          
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getHires();
  },

  onPageScroll: function(e) {
    if (e.scrollTop > 0) {
      this.setData({
        _show: false
      })
    }
    if (e.scrollTop == 0) {
      this.setData({
        _show: true
      })
    }
  },
/*上拉触底*/
  onReachBottom: function() {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../tcpq/tcpq',
      })
    })
  },

  /**
   * 页面下拉触底事件的处理函数
   */
  gopublish: function() {
    wx.switchTab({
      url: '../publish/publish'
    })
  },

  /**跳转 招工信息列表 */
  goHireList: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../zgxx/zgxx'
      })
    })
  }, 1000),

  /**跳转 班组信息*/
  goCityList: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../bzlb/bzlb'
      })
    })
  }, 1000),

  /** 跳转 同城机械 */
  goMachineryList: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../jxlb/jxlb'
      })
    })
  }, 1000),

  // 跳转工人找活
  goWorking: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../works/works',
      })
    })
  }, 1000),


  onSlideChangeEnd: function(e) {
    var that = this;
      that.setData({
        index: e.detail.current
      })
  },

  /**跳转  跳转外部链接*/
  goOutUrl: function(e) {
    app.isAuthorize().then(value => {
      if (e.currentTarget.dataset.id == 0) {
        wx.navigateTo({
          url: '../zgxx/zgxx'
        })
      }
      if (e.currentTarget.dataset.id == 1) {
        wx.navigateTo({
          url: '../out/out?url=' + encodeURIComponent(e.currentTarget.dataset.name),
        })
      }
    })
  },

  /**跳转  同城五金*/
  goRegister: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../tcwj/tcwj',
      })
    })
  }, 1000),
  /**
   * 跳转 招工详情
   */
  goHireDetail:util.throttle(function (e) {
    app.isAuthorize().then(value => {
        if (app.compareVersion()){
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
    })
  }, 1000),

  /**
   * 获取 招工列表
   */
  getHires: function() {
    var that = this;
    app.func.req('projectHires/wxQuery', {
      isIndex: true,
      page: 0,
      size: 10,
      typeId: 'PROJECT_TYPE_WORKER'
    }, function(data) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.showLoading({
        title: '数据加载中...',
      })

      if (data) {
        that.setData({
          hires: data
        });
      }
      wx.hideLoading();
    });
  },

  /**
   * 跳转 机械详情
   */
  goMachineDetil: function(e) {
    wx.navigateTo({
      url: '../jxxq/jxxq?id=' + e.currentTarget.dataset.name
    })
  },


  /**
   * 获取 公告信息
   */
  getNotes: function() {
    //function 里面已经不是this所以使用this.setData不起作用
    var that = this;
    app.func.req('notes/getNotes', {
      status: 1,
      typeId: 1
    }, function(data) {
      if (data) {
        that.setData({
          notes: data.url,
          aa: [{
              nickName: that.data.aa[0].nickName
            },
            {
              nickName: data.content
            },
          ],
          showNote: true
        });
      }
    });
  },

  /**
   * 获取今日招工统计
   */
  getInfo: function() {
    var that = this;
    app.func.req('dicts/getHiresTotalForToday', {}, function(data) {
      that.setData({
        aa: [{
            nickName: "今日招工统计信息统计" + data + "条"
          },
          {
            nickName: that.data.aa[1].nickName
          },
        ]
      });
    });
  },

  getBanners: function() {
    var that = this;
    app.func.req('dicts/getMiniAppBanner', {}, function(data) {
      if (data) {
        that.setData({
          banners: data
        });
      }
    });
  },

  goBannerArticle: function(e) {
    if (e.currentTarget.dataset.type =='HTML'){
        if (e.currentTarget.dataset.name){
          wx.navigateTo({
            url: '../out/out?url=' + encodeURIComponent(e.currentTarget.dataset.name),
          })
        }
    } else if (e.currentTarget.dataset.type == 'IMAGE'){
      wx.navigateTo({
        url: '../guide/guide?status=2&url=' + e.currentTarget.dataset.name,
      })
    }else{

    }
  },

  //确认按钮
  confirm: function (e) {
    var that = this;
    this.setData({
      isprop: false
      // isprop: "none",
    });
  },
  close_model: function (e) {
    this.setData({
      isprop: false
      // isprop: "none"
    })
  },
  pushOffBox_cancel: function (e) {
    this.setData({
      pushOffBox: false
      // pushOffBox: "none"
    })
  },
  /*跳转推客*/
  goPushGuest: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../pushGuest/pushGuest',
      })
    })
  }, 1000),

  /*班组管理推荐跳转*/
  lookOver:function(){
    var that = this;
    that.setData({
      // isprop: "none"
      isprop:false
    })
    if (!wx.getStorageSync('userInfo')) {
      wx.showModal({
        title: '温馨提示!',
        content: '请先授权登录',
        confirmText: "前往登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth?optionTeam=' + that.data.optionTeam,
            })
          } else if (res.cancel) {

          }
        }
      });
    } else  if (!wx.getStorageSync('isBindMobile')) {
      wx.showModal({
        title: '温馨提示!',
        content: '请先绑定手机号',
        confirmText: "绑定手机",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/smrz/smrz?optionTeam=' + that.data.optionTeam,
            })
          } else if (res.cancel) {

          }
        }
      });
    }else{
      that.goTeamManagement();
    }
  },

  /*班组管理 teamId--班组ID type--身份类型  teamTypeId--班组下工种ID  personalId--个人ID*/
  goTeamManagement: util.throttle(function (e) {
    app.isBind().then(value => {
      app.func.req('teams/getIdType', {
      }, function (data) {
        if(data.type=='TEAM'){
          wx.navigateTo({
            url: '../teamManagement/teamManagement?teamId='+data.id+'&type='+data.type+'&teamTypeId='+data.teamTypeId+'&multiRole='+data.multiRole+'&personalId='
          })
        }else if(data.type=='MEMBER'){
          wx.navigateTo({
            url: '../teamManagement/teamManagement?teamId='+data.teamId+'&type='+data.type+'&teamTypeId='+data.teamTypeId+'&multiRole='+data.multiRole+'&personalId='+data.id
          })
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '请先入驻班组',
            confirmText: "去入驻",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/wyrz/wyrz'
                })
              } else if (res.cancel) {

              }
            }
          });
        }
      });
    })
  }, 1000),
  /**管理招工列表页 */
  goManageHireList: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../manageHires/manageHires'
      })
    })
  }, 1000),

/*同城派遣*/
  goApplyJob: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../tcpq/tcpq',
      })
    })
  }, 1000)
})
