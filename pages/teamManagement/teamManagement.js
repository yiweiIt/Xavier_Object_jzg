// pages/teamManagement/teamManagement.js
const app = getApp()

Page({
  data: {
    index: 0,
    teamId:'',
    type:'',
    teamTypeId:'',//teamTypeId--班组下工种ID
    personalId:'',//personalId--个人ID
    aa:[],
    //true就是可以切换，false就是不行
    multiRole: 'false',
  },
  

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  /*查看公告记录*/
  queryTeamNewsPage: function () {
    var that = this;
    if (that.data.type == 'MEMBER') {
      var role = 2;
    } else {
      var role = 1;
    }
    app.func.req('teamNews/queryTeamNewsPage', {
      role: role,
      page:0,
      size: 3
    }, function (data) {
      if (data.content) {
        that.setData({
          aa: data.content,
          showNote: true
        });
      }
    });
  },

  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      index: e.detail.current
    })
  },
  /**点击进入公告界面*/
  goAnnouncement:function(){
    wx.navigateTo({
      url: '../teamManagement/announcement/announcement?type='+this.data.type
    })
  },
  /**进入派单界面*/
  goDispatch:function(){
    if(this.data.type=='TEAM'){//个人类型为班组
      wx.navigateTo({
        url: '../teamManagement/addDispatchMemer/addDispatchMemer?id=' +this.data.teamId+'&type='+this.data.type
      })   
    }else{//个人类型为组员teamId在这时是个人id
      wx.navigateTo({
        url: '../teamManagement/memberDispatch/memberDispatch?id=' +this.data.personalId+'&type='+this.data.type
      })
    }
  
  },
  /** 班组管理界面*/
  goGroup: function(){
    wx.navigateTo({
      url: '../teamManagement/group/group?teamId='+this.data.teamId+'&type='+this.data.type+'&personalId='+this.data.personalId+'&isshare=0'
    })  
  },
  /*进入每日一题*/
  dailyQuestion:function(){
    wx.navigateTo({
      url: '../teamManagement/dailyQuestion/dailyQuestion?teamTypeId=' + this.data.teamTypeId
    }) 
  },
  /*进入留言板界面*/
  goBoard:function(){
    wx.navigateTo({
      url: '../teamManagement/messageBoard/messageBoard?type='+this.data.type
    })    
  },
  /*进入考勤记录*/
  goAttendance: function() {
    wx.navigateTo({
      url: '../teamManagement/attendance/attendance'
    })
  },
 /**进入操作规范*/
  goSpecifications:function(){
    wx.navigateTo({
      url: '../teamManagement/specification/specification?teamTypeId='+this.data.teamTypeId+'&status=0'
    })  
  },
  /**进入工艺规范*/
  goCraft: function () {
    wx.navigateTo({
      url: '../teamManagement/specification/specification?teamTypeId='+this.data.teamTypeId+'&status=1'
    })
  },
  /**进入质量标准*/
  goQuality: function () {
    wx.navigateTo({
      url: '../teamManagement/specification/specification?teamTypeId='+this.data.teamTypeId+'&status=2'
    })
  },
  /*进入支付-合约列表界面*/
  goContract:function(){
    wx.navigateTo({
      url: '../teamManagement/contract/contract'
    })
  },
  /*工资订单管理*/
  goOrderList:function(){
    wx.navigateTo({
      url: '../teamManagement/payOrder/payOrder'
    })   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      type:options.type,
      teamId:options.teamId,
      teamTypeId:options.teamTypeId,
      personalId:options.personalId,
      multiRole:options.multiRole
    });
    wx.hideShareMenu();
  },
 /*切换组员身份类型*/
 changeRole:function(){
    var that = this;
    console.log(that.data.type);
    if(that.data.type=='TEAM'){
       var role = 2;
       var changeRoleName = 'MEMBER';
    }else{
       var role = 1;
       var changeRoleName = 'TEAM';
    }
    console.log(role);
    app.func.req('teams/changeRole', {
       role:role
    }, function (data) {
      if(data.code==200){
        that.setData({
          type:changeRoleName,
          teamId: data.data
        });
        that.queryTeamNewsPage();
      }
    });   
 },
  /*查看是否实名认证，未认证无法进入保险*/
  goInsuranceList: function (e) {
    console.log(e.currentTarget.dataset.status);
    app.func.req('teams/checkStatus', {}, function (data) {
      if (data.code == 200) {
        if (e.currentTarget.dataset.status==0){
            wx.navigateTo({
              url: '../teamManagement/insurance/insurance'
            })
        }else{
          wx.navigateTo({
            url: '../teamManagement/insuranceList/insuranceList'
          })
          // wx.navigateTo({
          //   url: '../teamManagement/toInsurance/toInsurance?status=1'
          // })
        }
      } else if (data.code == 402){
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000
        })
        wx.navigateTo({
          url: '../idcard/idcard',
        })
      }
    });
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
    this.queryTeamNewsPage();
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
    this.queryTeamNewsPage();
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