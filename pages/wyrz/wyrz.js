const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCompanySignUp: false,
    isTeamSignUp: false,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.checkIsSignUp();
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  checkIsSignUp: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('companys/myProfile', {
    }, function (data) {
      if (data) {
        that.setData({
          isCompanySignUp:true
        })
      }
    });
    app.func.req('teams/myProfile', {
    }, function (data) {
      if (data) {
       that.setData({
          isTeamSignUp: true,
          id: data.account.id  
       })
      }
    });
  },

  /** 跳转 班组入驻 */
  goRegisterBz: function (e) {
    var that = this;
    app.isBind().then(value => {
      if (that.data.isTeamSignUp) {
        wx.navigateTo({
          url: '/pages/team/teameditor?id=' + this.data.id,
        })
      }else{
        wx.navigateTo({
          url: '/pages/wyrz/bzrz/bzrz',
        })
      }
    })  
  },

  /** 跳转 公司入驻 */
  goRegisterGs: function () {
    var that = this;
    if (that.data.isCompanySignUp) {
      wx.showToast({
        title: '公司已经入驻成功',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    app.isBind().then(value => {
      wx.navigateTo({
        url: '/pages/wyrz/gsrz/gsrz',
      })
    })
  }
})