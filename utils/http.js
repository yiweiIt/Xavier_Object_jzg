var rootDocment = 'https://api-v2.jianzhugang.com/';// 正式发布服务器
//var rootDocment = 'http://api.test.jianzhugang.com/';
//var rootDocment = 'https://api.jianzhugang.com/';
//var rootDocment = 'http://192.168.1.250:8081/';
//var rootDocment = 'http://192.168.1.66:8081/';

var portNumber = 'wss://api-v2.jianzhugang.com';
//var portNumber = 'ws://api.test.jianzhugang.com';
//var portNumber = 'ws://api.jianzhugang.com';
//var portNumber = 'ws://192.168.1.250:8081';
//var portNumber = 'ws://192.168.1.66:8081'
function req(url, data, cb) {
  var datest = data;
  if (wx.getStorageSync('token')){
     data = data||{};
     data['ob-token'] = wx.getStorageSync('token');
  }
  wx.request({
    url: rootDocment + 'app/' + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/x-www-form-urlencoded'},
    success: function (res) {
      wx.hideLoading();
      if (res.statusCode == 401) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
      } else if (res.statusCode != 200){
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        })
      } else {
        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function () {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '系统繁忙,请稍后再试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    },
  })
}
function req2(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  wx.request({
    url: rootDocment + 'app/' + url,
    data: data,
    method: 'post',
    header: { 'Content-Type': 'application/json'},
    success: function (res) {
      wx.hideLoading()
      if (res.statusCode != 200) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        })
      } else {
        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function () {
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '系统繁忙,请稍后在试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}
function req3(url, data, cb) {
  var datest = data;
  if (wx.getStorageSync('token')) {
    data = data || {};
    data['ob-token'] = wx.getStorageSync('token');
  }
  wx.login({
    success: res => { // 发送res.code 到后台换取 openId, sessionKey, unionId
      data['code'] = res.code;
      wx.request({
        url: rootDocment + 'app/' + url,
        data: data,
        method: 'post',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode == 401) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.statusCode != 200) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
          } else {
            return typeof cb == "function" && cb(res.data)
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '系统繁忙,请稍后在试',
            showCancel: false
          })
          return typeof cb == "function" && cb(false)
        },
      })
    }
  })
}
module.exports = {
  req: req,
  req2: req2,
  req3: req3,
  rootDocment: rootDocment,
  portNumber: portNumber
}
