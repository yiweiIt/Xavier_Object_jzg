const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hireId:'',
    registrationList:[],
    hireApplyId:'',
    pages:{
       page:0,
       size:10
    },
    canLoadMore: true, //是否有下一页
    isOnload: false //是否初始化加载
  },
  /*招工报名列表*/
  registrationList:function(){
    var that = this;
    app.func.req('hireApplys/list', {
      page:that.data.pages.page,
      size:that.data.pages.size,
      hireId:that.data.hireId
    }, function (data) {
      if(data.code==200){
        that.setData({
          isMore: data.isMore,
          isPay: data.isPay
        });       
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            registrationList: data.data
          });
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          that.setData({
            canLoadMore: !data.last,
            registrationList: that.data.registrationList.concat(data.data)
          });
        }
      }
    });    
  },
  /*拨打电话*/
  makePhoneCall:function(e){
    console.log(e.currentTarget.dataset.name);
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.name 
    })
  },
  /*同意入组*/
  agreeToJoin:function(e){
    var that = this;
    if (!e.currentTarget.dataset.type){
        app.func.req('hireApplys/agreeAccountGroup', {
          hireApplyAccountId: e.currentTarget.dataset.id
        }, function (data) {
            if(data.code==200){
              wx.showToast({
                title: data.msg,
                icon: 'success',
                duration: 2000
              });
              var index = e.currentTarget.dataset.index;
              var hireList = that.data.registrationList[index];
              hireList.isJoinGroup = true;
              var m = that.data.registrationList;
              m.splice(index, 1, hireList);
              that.setData({
                registrationList: m
              });
            }
        });   
    }
  },
  /*获取用户IP*/
  getWechatIP: function () {
    var that = this;
    app.func.req('wxs/getWechatIP', { }, function (data) {
      if (data) {
        that.setData({
          ip: data
        })
      }
    })
  },
  /*单人付款*/
  individualPay:function(e){
    var that = this;
    that.setData({
      hireApplyId: e.currentTarget.dataset.id
    })
    var index = e.currentTarget.dataset.index; 
    app.func.req('wxs/getPayPrepay', {
      openid: app.globalData.openId,
      total_fee: 5000,
      spbill_create_ip: that.data.ip,
      payType: 11,
      hireApplyId:e.currentTarget.dataset.id
    }, function (data) {
      if (data) {
        that.doWxPay(data,1,index)
      }
    })
  },
  /*付款查看更多*/
  payMoney: function () {
    var that = this;
    app.func.req('wxs/getPayPrepay', {
      openid: app.globalData.openId,
      total_fee: 5000,
      spbill_create_ip: that.data.ip,
      payType: 10,
      hireId: that.data.hireId
    }, function (data) {
      if (data) {
        that.doWxPay(data,0)
      }
    })
  },
  /*调取微信支付
  nparameter=>0 付款查看全部
  nparameter=>1 点击付款个人查看
  */
  doWxPay: function (param,nparameter,index) {
    var that = this;
    //小程序发起微信支付
    wx.requestPayment({
      timeStamp: param.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: param.nonceStr,
      package: param.package,
      signType: 'MD5',
      paySign: param.paySign,
      appId: param.appId,
      success: function (res) {
        if(nparameter==0){
          that.setData({
            registrationList: [],
            pages: {
              page: 0,
              size: that.data.pages.size
            },
            canLoadMore: true, 
            isOnload: false 
          });
          that.registrationList();
        }else if(nparameter==1){
          setTimeout(function () {
            that.changeInformation(index);
          }, 2000);
        }else{}
      },
      fail: function (error) {
        console.log("支付失败");
        console.log(error)
      },
      complete: function () {
        console.log("pay complete")
      }
    });
  },
  /*单人付款成功，改变信息*/
  changeInformation:function(index){
     var that = this;
     console.log(that.data.hireApplyId);
     console.log(that.data.hireId);
     app.func.req('hireApplys/getFullPhone', {
        hireApplyId: that.data.hireApplyId,
        hireId: that.data.hireId
      }, function (data) {
          //  var showPhone = data.showPhone?'1':'0';
           var hireList = that.data.registrationList[index];
           hireList.phone = data.phone;
           hireList.isShow = data.showPhone?'1':'0';
           var m = that.data.registrationList;
           m.splice(index, 1, hireList);
           that.setData({
             registrationList: m
           });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      hireId:options.hireId
    }); 
    this.registrationList();
    this.getWechatIP();
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
    wx.showNavigationBarLoading();
    this.setData({
      registrationList:[],
      pages:{
         page:0,
         size:10
      },
      canLoadMore: true, //是否有下一页
      isOnload: false //是否初始化加载
    });
    this.registrationList();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isMore && !this.data.isPay){
       return;
    }else{
      if (this.data.canLoadMore) {
        this.setData({
          pages: {
            page: ++this.data.pages.page,
            size: this.data.pages.size
          },
          isOnload: false
        });
        this.registrationList();
      }
    }
  },
  //跳转到找活详情
  goHireDetail: function(e) {
    if (e.currentTarget.dataset.id != null || e.currentTarget.dataset.id){
        wx.navigateTo({
          url: '../../../pages/bzlb/bztdxq/bztdxq?id=' + e.currentTarget.dataset.id+'&phone=' + e.currentTarget.dataset.name,
        })
    }else{
      wx.showToast({
        title: '信息不全，无法查看',
        icon: 'none',
        duration: 1500
      })      
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})