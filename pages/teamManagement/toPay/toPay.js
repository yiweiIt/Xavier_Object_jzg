const app = getApp()
Page({
  data: {
    contractId:'',
    array:
      ['工商银行', '光大银行', '广发银行', '华夏银行', '建设银行',
        '交通银行', '民生银行', '农业银行', '平安银行', '浦发银行',
        '兴业银行', '邮政银行', '招商银行', '中国银行', '中信银行'],
    arrayIndex:'',
    cardNumber:'',
    contractsInfo: [],
    totalNumber:0,
    memberByTeam:[],
    memberList:[],
    all: {},
    remarks:'',
    detailsArr:[],
    arrayBank:[]
  },
  /*银行账户*/
  userbindbankName: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    console.log(that.data.array[e.detail.value]);//'银行名称'
    that.data.arrayBank[index] = that.data.array[e.detail.value];
    that.setData({
      arrayIndex: that.data.array[e.detail.value],
      arrayBank: that.data.arrayBank
    });
    that.changeDetailsArr(index, 0, that.data.array[e.detail.value]);
  },
  /*判定银行卡号*/
  bindCardNumber: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    that.setData({
      cardNumber: e.detail.value
    }); 
    that.changeDetailsArr(index, 1, e.detail.value);
  },
  bankSuccess:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var code = e.detail.number.text;
    that.setData({
      cardNumber: e.detail.number.text
    });
    that.getBankName(index,code);
    that.changeDetailsArr(index, 1, e.detail.number.text);
  },
  // //自动识别开户行
  getBankName:function(index,code){
    var that = this;
    app.func.req('bankCodes/getBankName', {
       code: code
    }, function (data) {
      console.log(data.msg);
      that.data.arrayBank[index] = data.msg;
      that.setData({
        arrayIndex: data.msg,
        arrayBank: that.data.arrayBank
      });
      that.changeDetailsArr(index, 0, data.msg);
    });    
  },
  /*备注*/
  bindRemark:function(e){
    this.setData({
      remarks: e.detail.value
    });       
  },
 /*更改提交信息*/
  changeDetailsArr: function (index, status, bankNameValue){
    var that = this;
    var listArr = that.data.detailsArr;
    console.log(listArr);
    if (status==0){
      listArr[index].bankName = bankNameValue;
    } else if (status == 1){
      listArr[index].cardNumber = bankNameValue;
    } else if(status == 2){
      listArr[index].salary = bankNameValue;
    }else{}
    that.setData({
      detailsArr: listArr
    });
    console.log(listArr);     
  },

  formSubmit: function (e) {
    app.isBind().then(value => {
      if(e.detail.target.dataset.type==1){
        var isAddOrder = false;
        var title = '保存';
      }else{
        var isAddOrder = true;
        var title = '提交';
      }
       this.goToPay(isAddOrder,title);
    })
  },
  /*去付款*/
  goToPay: function (isAddOrder,title) {
    var that = this;
    if (!that.data.remarks) {
      wx.showToast({
        title: '备注/摘要不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (that.data.remarks && that.data.remarks.replace(/[\u4e00-\u9fa5]/g, "aa").length > 60){
      wx.showToast({
        title: '备注/摘要信息过长',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    if (that.data.totalNumber<=0) {
      wx.showToast({
        title: '申请支付金额异常',
        icon: 'none',
        duration: 2000
      })
      return;
    };
    wx.showLoading({ title: title+'中...' });
    app.func.req('contractOrders/createOrder', {
      contractId: that.data.contractId,
      applyAmount: that.data.totalNumber,
      remarks: that.data.remarks,
      detailsStr: JSON.stringify(that.data.detailsArr),
      isAddOrder:isAddOrder
    }, function (data) {
      console.log(data);
      wx.hideLoading();
      if (data) {
        wx.showToast({
          title: title+'成功',
          icon: 'success',
          duration: 2000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 3000);
      } else {
        wx.showToast({
          title: title+'失败',
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
    // this.contracts();
    console.log(options.id);
    this.setData({
      contractId: options.id
    });
    this.getContracts();
    this.getMemberByTeamId();
    wx.hideShareMenu();
  },
  /*获取合约信息*/
  getContracts:function(){
    var that = this;
    app.func.req('contracts/get', {
      id: that.data.contractId
    }, function (data) {
       that.setData({
         contractsInfo:data
       });
    });       
  },
 /*获取班组和成员银行卡号和银行名称*/
  getMemberByTeamId:function(){
    var that = this;
    app.func.req('teams/getMemberByTeamId?ob-token=' + wx.getStorageSync('token'), {}, function (data) {
      if (data){
        var dataArr = [{ "workerName": data.name, "bankName": data.bankName, "cardNumber": data.cardNumber, "salary": 0, "teamId": data.id,"memberId": ""}];
        var arrayBank = [data.bankName];
        var memberList = data.memberList;
        for (var i = 0; i < memberList.length;i++){
          var arr = { "workerName": memberList[i].name, "bankName": memberList[i].bankName, "cardNumber": memberList[i].cardNumber, "salary": 0, "teamId": "", "memberId": memberList[i].id};
          dataArr.push(arr);
          arrayBank.push(memberList[i].bankName);
        }
        console.log(dataArr);
        that.setData({
          memberByTeam: data,
          memberList: memberList,
          detailsArr: dataArr,
          arrayBank: arrayBank
        });
      }
    });       
  },
/*计算总金额*/
  calculation:function(e){
    var all = this.data.all;
    var iname = e.target.dataset.iname;
    var index = e.target.dataset.index;
    var totalNumber = 0;
    all[iname] = e.detail.value;
    for (var i in all) {
      totalNumber += Number(all[i]);
    }
    this.setData({
      all: all,
      totalNumber: totalNumber
    });
    this.changeDetailsArr(index,2, e.detail.value);
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

  }
})