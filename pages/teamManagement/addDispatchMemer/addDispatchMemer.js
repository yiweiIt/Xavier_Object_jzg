// pages/announcement/announcement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    judgeDisplay: false,
    type: '',
    memberDispatch: [],
    memberArr:[],
    memberListId: [], //选择框勾选的id列表,
    memberName:[]//选择框勾选的name列表,
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.formId)
    if (wx.getStorageSync('token')) {
      var that = this;
      app.func.req('accounts/updateAccountFormId', {
        formId: e.detail.formId
      }, function(data) {
        if (data) {
          console.log("更新成功");
        }
      });
    }
  },

  /**获取成员信息列表*/
  getMemberDispatchByTeam: function() {
    var that = this;
    app.func.req('teams/getMemberDispatchByTeamId', { }, function(data) {
      if (data.length == 0) {
        that.setData({
          judgeDisplay: true
        });
      } else {
        that.setData({
          judgeDisplay: false,
          memberDispatch: data
        });
      }
    });
  },

  checkboxChange: function(e) {
    //memberName
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var valueArr = e.detail.value;
    var memberListIdArr = [];
    var memberNameArr = [];
    var memberArrList = [];
    for(var i = 0; i<valueArr.length;i++){
       var list = valueArr[i];
       memberListIdArr.push(list.split('-')[0]);
       memberNameArr.push(list.split('-')[1]);
      //  memberArrList.push({'id':list.split('-')[0],'name':list.split('-')[1]});
    }
    this.setData({
      memberListId: memberListIdArr,
      memberName:memberNameArr
    });
  },

  /*派单*/
  goDispatch: function() {
    if (this.data.memberListId.length == 0) {
      wx.showToast({
        title: '请先添加派单成员',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../addDispatch/addDispatch?id=' + this.data.memberListId+'&name='+ this.data.memberName
      })
    }
  },

  /*查看成员历史派单*/
  historyDispatch: function(e) {
    console.log(e.currentTarget.dataset.firstname);
    wx.navigateTo({
      url: '../dispatch/dispatch'
    })
  },

  /*查看成员历史派单*/
  memberDispatch: function(e) {
    console.log(e.currentTarget.dataset.firstname);
    wx.navigateTo({
      url: '../memberDispatch/memberDispatch?id=' + e.currentTarget.dataset.name + '&name='+e.currentTarget.dataset.firstname+'&type=' + this.data.type
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      memberDispatch: [],
      memberListId: [] //选择框勾选的id列表
    });
    this.getMemberDispatchByTeam();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getMemberDispatchByTeam();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})