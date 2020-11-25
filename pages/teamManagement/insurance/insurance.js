// pages/teamManagement/insurance/insurance.js
const app = getApp()
const util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    projectName:'',
    ids:'',
    teamId:'',
    flag:false,
    extent:0,
    listArr:[],
    isprop: true,
    add_model_title:'',
    add_model_flag:false,
    insurancePlan: [{ "name": '方案一', "type": '1', "choose": true }, 
      { "name": '方案二', "type": '2' , "choose": false },
      { "name": '方案三', "type": '3', "choose": false }],
    array:
      ['中国农业银行', '中国银行', '中国建设银行', '中国光大银行', '兴业银行',
        '中信银行', '招商银行', '中国民生银行', '交通银行', '广发银行',
        '徽商银行', '华夏银行', '招商银行', '中国工商银行', '中国邮政储蓄银行', '平安银行','浦发银行'],
    type: 1,
    total:0
  },
  /*查看PDF文件*/
  file:function(e){
    console.log(e.currentTarget.dataset.type);
    if (e.currentTarget.dataset.type==1){
      var url = 'https://static.jianzhugang.com/mini/teamIcon/JZConstruTreasure.pdf';
      util.downLoadFile(url)
    } else if (e.currentTarget.dataset.type == 2){
      var url = 'https://static.jianzhugang.com/mini/teamIcon/JZConstruClauses.pdf';
      util.downLoadFile(url)
    }
  },
  /*查看方案图片*/
  previewImage: function (e) {
    var that = this;
    wx.previewImage({
      current: 'https://static.jianzhugang.com/mini/teamIcon/ProgramBox.png', // 当前显示图片的http链接
      urls: ['https://static.jianzhugang.com/mini/teamIcon/ProgramBox.png'], // 需要预览的图片http链接列表
      success: function (res) { },
      fail: function (res) {
        wx.showToast({
          title: '图片获取失败',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },
  /**获取成员信息列表*/
  getMemberDispatchByTeam: function () {
    var that = this;
    app.func.req('teams/getTeamAndMembersInfo', {}, function (data) {
          that.setData({
            memberDispatch: data.data.personnel,
            teamId:data.data.id,
            phone: data.data.phone,
            name: data.data.name,
            idNumber: data.data.idNumber
          });
      });
  },
 
  /*选择购买人员*/
  checkboxChange: function (e) {
    //memberName
    var that = this;
    var idArr = e.detail.value.join();
    var flag = that.testIndexInfo(e.detail.value);
    var listArr = [];
    var value = e.detail.value;
    var memberDispatch = that.data.memberDispatch;
    for (var i = 0; i < memberDispatch.length; i++) {
      for (var j = 0; j < value.length;j++){
        if (memberDispatch[i].id == value[j]){
          listArr.push(memberDispatch[i])
        }
      }
    }
    that.setData({
      ids: idArr,
      flag: flag,
      extent: e.detail.value.length,
      listArr: listArr
    });
    that.getInsFee();
  },
  /*判断购买人员中是否包含班组长本身*/
  testIndexInfo:function(arr){
    var that = this;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == that.data.teamId) {
        return true;
      }
    }
    return false;
  },
/*项目名称*/
  bindProjectName: function (e) {
    this.setData({
      projectName: e.detail.value
    });
  },

  // 地区选择
  changeThirdArea: function (event) {
    var that = this;
    that.setData({
      projectAddress: event.detail.areaTitle
    });
  },
  /*选择购买保险方案*/
  chooseInsurance:function(e){
    var that = this;
    var insurancePlan = that.data.insurancePlan;
    insurancePlan.forEach(function (v, k, arr) {
      if (k == e.currentTarget.dataset.index) {
        v.choose = true;
      } else {
        v.choose = false;
      }
    })
    that.setData({
      insurancePlan: insurancePlan,
      type: e.currentTarget.dataset.type
    });
    that.getInsFee();
  },
  //日期选择
  bindDateChange: function (e) {
    if (e.target.dataset.type == "end") {
      if (this.data.startDate == "") {
        wx.showToast({
          title: '保险起期不能为空',
          icon: 'none',
          duration: 2000
        })
      } else {
        var checkDate = this.checkDateValid(this.data.startDate, e.detail.value);
        if (checkDate) {
          this.setData({
            endDate: e.detail.value
          })
        } else {
          wx.showToast({
            title: '保险止期不得早于保险起期',
            icon: 'none',
            duration: 2000
          })
        }
      }
    } else {
      if (this.data.endDate != "") {
        var checkDate = this.checkDateValid(e.detail.value, this.data.endDate);
        if (checkDate) {
          this.setData({
            startDate: e.detail.value
          })
        } else {
          wx.showToast({
            title: '保险止期不得早于保险起期',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        this.setData({
          startDate: e.detail.value
        })
      }
    }
    this.getInsFee();
  },
  checkDateValid: function (date1, date2) {
    if (util.transTime(date2 + ' 00:00:00')<util.transTime(date1 + ' 00:00:00')) {
      return false;
    } else {
      return true;
    }
  },
 /*获取起期日期和至期日期*/
 getDate :function(){
   var that = this;
   var tomorrow = util.getAllDate(1);
   var threeMonths = util.getAllDate(2);
   var nextYear = util.getAllDate(3);
   that.setData({
     tomorrow: tomorrow,
     threeMonths: threeMonths,
     nextYear: nextYear
   });
 },
 /*校验结算保险总额*/
 getInsFee:function(){
   var that = this;
   if (that.data.startDate && that.data.endDate && that.data.type && that.data.listArr.length>0){
      app.func.req('QHP/getInsFee', {
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        plan: that.data.type,
        json: JSON.stringify(that.data.listArr)
      }, function (data) {
        if (data.code==200){
          that.setData({
            total: data.data
          });
        }
      });
   }else{
     return;
   }
 },
  /**购买团险*/
  next: function () {
    var that = this;
    if (that.data.projectName == '' || that.data.projectName == null){
      wx.showToast({
        title: '项目名称不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.startDate == '' || that.data.startDate == null) {
      wx.showToast({
        title: '保险起期不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.endDate == '' || that.data.endDate == null) {
      wx.showToast({
        title: '保险止期不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.projectAddress == '' || that.data.projectAddress == null) {
      wx.showToast({
        title: '项目地址不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (that.data.extent<3){
      wx.showToast({
        title: '请确保至少有三位成员进行投保',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    console.log(that.data.ids);
    app.func.req('QHP/createOrder', {
      flag:that.data.flag,
      startDate: that.data.startDate,
      endDate: that.data.endDate,
      plan: that.data.type,
      projectName: that.data.projectName,
      projectAddress: that.data.projectAddress,
      ids: that.data.ids
    }, function (data) {
      if (data.code==200){
        wx.navigateTo({
          url: '../infoCheck/infoCheck?orderId=' + data.data
        })
      }
    });
  },
  /*取消*/
  close_model: function (e) {
    this.setData({
      isprop: true
    })
  },
  /*添加组员*/
  addMerber:function(){
    var that = this;
    that.setData({
      isprop: false,
      add_model_title: '添加新成员',
      add_model_flag:true,
      changIidNumber: '',
      changeTitle: '',
      teamTypeId: '',
      changePhone: '',
      cardNumber: '',
      bankName: ''
    });
  },
  /*点击需修改成员*/
  changeId:function(e){
    var that = this;
    console.log(e);
    that.setData({
       isprop: false,
      add_model_title: '编辑用户信息',
      add_model_flag: false,
       needModifyIc: e.currentTarget.dataset.id,
       changeTitle: e.currentTarget.dataset.name,
       changePhone: e.currentTarget.dataset.phone,
       changIidNumber: e.currentTarget.dataset.idnumber,
       teamWokerType: e.currentTarget.dataset.teamType ? e.currentTarget.dataset.teamType:''
      //  teamTypeId
    });
  },
  /*编辑姓名*/
  bindtitle: function (e) {
    this.setData({
      changeTitle: e.detail.value
    })
  },
  /*编辑手机号码*/
  bindphone: function (e) {
    this.setData({
      changePhone: e.detail.value
    })
  },
  /*编辑身份证号码*/
  bindidNumber: function (e) {
    this.setData({
      changIidNumber: e.detail.value
    })
  },
  success: function (e) {
    this.setData({
      changIidNumber: e.detail.id.text,
      changeTitle: e.detail.name.text
    })
  },
 
  //工种切换
  changeTeamType: function (event) {
    console.log(event);
    var type = event.detail.teamTypeName.split('-')[1].replace(/(^\s*)/g, "");
    this.setData({
      teamWokerType: type,
      workerTypeId: event.detail.teamTypeId
    });
  },
  //编辑银行卡
  bankSuccess:function(e){
    this.setData({
      cardNumber: e.detail.number.text
    })
    this.getBankName();
  },
  //开户行
  userbindbankName:function(e){
    this.setData({
      bankName:  this.data.array[e.detail.value]
    })
  },
  //自动识别开户行
  getBankName: function () {
    var that = this;
    app.func.req('bankCodes/getBankName', {
      code: that.data.cardNumber
    }, function (data) {
      that.setData({
        bankName: data.msg
      })
    });
  },
  /*保存修改*/
  addSubmit: function (e) {
    var that = this;
    if (that.data.changIidNumber == "" || that.data.changIidNumber == undefined || that.data.changIidNumber == null){
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 1500,
      });   
    } else if (that.data.teamWokerType == "" || that.data.teamWokerType == undefined || that.data.teamWokerType == null) {
      wx.showToast({
        title: '班组类型不能为空',
        icon: 'none',
        duration: 1500,
      });
    } else if (that.data.changeTitle == "" || that.data.changeTitle == undefined || that.data.changeTitle == null){
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500,
      });  
    }else{
      if (that.data.changePhone) {
        var reg1 = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
        var flag1 = reg1.test(that.data.changePhone);
        if (!flag1) {
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            duration: 1500,
          });
          return;
        }
      } 
      if (that.data.changIidNumber){
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(that.data.changIidNumber)) {
            wx.showToast({
              title: '身份证号不合法',
              icon: 'none',
              duration: 1500,
            });
            return;
          }
      }
      if (that.data.add_model_flag){
        if (that.data.cardNumber) {
          var idcardReg = /^(?:[1-9]{1})(?:\d{11}|\d{15}|\d{18})$/;
          if (!idcardReg.test(that.data.cardNumber)) {
            wx.showToast({
              title: '银行卡号不正确',
              icon: 'none',
              duration: 1500,
            });
            return;
          }
        }
        if (that.data.bankName == null) {
          that.data.bankName = '';
        }
        var url = 'teams/addAMember';
        var param = {
          idNumber: that.data.changIidNumber,
          title: that.data.changeTitle,
          teamType: that.data.teamWokerType,
          phone: that.data.changePhone ? that.data.changePhone : '',
          bankName: that.data.bankName ? that.data.bankName:'',
          cardNumber: that.data.cardNumber ? that.data.cardNumber : '',
          "team.id": that.data.teamId
        }
      }else{
        var url = 'teams/updateMember';
        var param = {
          id: that.data.needModifyIc,
          idNumber: that.data.changIidNumber,
          title: that.data.changeTitle,
          teamType: that.data.teamWokerType,
          phone: that.data.changePhone ? that.data.changePhone : '',
          "team.id": that.data.teamId
        }
      }
      app.func.req(url, param, function (data) {
        if (data.code==200){
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500
          });
          that.getMemberDispatchByTeam();
          that.setData({
            isprop: true
          })
        }else{
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 1500,
          });
        }
      });
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // this.getMemberDispatchByTeam();
    this.getDate();
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
   this.getMemberDispatchByTeam();
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