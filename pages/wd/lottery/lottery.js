// pages/wd/lottery/lottery.js
const util = require('../../../utils/util.js');
const app = getApp();
var hongbao = 0;
Page({
  data: {
    awardsList: {},
    animationData: {},
    count:'',
    scale:1,
    awards:[],
    scene:'',
    optionsSync:false,
    buttonClicked: false
  },

  onReady: function (e) {
  },

  /*返回首页*/
  backHome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /*绘制转盘*/
  createContext:function(){
    var that = this;
    // 绘制转盘
    var awardsConfig = that.data.awards,
        len = awardsConfig.length,
        rotateDeg = 360 / len / 2 + 90,
        html = [],
        turnNum = 1 / len;  // 文字旋转 turn 值
        var ctx = wx.createContext();
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI/180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0,  2 * Math.PI / len, false);
      // 颜色间隔
      if (i % 2 == 0) {
          ctx.setFillStyle('rgba(255,184,32,1)');
      }else{
          ctx.setFillStyle('rgba(255,203,63,1)');
      }
      // 填充扇形
      ctx.draw();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,1)');
      ctx.stroke();
      // 恢复前一个状态
      ctx.restore();
      // 奖项列表
      html.push({ 
        ico:'https://static.jianzhugang.com/mini/image/lottery/'+awardsConfig[i].ico,
        turn: i * turnNum + 'turn',
        awardLineTurn : i * turnNum+ turnNum + 'turn', 
        lineTurn: i * turnNum + turnNum / 2 + 'turn', 
        award: awardsConfig[i].name
      });      
    };
    console.log(html);
    that.setData({
      awardsList: html
    });  
  },

  
  /**
   * 抽奖处理函数：
   */
  getLottery: function () {
    var that = this;
    util.buttonClicked(that);
    if (that.data.scene) {
      wx.setStorageSync('scene', that.data.scene);
    }
    app.isBind().then(value => {
      app.func.req('scores/doLottery', {
        flag: that.data.optionsSync,
        code: that.data.scene
      }, function (data) {
        var awardsConfig = that.data.awards, runNum = 2, awardIndex = data.index;
        console.log("奖品序号：" + awardIndex);
        // 旋转抽奖
        app.runDegs = app.runDegs || 0
        app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / that.data.awards.length))

        var animationRun = wx.createAnimation({
          duration: 4000,
          timingFunction: 'ease'
        })
        that.animationRun = animationRun;
        animationRun.rotate(app.runDegs).step()
        that.setData({
          animationData: animationRun.export(),//清除之前的动画
        })
        that.setData({
          count: data.count
        });
        if (data.type == 3) {
          wx.sendBizRedPacket({
            timeStamp: data.data.timeStamp,
            nonceStr: data.data.nonceStr,
            package: data.data.package,
            signType: data.data.signType,
            paySign: data.data.paySign,
            success: function (res) {
              console.log(res);
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          })
        } else {
          // 中奖提示
          setTimeout(function () {
            wx.showModal({
              title: '',
              content: data.msg,
              showCancel: false,
              confirmText: "确定",
              confirmColor: "#4da1ff",
              success: function (res) {
                if (res.cancel) {
                  //点击取消,默认隐藏弹框
                } else {
                  
                }
              }
            })
          }, 4000);
        }
      });  
    })
 
  },
  onShow: function () {
    var that = this;
    console.log(wx.getStorageSync('openId'));
    if (!wx.getStorageSync('userInfo')) {
      wx.showModal({
        title: '温馨提示!',
        content: '请先授权登录',
        confirmText: "前往登录",
        success: function (res) {
          if (res.confirm) {
            if (that.data.scene) {
              wx.setStorageSync('scene', that.data.scene);
            }
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else if (res.cancel) {
            
          }
        }
      });
    } else {
      if (!wx.getStorageSync('isBindMobile')) {
        wx.showModal({
          title: '温馨提示!',
          content: '请先绑定手机号',
          confirmText: "绑定手机",
          success: function (res) {
            if (res.confirm) {
              if (that.data.scene) {
                wx.setStorageSync('scene', that.data.scene);
              }
              wx.navigateTo({
                url: '/pages/smrz/smrz',
              })
            } else if (res.cancel) {
              
            }
          }
        });
      }
    }
  },
  onLoad: function (options) {
    var optionScene = wx.getLaunchOptionsSync().scene;
    if (optionScene == 1011 || optionScene == 1025 || optionScene == 1047 || optionScene == 1124) {
      this.setData({
        optionsSync: true,
        scene: options.scene
      });
    } else {
      this.setData({
        optionsSync: false
      });
    }
    this.doLottery();
    this.lotteryList();
  },
  /*初始化数据*/
  doLottery:function(){
    var that = this;
    if (wx.getStorageSync('token')){
      app.func.req('scores/checkLottery', {
        flag: that.data.optionsSync
      }, function (data) {
        that.setData({
          count: data.count
        });
      });  
    }
  },
  lotteryList:function(){
    var that = this;
    if (wx.getStorageSync('token')) {
      app.func.req('scores/lotteryList', {
        flag: that.data.optionsSync
      }, function (data) {
        that.setData({
          awards: data
        });
        that.createContext();
      }); 
    }
  },


  onShareAppMessage: function(){

  }
})

