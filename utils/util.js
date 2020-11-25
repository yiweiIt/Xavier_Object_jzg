const http = require('http.js');
const QQMapWX = require('qqmap-wx-jssdk.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-')
  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取最近三个月
function getAllDate(status){
  var systemTime = new Date();
  var year = systemTime.getFullYear();
  var month = systemTime.getMonth() + 1;
  var day = systemTime.getDate();
  if (status==1){//明天的日期
    systemTime.setTime(systemTime.getTime() + 24 * 60 * 60 * 1000);
    var tomorrow = systemTime.getFullYear() + "-" + twin(systemTime.getMonth() + 1) + "-" + twin(systemTime.getDate());
    return tomorrow;
  } else if (status ==2) {//最近三个月
    var days = new Date(year, month, 0);
    days = days.getDate();
    var year2 = year;
    var month2 = parseInt(month) + 3;
    console.log();
    if (month2 >= 13) {
      year2 = parseInt(year2) + 1;
      month2 = month2 - 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    var t2 = year2 + '-' + twin(month2) + '-' + twin(day2) ;
    return t2;
  } else if (status == 3){
    var nextYear = (year+1) + "-" + twin(month) + "-" + twin(day);
    return nextYear;
  }else{}
}
//
function twin(n){
  return n>=10 ? n : '0' + n
}
function sendVerifyCode(mobile, callBack){
  http.req('verifyCodes/sendVerifyCode', {
    //mobile: mobile
    userName: mobile
  },function (data) {
    if(data){
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 4000
      })
    }else{
      wx.showToast({
        title: '发送成功',
      })
      callBack();
    }
    });
}
// 校验手机号格式
function isPhone(phone){
  var reg =/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  return reg.test(phone)
}
// 时间转时间戳
function transTime(time){
  var t = new Date(time);
  var c = Date.parse(t);
  return c
}

function buttonClicked(self){  
  self.setData({
     buttonClicked: true
  })
  setTimeout(function () {    
    self.setData({
      buttonClicked: false
    })
  },4000)
}
/*查看下载PDF文件*/
function downLoadFile(url) {
  wx.downloadFile({
    url: url,
    success: function (res) {
      console.log(res);
      if (res.statusCode === 200) {
        var Path = res.tempFilePath
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            console.log('打开PDF成功');
          }
        })
      }
    },
    fail: function (res) {
      console.log(res);
    }
  })
}
function checkHasLocationPermissionByMP() {
  return new Promise(function(resolve, reject) {
    wx.getSetting({
      success(res) {
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
                reject(res);
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                          var latitude = res.latitude;
                          var longitude = res.longitude;
                          let qqmapsdk = new QQMapWX({
                            key: '2WJBZ-WGJLP-MLADM-VBRLS-PN3ZQ-D2BWL'
                          })
                          qqmapsdk.reverseGeocoder({
                            location: { latitude, longitude },
                            sig: "4Hpdmgawu7snxwDkIr2FnFDdU9aDGkQ3",
                            success(res) {
                              // resolve(res);
                              http.req('areas/queryByName', {
                                latitude: latitude,
                                longitude: longitude,
                                province:res.result.address_component.province,
                                city:res.result.address_component.city,
                                district:res.result.address_component.district,
                                address:res.result.address
                              }, function (data) {
                                resolve(res);
                              });
                            },
                            fail: function (error) {
                              reject(error);
                            }
                          })
                        },
                        fail: function (res) {
                          reject(res);
                        }
                      }) 
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      });
                      reject(res);
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              var latitude = res.latitude;
              var longitude = res.longitude;
              let qqmapsdk = new QQMapWX({
                key: '2WJBZ-WGJLP-MLADM-VBRLS-PN3ZQ-D2BWL'
              })
              qqmapsdk.reverseGeocoder({
                location: { latitude, longitude },
                sig: "4Hpdmgawu7snxwDkIr2FnFDdU9aDGkQ3",
                success(res) {
                  http.req('areas/queryByName', {
                    latitude: latitude,
                    longitude: longitude,
                    province:res.result.address_component.province,
                    city:res.result.address_component.city,
                    district:res.result.address_component.district,
                    address:res.result.address
                  }, function (data) {
                    resolve(res);
                  });
                },
                fail: function (error) {
                  reject(error);
                }
              })
            },
            fail: function (res) {
              reject(res);
            }
          }) 
        }
      },
      fail: (res) => {
        reject(res);
      }
    })
  })
}

function checkPhotosAlbumPermissionByMP(){
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] != undefined && res.authSetting['scope.writePhotosAlbum'] != true) {
          wx.showModal({
            title: '请求授权图片保存',
            content: '需要保存图片权限，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                });
                reject(res);
              } else if (res.confirm) {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.writePhotosAlbum']) {
                      resolve(res);
                    }
                    else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      });
                      reject(res);
                    }
                  }
                })
              }
            }
          })
        } else {
          resolve(res);
        }
      },
      fail: (res) => {
        reject(res);
      }
    })
  })
}
/*控制显示首页弹框,时效24小时*/
function isPushOffBox(){
  return new Promise(function (resolve, reject) {
    const lock = wx.getStorageSync('lock');
    const lockNum = wx.getStorageSync('lockNum');
    const lockZeroPoint = wx.getStorageSync('lockZeroPoint');
    if(lock){
      var flag = parseInt((new Date() - lock) / 1000) <= 24 * 3600 * 1000 ? true : false;
      var isFlag = new Date() >= lockZeroPoint ? true:false;//过了零点，弹框将重新记录
      if (isFlag){
        wx.setStorageSync('lockNum', 1);
        wx.setStorageSync('lock', new Date());
        wx.setStorageSync('lockZeroPoint', new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000));//重新记录当前零点
        resolve(true);
      }else{
          if(flag){
            if (lockNum==0){//当天还未弹框
              wx.setStorageSync('lockNum', 1);
              wx.setStorageSync('lock', new Date());
              wx.setStorageSync('lockZeroPoint', new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000));//重新记录当前零点
              resolve(true);
            }else{
              reject(false);
            }
          }else{//大于一天，弹出弹框并重新记录
            wx.setStorageSync('lock', new Date());
            wx.setStorageSync('lockZeroPoint', new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000));//重新记录当前零点
            wx.setStorageSync('lockNum', 1);
            resolve(true);
          }
      }
    }else{
      wx.setStorageSync('lock', new Date());
      wx.setStorageSync('lockZeroPoint', new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000));//记录当前的零点
      wx.setStorageSync('lockNum', 1);
      resolve(true);
    }
  })
}
/*按钮函数节流和函数防抖*/
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

/*急聘支付以及推客余额兑换 hireId - 临时招工ID  openId-用户openID  type-1：急聘招工，2：充值6块钱，3：充值12块钱，4：充值18块钱*/
function paymentMethod(hireId, openId, type, totalFee){
  return new Promise(function (resolve, reject) {
    http.req('wxs/getBalanceIsSufficient', {
      type: type
    }, function (data) {
      if (data.code == 200) {/*有余额，可显示积分兑换，显示弹框*/
        resolve(data.data)
      } else {/*余额不足，默认使用现金支付*/
        getWechatIP(hireId, openId, totalFee).catch(error => {
          reject('拒绝')
        })
        .then(value => {
          resolve(2)
        })
      }
    })
  })
}

/*使用急聘*/
function getWechatIP(hireId, openId, totalFee) {
  return new Promise(function (resolve, reject) {
    http.req('wxs/getWechatIP', {}, function (data) {
      if (data) {
        http.req('wxs/getPayPrepay', {
          openid: openId,
          total_fee: totalFee,
          spbill_create_ip: data,
          payType: 8,
          hireId: hireId
        }, function (data) {
          if (data) {
            /*调取微信支付*/
            wx.requestPayment({
              timeStamp: data.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
              nonceStr: data.nonceStr,
              package: data.package,
              signType: 'MD5',
              paySign: data.paySign,
              appId: data.appId,
              success: function (res) {
                resolve(1)
              },
              fail: function (error) {
                reject(error)
              }
            });
          }else{
            reject()
          }
        })
      }
    })
  })
}

/*使用余额兑换*/
function balancePayment(hireId,type) {
  return new Promise(function (resolve, reject) {
      http.req('wxs/capitalPay', {
        hireId: hireId,
        type: type
      }, function (data) {
        if (data.code == 200) {
          resolve(1)
        } else {
          reject('失败')
        }
      })
  })
}

module.exports = {
  checkHasLocationPermissionByMP:checkHasLocationPermissionByMP,
  checkPhotosAlbumPermissionByMP:checkPhotosAlbumPermissionByMP,
  sendVerifyCode: sendVerifyCode,
  formatTime: formatTime,
  getAllDate: getAllDate,
  isPushOffBox: isPushOffBox,
  isPhone: isPhone,
  transTime: transTime,
  buttonClicked:buttonClicked,
  throttle: throttle,
  downLoadFile: downLoadFile,
  paymentMethod: paymentMethod,
  getWechatIP: getWechatIP,
  balancePayment: balancePayment
}
