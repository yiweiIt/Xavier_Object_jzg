
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nameArr:[],
    formId: "",
    provinceId: '',//省id
    cityId: '',//市id
    districtId: '',//县id
    areaTitle:'',
    hireTitle:'',
    hirePepoleNum:'',
    hireSalary:'',
    hireContacts:'',
    hirePhone:'',
    address:'',
    current: 0,//详情输入的字符
    max: 100,//详情最大输入字符
    hireRequest: "",
    max: 100,
    changeteamTypeid: '',//工种id
    teamTypeNmae:'',
    memberIds:'' //派遣成员集合
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    this.setData({
      formId: e.detail.formId
    });
    app.isBind().then(value => {
      this.submitType()
    })
  },
  // 地区选择
  changeThirdArea: function (event) {
    var that = this;
    that.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      districtId: event.detail.countyId,
      areaTitle: event.detail.areaTitle
    });
    console.log(event.detail);
  },

 /*工种选择*/
  changeTeamType: function (event) {
    this.setData({
      changeteamTypeid: event.detail.teamTypeId,
      teamTypeNmae: event.detail.teamTypeName
    })
    console.log(event.detail);
  },

 /*确认发布*/
  backTip: function () {
     var that = this;
    if (!that.data.hireTitle) {
      wx.showToast({
        title: '项目名不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.hireSalary) {
      wx.showToast({
        title: '薪资不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.hirePepoleNum) {
      wx.showToast({
        title: '人数不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.hireContacts) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.hirePhone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.changeteamTypeid) {
      wx.showToast({
        title: '工种不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.areaTitle) {
      wx.showToast({
        title: '地区不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.address) {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (!that.data.hireRequest) {
      wx.showToast({
        title: '详情不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.showLoading({title: '提交派单中...',});
    console.log(typeof (that.data.memberIds));
    app.func.req('teamDispatch/teamDispatch', {
      projectName: that.data.hireTitle,
      salary: that.data.hireSalary,
      peopleNumber: that.data.hirePepoleNum,
      contacts: that.data.hireContacts,
      phone: that.data.hirePhone,
      teamTypeId: that.data.changeteamTypeid,
      provinceId: that.data.provinceId,
      cityId: that.data.cityId,
      districtId: that.data.districtId,
      memberIds: that.data.memberIds,
      streetAddress:that.data.address,
      memo: that.data.hireRequest,
      formId: that.data.formId
    }, function (data) {
      wx.hideLoading();
      if (data){
        wx.showToast({
          title: '派单成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
        },3000);
      }else{
        wx.showToast({
          title: '派单失败',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var idArr = options.id.split(',');
    var nameArr = options.name.split(',');
    var memberArrList =[];
    for(var i=0;i<idArr.length;i++){
      var m ={'id':idArr[i],'name':nameArr[i],'memo':''};
      memberArrList.push(m);
    }
    this.setData({
      memberIds:memberArrList
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /*获取项目名称*/
  bindHireTitle: function (e){
    this.setData({
      hireTitle: e.detail.value
    });
  },
  /*薪资*/
  bindHireSalary:function(e){
    this.setData({
      hireSalary: e.detail.value
    });
  },
  /*人数*/
  bindHirePepoleNum: function (e) {
    this.setData({
      hirePepoleNum: e.detail.value
    });
  },
  /*联系人*/
  bindHireContacts: function (e) {
    this.setData({
      hireContacts: e.detail.value
    });
  },
 /*手机号码*/
  bindHirePhone: function (e) {
    var that = this;
    that.setData({
      hirePhone: e.detail.value
    });
  },
  blurfocusPhone:function(e){
    var that = this;
    var reg = /^[1]([3-9])[0-9]{9}$/;
    var phone = reg.test(e.detail.value);
    if (phone) {
      that.setData({
        hirePhone: e.detail.value
      });
    } else {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 2000
      });
      that.setData({
        hirePhone: ''
      });
    }
  },
  /*详细地址*/
  bindAddress:function(e){
    var that = this
    that.setData({
      address: e.detail.value
    });
  },
  /*详情*/
  bindHireRequest: function (e) {
    console.log(e);
    var that = this;
    var index = e.target.dataset.index;
    var value = e.detail.value;
    that.data.memberIds[index].memo= e.detail.value;

    var length = parseInt(value.length);

    if (length > this.data.max) {
      return;
    }
    this.setData({
      current: length,
      memberIds:that.data.memberIds
      // hireRequest: e.detail.value
    });
    console.log(that.data.memberIds)
  },

  submitType:function(){
     var that = this;
     wx.showLoading({title: '提交派单中...',});
     var arr= that.data.memberIds;

     for(var i = 0;i<arr.length;i++){
        delete arr[i].name
     }
     console.log(typeof (arr));
     app.func.req('teamDispatch/add', {
       data: JSON.stringify(arr)
    }, function (data) {
      wx.hideLoading();
      if (data){
        wx.showToast({
          title: '派单成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
        },3000);
      }else{
        wx.showToast({
          title: '派单失败',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },

  /*值校验*/

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
