// pages/teammember/teammemberinfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:[],//当前成员信息
    updateuserinfo:[],//修改成员信息
    userid:'',
    teamTypeId: '',
    isEdit: true,
    teamid:'',
    array:
      ['工商银行', '光大银行', '广发银行', '华夏银行', '建设银行',
        '交通银行', '民生银行', '农业银行', '平安银行', '浦发银行',
        '兴业银行', '邮政银行', '招商银行', '中国银行', '中信银行'],
    index:0
    // placeholder: '请输入',
    // num:1,
    // cardNumber:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     userid:options.id,
     teamid:options.b_id
    })
    this.getuserinfo();
  },
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

  }, 
  bindtitle: function (e) {
    this.setData({
      ['userinfo.title']: e.detail.value
    })
  },
  bindidNumber: function (e) {
    this.setData({
      ['userinfo.idNumber']: e.detail.value
    })
  },
  bindphone: function (e) {
    this.setData({
      ['userinfo.phone']: e.detail.value
    })
  },
  bindcardNumber: function (e) {
    this.setData({
      ['userinfo.cardNumber']: e.detail.value,
    })
  },

  // placeholder: function (e) {
  //   this.setData({
  //     cardNumber: this.data.placeholder + e.currentTarget.dataset.key,
  //   })
  // },
  //开户行切换
  userbindbankName: function (e) {
    let userinfo = this.data.userinfo;
    userinfo.bankName = this.data.array[e.detail.value];
    this.setData({
        userinfo,
        index: e.detail.value
    })
    },
  //工种切换
  changeTeamType: function (event) {
    this.setData({
      teamTypeId: event.detail.teamTypeId
    })
    this.doVerifyValues();
  },
 //当前成员信息
  getuserinfo: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('teams/getAMember', {
      id: that.data.userid
    }, function (data) {
        that.setData({
          userinfo: data
        });
    });
  },
  //修改当前成员信息
  formSubmit: function (e) {
    var that = this;
    let isEdit = this.data.isEdit;
    if (isEdit) {
      this.setData({
        isEdit: !isEdit,
      })
      return;
    }
    this.setData({
      updateuserinfo: e.detail.value
    })
    var token = wx.getStorageSync('token');
    if (!this.data.updateuserinfo.title) {
      wx.showToast({
        title: '姓名不能为空',
        duration: 1500,
      });
      return;
    }
    if (!this.data.updateuserinfo.phone) {
      wx.showToast({
        title: '手机号不能为空',
        duration: 1500,
      });
      return;
    }
    if (that.data.updateuserinfo.phone) {
      var reg1 = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
      var flag1 = reg1.test(that.data.updateuserinfo.phone);
      if (!flag1) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.updateuserinfo.idNumber) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(that.data.updateuserinfo.idNumber)) {
        wx.showToast({
          title: '身份证号不合法',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.updateuserinfo.cardNumber) {
      var idcardReg = /^(?:[1-9]{1})(?:\d{11}|\d{15}|\d{18})$/;
      if (!idcardReg.test(that.data.updateuserinfo.cardNumber)) {
        wx.showToast({
          title: '银行卡号不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    //this.saveUserinfo();
    let pdata = {
      id: that.data.userid,
      "team.id": that.data.teamid,
      ...
      this.data.updateuserinfo
    }
    app.func.req('teams/updateMember', pdata, function (data) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      });
      setTimeout(function () {
        that.getuserinfo();
      }, 1500)
      
    });
  },
  //删除成员信息
  delete:function(){
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
          })
          setTimeout(function () {
            that.deleteMember();
          }, 1500)
        } else if (res.cancel) {
        }
      }
    })
  },
  // 删除成员
  deleteMember:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('teams/deleteMember', {
      id: that.data.userid
    }, function (data) {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1500,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      });
    });
  }
})