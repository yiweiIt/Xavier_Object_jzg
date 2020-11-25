// pages/works/meworkdetail/meworkdetail.js
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    workdata:[{
      address:'',
      userName:'',
      age:'',
      sex:'',
      contactNumber:'',
      teamTypeName:'',
      lookLifeStatus:'',
      content:'',
      cityId:'',
      countyId:'',
      provinceId:''
    }],
    originate:"",
    address:'',
    source:'',//发布找活0 、编辑找活1
    array: ['找活中', '已找到'],
    index: '',
    arrayGenger:['男', '女'],
    arrayIndex:'',
    sexarray: [{ name: '男', value: '1' }, { name: '女', value: '2' }],
    saveSex:'',
    teamTypeId: '', //工种id
    updateteamtype:[],//编辑找活信息
    experience:[],
    // isShow: true,
    isInCode: 1,
    isCodeTime: 60,
    completion:'0%',//资料完整度
    hiddenStamp:true,
    isLast: false,
    bulletBox:0
  },
  /**
   * 生命周期函数--监听页面加载
   *  source =3 originate=1 找活列表进入发布
   *  source =0 originate=0 尚无发布找活
   *  source =1 originate=1 更新内容
   *  source =2 originate=2 点击分享卡片进入
   */
  onLoad: function (options) {
    console.log(options);
    if(options.source==0||options.source==2){
      this.setData({
        source:options.source,
        originate:options.originate,
        openid:options.openid,
        optionName:options.optionName
      });
    }
    if (options.source == 3){
      this.setData({
        source: options.source,
        originate: options.originate
      })
      this.getDatail(1)
    }
    if(options.id){
      this.setData({
        source:1,
        id: options.id
      })
      this.getDatail(0)
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (!wx.getStorageSync('userInfo')) {
      wx.showModal({
        title: '温馨提示!',
        content: '请先授权登录',
        confirmText: "前往登录",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/auth/auth?openid=' + that.data.openid+ '&optionName=findJob',
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
              wx.navigateTo({
                url: '/pages/smrz/smrz?openid=' + that.data.openid+ '&optionName=findJob',
              })
            } else if (res.cancel) {

            }
          }
        });
      }else{
        if (that.data.source == 2 && that.data.bulletBox==0){
          that.setData({
            hiddenStamp: false,
            bulletBox:1
          });
        }     
      }
    }
    that.backChange();
    if (wx.getStorageSync('mobile')){
      that.setData({
        ['workdata.contactNumber']: wx.getStorageSync('mobile'),
        isShow: true
      })
    }else{
      that.setData({
        isShow: false
      }) 
    }
  },
  //确认按钮
  confirm: function (e) {
    var that = this;
    that.setData({
      hiddenStamp: true
    });
  },
  backChange:function(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    this.data.experience = currPage.data.experience;
  },
  //删除添加详情列表
  deleteProject:function(e){
      var that = this;
      console.log(that.data.experience);
      var experienceBox = that.data.experience;
      var index = e.currentTarget.dataset.type;
      experienceBox.splice(index, 1);
      that.setData({
        experience: experienceBox
      })
  },
  //编辑更改
  editProject:function(e){
     var index = e.currentTarget.dataset.type;
     wx.navigateTo({
      url: '../../../pages/pExperience/pExperience?add=0&index='+index,
    })
  },
  // 查看
  getDatail: function (status) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (status==0){
      var url = 'lookingLifes/queryLookingLifeById';
      var para = {id: that.data.id}
    }else{
      var url = 'lookingLifes/getLastLookingLife';
      var para = {}
    }
    app.func.req(url, para, function (data) {
      if (data) {
          that.setData({
            workdata: data,
            teamTypeId: data.teamTypeId,
            address: data.address,
            completion: data.completion,
            phone: data.contactNumber
          })
        if(data.projectExp!=null&&data.projectExp!=undefined){
           that.setData({
            experience:JSON.parse(data.projectExp)
           })
        }else{
          that.setData({
            experience:''
           })
        }
        if (data.lookLifeStatus == 0) {
          that.setData({
            status: '找活中'
          })
        } else {
          that.setData({
            status: '已找到'
          })
        }
      }else{
        if (status == 1){
          that.setData({
            isLast:true
          })
        }
      }
    })
  },

  //性别切换
  bindgender: function (e) {
    console.log(e);
    var that = this;
    let workdata = this.data.workdata;
    workdata.sex = this.data.sexarray[e.detail.value].value
    console.log(workdata.sex);
    this.setData({
      workdata
    })
  },
  //性别切换
  bindPickerChangeSex(e) {
    let workdata = this.data.workdata;
    this.setData({
      arrayIndex: e.detail.value
    })
    if (this.data.arrayIndex == 0) {
      workdata.sex ='男';
      this.setData({
        sex: '男',
        workdata
      })
    }
    if (this.data.arrayIndex == 1) {
      workdata.sex ='女';
      this.setData({
        sex: '女',
        workdata
      })
    }
  },
  //找活状态
  bindPickerChange: function (e) {
    var that = this
    let workdata = that.data.workdata;
    workdata.lookLifeStatus = e.detail.value
    this.setData({
      workdata
    })
  },
  
  //城市切换
  changeThirdArea: function (event) {
    var that = this;
    console.log(event);
    let workdata = this.data.workdata
    workdata.address = event.detail.areaTitle;
    var areaTitleId =event.detail.countyId != null ? event.detail.countyId: event.detail.cityId != null ?event.detail.cityId:event.detail.provinceId;
    var areaTitleIdChoose = event.detail.countyId != null ? 'countyId': event.detail.cityId != null ?'cityId':'provinceId'
    this.setData({
      ['workdata.provinceId']: event.detail.provinceId,
      ['workdata.cityId']: event.detail.cityId,
      ['workdata.countyId']: event.detail.countyId,
      address:event.detail.areaTitle,
      areaTitleId:areaTitleId,
      areaTitleIdChoose:areaTitleIdChoose,
      ['workdata.address']: event.detail.areaTitle
    })
    console.log(areaTitleId);
  },
  /*自动获取用户定位*/
  checkHasLocationPermissionByMP:function(){
    wx.showLoading({ title: '加载中'})
    util.checkHasLocationPermissionByMP().catch( error => {
      wx.hideLoading();
      console.log(error);
    })
    .then( value => {
      wx.hideLoading();
      this.setData({
        address:value.result.address,
        ['workdata.province']: value.result.address_component.province,
        ['workdata.city']: value.result.address_component.city,
        ['workdata.county']:value.result.address_component.district,
        ['workdata.address']: value.result.address
      })
      console.log(value);
    })
  },
  //工种切换
  changeTeamType: function (event) {
    var that=this;
    let workdata = this.data.workdata
    workdata.teamTypeName = event.detail.teamTypeName
    this.setData({
      teamTypeId: event.detail.teamTypeId,
      workdata
    })
  },
  bindName: function (e) {
    this.setData({
      ['workdata.userName']: e.detail.value
    })
  },
  
  bindAge: function (e) {
    if (e.detail.value<=0){
      wx.showToast({
        title: '年龄不得小于0',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        ['workdata.age']: ''
      })
    }else{
      this.setData({
        ['workdata.age']: e.detail.value
      })
    }
  },
  
  bindPhone: function (e) {
    var that =this;
    that.setData({
      ['workdata.contactNumber']: e.detail.value
    })
    if (wx.getStorageSync('mobile') && wx.getStorageSync('mobile') != e.detail.value){
      this.setData({
        isShow: false
      });
    }else{
      this.setData({
        isShow: true
      });    
    }
  },
  /**获取验证码 */
  sendCode: function () {
    app.isBind().then(value => {
      this.getVerifyCode();
    })
  },
  getVerifyCode: function () {
    var that = this;
    if (that.data.workdata.contactNumber=="") {
      wx.showModal({
        title: '提示',
        content: "手机号码不能为空",
        success: function (res) { }
      })
      return;
    }
    console.log(util.isPhone(that.data.workdata.contactNumber));
    if (util.isPhone(that.data.workdata.contactNumber) == false) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var isCodeFun = setInterval(() => {
      var isCodeTime = that.data.isCodeTime - 1
      if (isCodeTime < 0) {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        clearInterval(isCodeFun)
      } else {
        that.setData({
          isCodeTime: isCodeTime
        })
      }

    }, 1000)
    util.sendVerifyCode(that.data.workdata.contactNumber, function () {
      that.setData({
        isInCode: 0   // 已经发送后要过1分钟才能在发送
      })
      that.data.isInCode = 0
      setTimeout(() => {
        that.setData({
          isInCode: 1,
          isCodeTime: 60
        })
        clearInterval(isCodeFun)
      }, 60000)
    });
  },
  /*记录验证码*/
  bindHireCode: function (e) {
    this.setData({
      hireCode: e.detail.value
    });
  }, 
  bindMark: function (e) {
      this.setData({
        ['workdata.content']: e.detail.value
    })
  },
  formSubmit: function (e) {
    this.setData({
      updateteamtype: e.detail.value
    });
    this.saveOrUpdata();
  },
  //保存发布
  saveOrUpdata:function(){
      var that = this;
      var token = wx.getStorageSync('token');  
      if (that.data.updateteamtype.userName == undefined || that.data.updateteamtype.userName == ''){
        wx.showModal({
          title: '提示',
          content: '姓名不能为空',
        })
        return;
      }
      if (that.data.updateteamtype.age == undefined ||that.data.updateteamtype.age == '') {
        wx.showModal({
          title: '提示',
          content: '年龄不能为空',
        })
        return;
      }
      if (that.data.workdata.sex == undefined ||that.data.workdata.sex == '') {
        wx.showModal({
          title: '提示',
          content: '请选择性别',
        })
        return;
      }
      if (that.data.teamTypeId == undefined || that.data.teamTypeId == '') {
        wx.showModal({
          title: '提示',
          content: '请选择工种类型',
        })
        return;
      }
      if (that.data.workdata.address == undefined ||that.data.workdata.address == '') {
        wx.showModal({
          title: '提示',
          content: '请选择所在地区',
        })
        return;
      }
      if (that.data.updateteamtype.contactNumber == undefined || that.data.updateteamtype.contactNumber == ''){
        wx.showModal({
          title: '提示',
          content: '手机号码不能为空',
        })
        return;
      }
      if(!that.data.isShow && !that.data.hireCode){
        wx.showModal({
          title: '提示',
          content: '验证码不能为空',
        })
        return;
      }
     if(this.data.source!=1){
       if (app.compareVersion()) {
         wx.requestSubscribeMessage({
           tmplIds: ['uYvyuyxSltmJle6b9btUaSCHbXOQSQNgxs6d8Xf4EGU'],
           success(res) {
             console.log("res=============", res);
           },
           fail(res) {
             console.log("res=============", res);
           }
         })
       }
        if(that.data.experience!=null&&that.data.experience!=undefined){
            var experience = JSON.stringify(that.data.experience);
        }else{
          var experience ='';
        }  

       if (that.data.workdata.sex == 1) {
         var sex = "男";
       } else if (that.data.workdata.sex == 2) {
         var sex = "女";
       }else{
         var sex = that.data.workdata.sex ;
       }    
      app.func.req('lookingLifes/saveLookingLife',{
            guideOpenId:that.data.openid?that.data.openid:'',//判断是否由点击我的找活分享卡片进入
            code: that.data.hireCode?that.data.hireCode:'',
            userName: that.data.updateteamtype.userName,
            age: that.data.updateteamtype.age,
            sex: sex,
            teamTypeId:that.data.teamTypeId,
            provinceTitle: that.data.workdata.province?that.data.workdata.province:'',
            cityTitle: that.data.workdata.city?that.data.workdata.city:'',
            countyTitle: that.data.workdata.county?that.data.workdata.county:'',
            address: that.data.workdata.address?that.data.workdata.address:'',
            contactNumber:that.data.updateteamtype.contactNumber,
            content: that.data.workdata.content ? that.data.workdata.content : '',
            realNamePhone: wx.getStorageSync('mobile'),
            projectExp:experience
          },function(data){
            if(data.code == 200){
              wx.showToast({
                title: data.msg,
                icon: 'success',
                duration: 1500,
                complete: function () {
                  setTimeout(function () {
                    if(that.data.originate==0){
                      wx.redirectTo({
                        url: '../works',
                      })
                    }else if(that.data.originate==2){
                      wx.redirectTo({
                        url: '../mework/mework',
                      })
                    }else{
                      var pages = getCurrentPages();
                      var currPage = pages[pages.length - 1]; 
                      var prevPage = pages[pages.length - 2];                      
                      prevPage.setData({
                        backPageParam:"myTab"
                      });
                      wx.navigateBack({
                        delta: 1 //想要返回的层级
                      })
                    }
                  }, 1500) 
                }
              });               
            }else{
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 1000
              });
            }
          })
     }else{
       if (that.data.workdata.sex == 1) {
         var sex = "男";
       } else if (that.data.workdata.sex == 2) {
         var sex = "女";
       } else {
         var sex = that.data.workdata.sex;
       }  
        app.func.req('lookingLifes/updateLookingLifeById',{
          code: that.data.hireCode?that.data.hireCode:'',
          id:that.data.id,
          teamTypeId: that.data.teamTypeId,
          province: that.data.workdata.province?that.data.workdata.province:'',
          city: that.data.workdata.city?that.data.workdata.city:'',
          county: that.data.workdata.county?that.data.workdata.county:'',
          address: that.data.workdata.address?that.data.workdata.address:'',
          sex: sex,
          projectExp:JSON.stringify(that.data.experience),
          ...
          this.data.updateteamtype
        }, function (data) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../works',
                })
              }, 1500) 
            }
          });
        })
     }
  },
  /*发布复用上次发布*/
  getLastLookingLife:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    app.func.req('lookingLifes/getLastLookingLife', {
    }, function (data) {
    })
  },
  //跳转到添加项目经验
  addProject: function () {
      wx.navigateTo({
        url: '../../../pages/pExperience/pExperience?add=1',
      })
  },
  //查看班组管理
  goTeamManagement:function(){
    app.isBind().then(value => {
      app.func.req('teams/getIdType', {
      }, function (data) {
        if(data.type=='TEAM'){
          wx.navigateTo({
            url: '/pages/teamManagement/group/group?teamId='+data.id+'&type='+data.type+'&multiRole='+data.multiRole+'&personalId=&isshare=0'
          })
        }else if(data.type=='MEMBER'){
          wx.navigateTo({
            url: '/pages/teamManagement/group/group?teamId='+data.teamId+'&type='+data.type+'&multiRole='+data.multiRole+'&personalId='+data.id+'&isshare=0'
          })
        }else{
          wx.showModal({
            title: '温馨提示',
            content: '请先入驻班组',
            confirmText: "去入驻",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/wyrz/wyrz'
                })
              } 
            }
          });
        }
      });
    })
  },
})