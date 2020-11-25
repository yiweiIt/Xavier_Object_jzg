// pages/announcement/announcement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addType:'',
    name:'',
    teamType:'',
    teamId:'',
    type:'',
    isprop: "none",
    clearuserinfo: [],//添加成员文本清空
    getMember: [],
    array:
      ['中国农业银行', '中国银行', '中国建设银行', '中国光大银行', '兴业银行',
        '中信银行', '招商银行', '中国民生银行', '交通银行', '广发银行',
        '徽商银行', '华夏银行', '招商银行', '中国工商银行', '中国邮政储蓄银行', '平安银行', '浦发银行'],
    adduserinfo: "",
    loadingtime: '', //清除定时器
    teamId:'',
    isshare:'',
    personalId:''//个人ID
  },

  /*获取组员列表*/
  getMemberByTeamId:function(){
    var that = this;
    wx.showLoading({ title: '加载中...',});
    if(that.data.type=="MEMBER"){
      app.func.req('teams/getTeamDetail', {
        teamId:that.data.teamId
      }, function (data) {
        wx.hideLoading();
        if (data) {
          that.setData({
            getMember: data,
            teamId:data.id,
            personalId:data.memberId
          })
        }
      });
    }else{
      app.func.req('teams/getMemberByTeamId?ob-token=' + wx.getStorageSync('token'), {}, function (data) {
        wx.hideLoading();
        if (data) {
          that.setData({
            getMember: data,
            teamId:data.id,
            teamType:data.teamType,
            name:data.name
          })
        }
      });
    }
  },
  //工种切换
  changeTeamType: function (event) {
    var type = event.detail.teamTypeName.split('-')[1].replace(/(^\s*)/g, "");
    this.setData({
      teamWokerType: type,
      workerTypeId: event.detail.teamTypeId
    });
  },
  /**点击进入组员详情*/
  intoGroupInfo: function (e) {
    console.log(e);
    if((e.currentTarget.dataset.name==this.data.personalId&&this.data.type=='MEMBER')||this.data.type=='TEAM'){
      wx.navigateTo({
        url: '../groupInfo/groupInfo?teamid='+ e.currentTarget.dataset.id+'&id=' + e.currentTarget.dataset.name+'&type='+this.data.type+'&personalId='+this.data.personalId+'&isshare='+this.data.isshare
      })
    }else{
      wx.showToast({
        title: '抱歉，权限不足',
        icon: 'none',
        duration: 1500,
      });      
    }
  },

  invite:function(){
    this.setData({
       isprop: "",
      adduserinfo: ""
    })
  },
  close_model: function (e) {
    this.setData({
       isprop: "none",
      adduserinfo: ""
    })
  },
  userbindbankName: function (e) {
    var that = this;
    let newarray;
    newarray = this.data.array[e.detail.value];
    this.setData({
      newarray
    })
  },
  formSubmit: function (e) {
    let that = this;
    var data = that.data;
    this.setData({
      adduserinfo: e.detail.value
    });
    this.doVerifyValues();
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
    if (!that.data.teamWokerType) {
      wx.showToast({
        title: '工种类型不能为空',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    this.addAMember();
  },
  success:function(e){
    console.log(e);
    this.setData({
      ['adduserinfo.title']: e.detail.name.text,
      ['adduserinfo.idNumber']: e.detail.id.text
    })
  },
  bankSuccess:function(e){
    this.setData({
      ['adduserinfo.cardNumber']: e.detail.number.text,
    })
    this.getBankName();
    // console.log(e.detail.number.text);
  },
  //自动识别开户行
  getBankName:function(){
    var that = this;
    app.func.req('bankCodes/getBankName', {
      code: that.data.adduserinfo.cardNumber
    }, function (data) {
      console.log(data.msg);
      that.setData({
        newarray: data.msg
       })
    });    
  },
  //添加成员
  addAMember: function () {
    // 插入formId
    var that = this;
    var token = wx.getStorageSync('token');
    let adduserinfo = that.data.adduserinfo
    app.func.req('teams/addAMember', {
      "team.id": that.data.teamId,
      teamType: that.data.teamWokerType,
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
        adduserinfo: "",
        newarray: '',
         isprop: "none"
      })
      loadingtime: setTimeout(function () {
        that.getMemberByTeamId();
      }, 1500)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamId:options.teamId,
      type:options.type,
      personalId:options.personalId,
      addType:options.addType,
      isshare:options.isshare,
      userInfo: wx.getStorageSync('userInfo')
    });
    wx.hideShareMenu();
    
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
    this.getMemberByTeamId();
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
  onPullDownRefresh:function () {
    this.getMemberByTeamId();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (ops.from === 'button') {
      console.log(ops.target);
      return {
        title: '建筑港-欢迎你的加入',
        path:"pages/index/index?teamId=" + that.data.teamId+'&name='+ that.data.name+'&teamType='+ that.data.teamType,
        // path:"pages/teamManagement/invite/invite?teamId=" + that.data.teamId+'&name='+ that.data.name+'&teamType='+ that.data.teamType,
        success: function (res) {
          wx.showToast({
            title: '邀请已发送，请耐心等待',
            icon: 'none',
            duration: 2000
          })
        },
        fail: function (res) {
        
        }
      }
    } else {/*右上角分享*/
     
    }
  }
})