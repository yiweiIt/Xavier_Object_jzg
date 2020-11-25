const app = getApp()
const util = require('../../utils/util.js');
Page({
  data: {
    isWd:''
  },
  /** 返回上一页 */
  // goBack: function() {
  //   wx.switchTab({
  //     url: '../wd/wd',
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status==0){
      this.setData({
        isWd:0
      });
      wx.hideShareMenu();
    } else if (options.status == 1){
      this.setData({
        isWd: 1
      });      
      wx.hideShareMenu();
    } else if (options.status == 3){
      wx.setNavigationBarTitle({ title: '劳务保险' })  
      this.setData({
        isWd: 3,
        url: options.url
      });  
    }else{
      wx.setNavigationBarTitle({ title: '建筑港' })  
      this.setData({
        isWd: 2,
        url: options.url
      });  
    }
  },
  callphone:function(){
    wx.makePhoneCall({
      phoneNumber: "4008606025",
    })
  },
  /*班组管理 teamId--班组ID type--身份类型  teamTypeId--班组下工种ID  personalId--个人ID*/
  goTeamManagement: util.throttle(function (e) {
    app.isBind().then(value => {
      app.func.req('teams/getIdType', {
      }, function (data) {
        if (data.type == 'TEAM') {
          wx.navigateTo({
            url: '../teamManagement/teamManagement?teamId=' + data.id + '&type=' + data.type + '&teamTypeId=' + data.teamTypeId + '&multiRole=' + data.multiRole + '&personalId='
          })
        }else {
          wx.showModal({
            title: '温馨提示',
            content: '只有班组长才能购买保险，请先入驻班组',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '建筑港推客&城市合伙人',
      imageUrl: "https://jianzhugang.oss-cn-shenzhen.aliyuncs.com/mini/newIcon/recruitCard.jpg",
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
  }
})