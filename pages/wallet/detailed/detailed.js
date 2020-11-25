const app = getApp()
const util = require('../../../utils/util.js');
Page({
  data: {
      ifFirstTwo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that =this;
    that.setData({
      type: options.type
    }); 
    that.getData();
  },
  /*设置数据*/
  getData:function(){
    var that = this;
    if (that.data.type == 1) {
      wx.setNavigationBarTitle({ title: '工资订单' })
      that.setData({
        ifFirstTwo: true,
        url: 'https://static.jianzhugang.com/mini/newIcon/payrollOrderBg.png',
        content:'尊敬的用户,您可以在建筑港官网进行注册及登录后,完善班组、项目信息,并在网上对工资进行申请、发放等操作,相关数据中部分基础关联数据可在小程序中班组板块"工资订单"模块中查询,感谢您对建筑港的信任及支持!'
      });
    } else if (that.data.type == 2) {
      wx.setNavigationBarTitle({ title: '购买保险' })
      that.setData({
        ifFirstTwo: true,
        url: 'https://static.jianzhugang.com/mini/newIcon/purchaseTopBg.png',
        content:'尊敬的用户,您可以在班组管理界面中添加您的班组组员,添加后可以在资金管理板块中每次给至少3名组员购买保险。'
      });
    } else if (that.data.type == 3) {
      wx.setNavigationBarTitle({ title: '积分充值' })
      that.setData({
        ifFirstTwo: false,
        url: 'https://static.jianzhugang.com/mini/newIcon/pointsRechargeBg.jpg',
        content:'安卓用户可在小程序的“会员中心”页面中，通过“获取积分”板块中的“去充值”按钮对积分进行充值操作，充值结果会在24小时内到账。您也可以通过日常签到、邀请工友使用小程序来获得积分。'
      });
    } else {
      wx.setNavigationBarTitle({ title: '急聘支付' })
      that.setData({
        ifFirstTwo: false,
        url: 'https://static.jianzhugang.com/mini/newIcon/employmentBg.jpg',
        content:'安卓用户可直接在发布招工编辑页中的发布类型中选择急聘招工并在支付后发布;苹果用户则需要在发布页中获取客服联系方式,并通过联系客服来发送急聘招工。'
      });
    }
  },

  /*班组管理 teamId--班组ID type--身份类型  teamTypeId--班组下工种ID  personalId--个人ID*/
  goTeamManagement: util.throttle(function (e) {
    app.isBind().then(value => {
      console.log(e.currentTarget.dataset.type);
      if (e.currentTarget.dataset.type==1){
        var content ='只有班组长才能查看工资订单，请先入驻班组';
      } else if (e.currentTarget.dataset.type == 2){
        var content = '只有班组长才能购买保险，请先入驻班组';
      }else{
        return;
      }
      app.func.req('teams/getIdType', {
      }, function (data) {
        if (data.type == 'TEAM') {
          wx.navigateTo({
            url: '../../teamManagement/teamManagement?teamId=' + data.id + '&type=' + data.type + '&teamTypeId=' + data.teamTypeId + '&multiRole=' + data.multiRole + '&personalId='
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: content,
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

  }
})