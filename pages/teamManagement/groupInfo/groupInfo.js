// pages/teamManagement/groupInfo/groupInfo.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getMember:[],
    isEdit: true,
    optionsId:0,    
    array:
    ['工商银行', '光大银行', '广发银行', '华夏银行', '建设银行',
      '交通银行', '民生银行', '农业银行', '平安银行', '浦发银行',
      '兴业银行', '邮政银行', '招商银行', '中国银行', '中信银行'],
    index:0,
    updateuserinfo:[],//修改成员信息,
    teamid:'',
    type:'',
    personalId:'',
    editDisplay:false,
    isshare:'',
    arrayGenger: ['男', '女'],
    arrayIndex: '',
    bankName:''//用户开户行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamid:options.teamid,
      optionsId:options.id,
      type:options.type,
      personalId:options.personalId,
      isshare:options.isshare
    })
    this.editDisplay();
    this.getMemberInfo();
    wx.hideShareMenu();
  },
  editDisplay:function(){
    if(this.data.type=='TEAM'){
       this.setData({
        editDisplay:true
       });
    }else{
      if(this.data.optionsId==this.data.personalId){
        this.setData({
          editDisplay:true
         });
      }else{
        this.setData({
          editDisplay:false
         });        
      }
    }
  },
  /*获取组员信息*/
  getMemberInfo:function(){
    var that = this;
    app.func.req('members/getMemberById', {
      id: that.data.optionsId
    }, function (data) {
      if (data) {
        if (data.gender =="男"){
           that.setData({
             arrayIndex:0
           });
        } else if (data.gender == "女") {
          that.setData({
            arrayIndex: 1
          });
        }else{}
        that.setData({
          getMember: data,
          bankName:data.bankName
        })
      }
    });    
  },

  //删除组员
  delete:function(e){
    var that=this;
    if(that.data.type=='TEAM'){
       var content = '确定要删除吗？';
       var title = '删除成功';
    }else{
       var content = '确定要退出吗？';
       var title = '退出成功';     
    }
    wx.showModal({
      title: '提示',
      content: content,
      success(res) {
        if (res.confirm) {
          app.func.req('teams/quitTeam', {
            id: e.currentTarget.dataset.id
          }, function (data) {
            wx.showToast({
              title: title,
              icon: 'success',
              duration: 1500,
              complete: function () {
                if(that.data.isshare==1){
                  console.log('分享退出');
                  wx.navigateBack({
                    delta: 3
                  })  
                }else{
                  console.log('正常班组组员推出删除');
                  if(that.data.type=='TEAM'){
                    wx.navigateBack({
                      delta: 1
                    })
                  }else{
                    wx.navigateBack({
                      delta: 3
                    })                  
                  }                  
                }
              }
            });
          });
        } else if (res.cancel) {
        }
      }
    })
  },
  //开户行切换
  userbindbankName: function (e) {
    let userinfo = this.data.getMember;
    userinfo.bankName = this.data.array[e.detail.value];
  console.log(this.data.array[e.detail.value]);
    this.setData({
        bankName: this.data.array[e.detail.value],
        index: e.detail.value
    })
  },
  bindtitle: function (e) {
    this.setData({
      ['getMember.title']: e.detail.value
    })
  },
  bindidNumber: function (e) {
    this.setData({
      ['getMember.idNumber']: e.detail.value
    })
  },
  success:function(e){
    console.log(e);
    this.setData({
      ['getMember.idNumber']: e.detail.id.text
    })
  },
  bindphone: function (e) {
    this.setData({
      ['getMember.phone']: e.detail.value
    })
  },
  /*切换工种*/
  changeTeamType:function(e){
    var type = e.detail.teamTypeName.split('-')[1].replace(/(^\s*)/g, "");
    this.setData({
      ['getMember.teamType']: type
    });
  },
  bindcardNumber: function (e) {
    this.setData({
      ['getMember.cardNumber']: e.detail.value,
    })
  },
  bankSuccess:function(e){
    this.setData({
      ['getMember.cardNumber']: e.detail.number.text,
    })
    this.getBankName();
    // console.log(e.detail.number.text);
  },

  //自动识别开户行
  getBankName:function(){
    var that = this;
    app.func.req('bankCodes/getBankName', {
      code: that.data.getMember.cardNumber
    }, function (data) {
      console.log(data.msg);
      that.setData({
        bankName: data.msg
       })
    });    
  },
  //性别切换
  bindPickerChangeSex(e) {
    console.log(e);
    this.setData({
      arrayIndex: e.detail.value
    })
    if (e.detail.value == 0) {
      this.setData({
        ['getMember.gender']: '男',
      })
    }
    if (e.detail.value == 1) {
      this.setData({
        ['getMember.gender']: '女',
      })
    }
  },
  bindgender:function(e){
    this.setData({
      ['getMember.gender']: e.detail.value,
    })
  },
  bindnotes:function(e){
    this.setData({
      ['getMember.notes']: e.detail.value,
    })   
  },
  //编辑
  formSubmit: function (e) {
    var that = this;
    console.log(e);
    if (that.data.isEdit) {
      that.setData({
        isEdit: !that.data.isEdit,
      })
      return;
    }
    that.setData({
      updateuserinfo: e.detail.value
    })
    if (!that.data.updateuserinfo.title) {
      wx.showToast({
        title: '姓名不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.getMember.teamType) {
      wx.showToast({
        title: '工种不能为空',
        duration: 1500,
      });
      return;
    }
    if (!that.data.updateuserinfo.phone) {
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
      if (!that.data.updateuserinfo.bankName) {
        wx.showToast({
          title: '开户行未选择',
          icon: 'none',
          duration: 1500,
        });
        return;
      }
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
    let pdata = {
      id: that.data.optionsId,
      "team.id": that.data.teamid,
      teamType: that.data.getMember.teamType,
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
        that.getMemberInfo();
      }, 1500)
      
    });
  },

/*更改星星*/
  changeStars:function(e){
    var that = this;
    if(that.data.type=='TEAM'){
      app.func.req('members/updateStartLevelById', {
        id: that.data.optionsId,
        level: e.currentTarget.dataset.name
      }, function (data) {
        if (data) {
          that.getMemberInfo();
        }
      });       
   }else{
    return;
   }
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
    this.getMemberInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function (ops) {

  }
})