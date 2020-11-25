import Touches from 'utils/Touches.js'
var http = require('utils/http.js')
const QQMapWX = require('utils/qqmap-wx-jssdk.js')
const checked = false;
//app.js
App({
  updataApp: function() { //版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) { // 存在新版本，请求完新版本信息的回调
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({ // 新的版本下载失败
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({ // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onLaunch: function(ops) {
    var that = this;
    // 检查版本更新
    that.updataApp();
    that.linkSocket();
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.platform)
        that.globalData.SDKVersion = res.SDKVersion;
        if (res.platform == 'ios') {
          // console.log('iOS系统')
        }
        if (res.platform == 'Android') {
          // console.log('Android系统')
        }
      }
    })
    console.log(that.globalData.SDKVersion)
    if (ops.scene == 1044) {
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                that.userInfoReadyCallback(res);
              }
            }
          })
        }
      }
    }),

    // 登录
    wx.login({
      success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
        that.func.req('wxs/getOpenId', {
          code: res.code
        }, function(data) {
          if (data) {
            that.globalData.openId = data.openid;
            wx.setStorageSync('openId', data.openid)
            wx.setStorageSync('token', data.token);
            that.globalData.mAccId = data.accountId;
            that.globalData.token = data.token; 
            if (data.mobile) {
              that.globalData.mPhone = data.mobile;
              wx.setStorageSync('mobile', data.mobile);
              wx.setStorageSync('isBindMobile', true);
            }
            that.updateAccountFormId();
          } else {
            wx.removeStorageSync('token');
            wx.removeStorageSync('isBindMobile');
            wx.removeStorageSync('mobile');
            that.globalData.mAccId = '';
            that.globalData.token = '';
          }
          });
        }
      })
  },
/**检测头像*/
  updateAccountFormId:function(){
    var that = this;
    console.log(that.globalData.userInfo);
    if (that.globalData.userInfo && that.globalData.userInfo.avatarUrl && that.globalData.userInfo.gender && that.globalData.userInfo.gender){
      that.func.req('accounts/updateAccountFormId', {
        avatarUrl: that.globalData.userInfo.avatarUrl ? that.globalData.userInfo.avatarUrl : 'appTest',
        gender: that.globalData.userInfo.gender ? that.globalData.userInfo.gender : 'appTest',
        nickName: that.globalData.userInfo.nickName ? that.globalData.userInfo.nickName : 'appTest'
        }, function (data) {
          if (data) {
            console.log("更新成功");
          }
        });
    }
  },

  onShow: function (ops) {
    var that = this;
    if (ops.query.scene) {
      var scene = decodeURIComponent(ops.query.scene);
      that.globalData.guideOpenId = scene;
      that.guideAccount(scene);
    }
    if (ops.query.inviteCode) {
      that.globalData.guideOpenId = ops.query.inviteCode;
      that.guideAccount(ops.query.inviteCode);
    }
  },
  /*邀请好友，推客功能*/
  guideAccount: function () {
    var that = this;
    var guideOpenId = that.globalData.guideOpenId;
    if (wx.getStorageSync('token') && guideOpenId){
        that.func.req('guide/guideAccount', {
          wxOpenId: wx.getStorageSync('openId'),
          guideOpenId: guideOpenId
        }, function (data) {
          that.globalData.guideOpenIdFlag = true;
        });
    }else{
      that.globalData.guideOpenIdFlag = false;
    }

  },

  getBindMobile: function() {
    var that = this;
    that.func.req('accounts/myProfile', {}, function(data) {
      if (data.mobile) {
        that.globalData.mPhone = data.mobile;
        wx.setStorageSync('mobile', data.mobile);
        wx.setStorageSync('isBindMobile', true);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog() {
    this.dialog.showDialog();
  },
  //取消事件
  _cancelEvent() {
    // console.log('你点击了取消');
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    // console.log('你点击了确定');
    this.dialog.hideDialog();
  },
  globalData: {
    guideOpenIdFlag: false,
    guideOpenId:null,
    userInfo: null,
    openId: null,
    fromAccId: null,
    isShiMin: false,
    mPhone: null, //用户绑定手机号
    mAccId: null, //用户id
    showView: null,
    provinceId: null,
    cityId: null,
    token: '',
    SDKVersion: '',
    PUBVersion: '2.9.4',
    limit: 0,
    timeout: 10000,
    timeoutObj: null,
    checked: false,
    count:0,
    serverTimeoutObj: null,
    localSocket: {},
    callback: function(){},
    messageBack:function(){}
  },

  
  linkSocket() {
    let that = this;
    that.globalData.localSocket = wx.connectSocket({
      url:  http.portNumber +'/client/' + wx.getStorageSync('openId')
    })
    //版本库需要在 1.7.0 以上
    that.globalData.localSocket.onOpen(function (res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      that.reset()
      that.start()
    })
    that.globalData.localSocket.onError(function (res) {
      console.log('WebSocket连接打开失败!readyState=' + that.globalData.localSocket.readyState)
      that.reconnect()
    })
    that.globalData.localSocket.onClose(function (res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      that.reconnect()
    })
    that.globalData.localSocket.onMessage(function (res) {
        // 用于在其他页面监听 websocket 返回的消息
        if (JSON.parse(res.data).status == "pong") {
          var data = JSON.parse(res.data)
          data.checked = that.globalData.checked;
          data.count = that.globalData.count;
          that.reset()
          that.start()
          that.globalData.messageBack(JSON.stringify(data))    
        } else {
          var data = JSON.parse(res.data)
          that.globalData.checked = data.checked;
          that.globalData.count = data.count;
          that.globalData.callback(res.data)
        }
    })
  },

  //重新连接
  reconnect() {
    var that = this;
    if (that.lockReconnect) return;
    that.lockReconnect = true;
    clearTimeout(that.timer)
    if (that.globalData.limit < 10) {//连接10次后不再重新连接
      that.timer = setTimeout(() => {
        that.linkSocket();
        that.lockReconnect = false;
       // console.log("次数:" + that.globalData.limit)
      }, 5000);//每隔5秒连接一次
      that.globalData.limit = that.globalData.limit + 1
    }
  },
  //心跳包开始
  reset: function () {
    var that = this;
    clearTimeout(that.globalData.timeoutObj);
    clearTimeout(that.globalData.serverTimeoutObj);
    return that;
  },
  start: function () {
    var that = this;
    var randomNum = that.randomWord(false, 16);//生成随机码
    that.globalData.timeoutObj = setTimeout(() => {
      wx.sendSocketMessage({
        data: randomNum + "ping",
        // success() {
        //   console.log("发送ping成功");
        // }
      });
      that.globalData.serverTimeoutObj = setTimeout(() => {
        wx.closeSocket();
      }, that.globalData.timeout);
    }, that.globalData.timeout);
  },
  //心跳包结束

  //创建随机数，服务器用来存储是哪个小程序的心跳包的key，由于本案逻辑需要与其它信息存储的key分开，如果逻辑不需要，可以不进行分离，自定义存储的key
  randomWord: function (randomFlag, min, max) {
    var str = "",
      range = min,
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },

  //统一发送消息，可以在其他页面调用此方法发送消息
  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      if (this.globalData.localSocket.readyState === 1) {
        this.globalData.localSocket.send({
          data: msg,
          success: function (res) {
            resolve(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      } else {
        console.log('已断开')
      }
    })

  },
  /*获取地理位置*/
  getUserLocation: function () {
      let that = this;
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
            wx.showModal({
              title: '请求授权当前位置',
              content: '需要获取您的地理位置，请确认授权',
              success: function (res) {
                if (res.cancel) {
                  wx.showToast({
                    title: '拒绝授权',
                    icon: 'none',
                    duration: 1000
                  });
                  that.rejectLocation();
                } else if (res.confirm) {
                  wx.openSetting({
                    success: function (dataAu) {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        that.getLocation();
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        });
                        that.rejectLocation();
                      }
                    }
                  })
                }
              }
            })
          } else if (res.authSetting['scope.userLocation'] == undefined) {
             that.getLocation();
          }
          else {
            that.getLocation();
          }
        },
        fail: (res) => {
          console.log(res);
          that.rejectLocation();
        }
      })
  },
  //拒绝授权定位
  rejectLocation:function(){
    var that = this;
    that.func.req('accounts/rejectLocation', {}, function (data) {

    });   
  },
  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getAddress(latitude, longitude);
        return res
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res));
      }
    })
  },
  getAddress: function (latitude, longitude) {
    // 生成 QQMapWX 实例
    let that = this;
    let qqmapsdk = new QQMapWX({
      key: '2WJBZ-WGJLP-MLADM-VBRLS-PN3ZQ-D2BWL'
    })
    qqmapsdk.reverseGeocoder({
      location: { latitude, longitude },
      sig: "4Hpdmgawu7snxwDkIr2FnFDdU9aDGkQ3",
      success(res) {
        that.queryByName(latitude, longitude, res.result.address_component.province, res.result.address_component.city, res.result.address_component.district,res.result.address);
      },
      fail: function (error) {
        console.error(error);
      }
    })
  },
  /*去记录当前地理位置*/
  queryByName: function (latitude, longitude,province, city,district,address) {
    var that = this;
    that.func.req('areas/queryByName', {
      latitude: latitude,
      longitude: longitude,
      province:province,
      city:city,
      district:district,
      address:address
    }, function (data) {
       
    });
  },
  Touches: new Touches(),
  func: {
    req: http.req,
    req2: http.req2,
    req3: http.req3,
    rootDocment: http.rootDocment
  },

  compareVersion: function() {
    var that = this;
    var v1 = that.globalData.PUBVersion.split('.')
    var v2 = that.globalData.SDKVersion.split('.')
    var len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])
      if (num1 > num2) {
        return false;
      } else if (num1 < num2) {
        return true;
      }
    }
    return true;
  },

  // 公用方法，判断是否授权与绑定手机
  isBind: function() {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            var isBindMobile = wx.getStorageSync('isBindMobile');
            if (that.globalData.userInfo){
              if (isBindMobile) {
                resolve(true);
              }else{
                wx.showModal({
                  title: '温馨提示!',
                  content: '请先绑定手机号',
                  confirmText: "绑定手机",
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/smrz/smrz?backStatus=1',
                      })
                    } else if (res.cancel) {

                    }
                  }
                });
              }
            }else{
              that.toAuth();
            }
          } else {
            that.toAuth();
          }
        },
        fail: (res) => {
          that.toAuth();
        }
      })
    })
  },
  //公用方法，只判断是否授权
  isAuthorize:function(){
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            resolve(true);
          } else {
            that.toAuth();
          }
        },
        fail: (res) => {
          that.toAuth();
        }
      })
    })
  },
//去授权
  toAuth:function(){
    wx.showModal({
      title: '温馨提示!',
      content: '请先授权登录',
      confirmText: "前往登录",
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/auth/auth',
          })
        } else if (res.cancel) {

        }
      }
    });
  },
  // 公用方法，判断是否授权与绑定手机
  isBindPhone: function() {
    var that = this;
    var isBindMobile = wx.getStorageSync('isBindMobile')
    if (isBindMobile) {
      return true;
    } else {
      return false;
    }
  }
})