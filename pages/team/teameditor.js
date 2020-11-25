// pages/team/teameditor.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team: {},
    id: 0,
    isEdit: true,
    isprop: false,
    // isprop: "none",
    array:
      ['工商银行', '光大银行', '广发银行', '华夏银行', '建设银行',
        '交通银行', '民生银行', '农业银行', '平安银行', '浦发银行',
        '兴业银行', '邮政银行', '招商银行', '中国银行', '中信银行'],
    // index:0,
    show: false,
    teamTypeId: '',//班组类型id
    b_id: '',//班组id
    alluser: [],//全部成员信息
    adduserinfo: [],//添加成员信息
    updateteam: [],//编辑班组信息
    changeteamTypeid: '',//工种id
    provinceId: '',//省id
    cityId: '',//市id
    districtId: '',//县id 
    clearuserinfo: [],//添加成员文本清空
    loadingtime: '' //清除定时器
  },
  bindname: function (e) {
    this.setData({
      ['team.name']: e.detail.value
    })
  },
  bindidNumber: function (e) {
    console.log(e);
    this.setData({
      ['team.ID_number']: e.detail.value
    })
  },
  bindbankCardNo: function (e) {
    this.setData({
      ['team.bankCardNo']: e.detail.value
    })
  },
  //工种切换
  changeTeamType: function (event) {
    let team = this.data.team
    team.profession = event.detail.teamTypeName
    this.setData({
      changeteamTypeid: event.detail.teamTypeId
    })
  },
  //提交班组信息
  teamSubmit: function (e) {
    var that = this;
    let isEdit = this.data.isEdit;
    if (isEdit) {
      this.setData({
        isEdit: !isEdit,
      })
      return;
    }
    this.setData({
      updateteam: e.detail.value
    })
    that.doSave();
  },
  //提交成员信息
  formSubmit: function (e) {
    let that = this;
    var data = that.data;
    // data.adduserinfo.title = e.detail.value.title
    // data.adduserinfo.idNumber = e.detail.value.idNumber
    // data.adduserinfo.phone = e.detail.value.phone
    // data.adduserinfo.cardNumber = e.detail.value.cardNumber
    // let adduserinfo = e.detail.value
    // adduserinfo.bankName = this.data.newarray
    // this.setData({
    //   adduserinfo
    // });
    this.setData({
      adduserinfo: e.detail.value
    });
    this.doVerifyValues();
    // this.addAMember();
  },
  userbindbankName: function (e) {
    var that = this;
    let newarray;
    newarray = this.data.array[e.detail.value];
    this.setData({
      newarray
    })
    // this.setData({
    //   index: e.detail.value,  
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    // this.getteam();
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
    this.getteam();
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
    clearTimeout(this.data.loadingtime)
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
  // 地区选择
  changeThirdArea: function (event) {
    var that = this
    let team = this.data.team
    team.provinceId = event.detail.provinceId,
      team.cityId = event.detail.cityId,
      team.districtId = event.detail.countyId,
      team.address = event.detail.areaTitle
    this.setData({
      team,
    })
    console.log(event.detail);
  },
  //班组开户行切换
  bindbankInfo: function (e) {
    let team = this.data.team;
    team.bankInfo = this.data.array[e.detail.value];
    this.setData({
      team,
      index: e.detail.value
    })
  },
  /**
  * 获取班组信息
  */
  getteam: function (option) {
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('teams/getATeam', {}, function (data) {
      that.setData({
        team: data,
        teamTypeId: data.teamTypeId,
        b_id: data.id
      });
      that.alluser();
      // }  
    });
  },
  // 添加成员弹窗
  add: function (e) {
    this.setData({
      isprop:true
      // isprop: "flex",
    })
  },
  close_model: function (e) {
    this.setData({
      isprop: false,
      // isprop: "none;",
      adduserinfo: ""
    })
  },
  isEmpty: function (str) {
    if (str == null || str == "") {
      return true;
    } else {
      return false;
    }
  },
  //编辑班组信息
  doSave: function () {
    // 插入formId
    var that = this;
    if (!that.data.updateteam.title) {
      wx.showToast({
        title: '班组姓名不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (!that.data.updateteam.idNumber) {
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (that.data.updateteam.idNumber) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(that.data.updateteam.idNumber)) {
        wx.showToast({
          title: '身份证号不合法',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.updateteam.bankCardNo) {
      // var idcardReg = /^([1-9]{1})(\d{14}|\d{18})$/;
      var idcardReg = /^(?:[1-9]{1})(?:\d{11}|\d{15}|\d{18})$/;
      if (!idcardReg.test(that.data.updateteam.bankCardNo)) {
        wx.showToast({
          title: '银行卡号不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    var token = wx.getStorageSync('token');
    app.func.req('teams/updateTeam', {
      id: that.data.b_id,
      "teamType.id": that.data.changeteamTypeid,
      provinceId: that.data.team.provinceId || '',
      cityId: that.data.team.cityId || '',
      districtId: that.data.team.districtId || '',
      ...
      this.data.updateteam
    }, function (data) {
      wx.showToast({
        title: data.msg,
        icon: 'success',
        duration: 1500,
        complete: function () {
          that.setData({
            isprop: false,
            // isprop: "none",
            isEdit: true
          })
        }
      });
      loadingtime: setTimeout(function () {
        that.getteam();
      }, 1500)
    });

  },
  //全部成员信息
  alluser: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('teams/getTeamInMembers', {
      teamId: that.data.b_id
    }, function (data) {
      if (data) {
        that.setData({
          alluser: data,
        });
      }
    });
  },
  //成员信息详情
  userinfo: function (e) {
    wx.navigateTo({
      url: '/pages/teammember/teammemberinfo?id=' + e.currentTarget.dataset.id + '&b_id=' + this.data.b_id
    })
  },
  //验证
  doVerifyValues: function () {
    var that = this;
    if (!that.data.adduserinfo.title) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (!that.data.adduserinfo.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    if (that.data.adduserinfo.phone) {
      var reg1 = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
      var flag1 = reg1.test(that.data.adduserinfo.phone);
      if (!flag1) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.adduserinfo.idNumber) {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!reg.test(that.data.adduserinfo.idNumber)) {
        wx.showToast({
          title: '身份证号不合法',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.adduserinfo.cardNumber) {
      var idcardReg = /^(?:[1-9]{1})(?:\d{11}|\d{15}|\d{18})$/;
      if (!idcardReg.test(that.data.adduserinfo.cardNumber)) {
        wx.showToast({
          title: '银行卡号不正确',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
    }
    if (that.data.adduserinfo.bankName == null) {
      that.data.adduserinfo.bankName = '';
    }
    this.addAMember();
  },
  //添加成员
  addAMember: function () {
    // 插入formId
    var that = this;
    var token = wx.getStorageSync('token');
    let adduserinfo = that.data.adduserinfo
    app.func.req('teams/addAMember', {
      "team.id": that.data.b_id,
      ...
      adduserinfo
    }, function (data) {

      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 5500
      });
      that.setData({
        clearuserinfo: '',
        newarray: '',
        isprop: false
        // isprop: "none"
      })
      loadingtime: setTimeout(function () {
        that.alluser();
      }, 1500)
    });
  }
})
