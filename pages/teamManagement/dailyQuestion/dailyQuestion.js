// pages/teamManagement/dailyQuestion/dailyQuestion.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    answer: '', //正确答案
    choiceId: '',
    content:'',
    isRight: true ,//判断解析是否会出现
    isSelect:false,
    indexItem:'test',
    height:'0px',
    dataMsg:''
  },

 /*选中单选*/
 selectOption:function(e){
  var that = this;
   console.log(e.currentTarget.dataset.name);
   if(that.data.isSelect==false){
      that.setData({
        indexItem: e.currentTarget.dataset.index,
        isSelect:true
      })    
   }
    app.func.req('multipleChoice/submit', {
      id: that.data.choiceId,
      answer: e.currentTarget.dataset.name
    }, function(data) {
      if (data.code == 200) {
        that.setData({
          isRight: data.data.isRight,
        })
        if (data.data.isRight) {
          wx.showToast({
            title: '恭喜你回答正确',
            icon: 'success',
            duration: 2000
          });
        } else {
          that.setData({
            answer: data.data.answer,
            description: data.data.description
          })
        }
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'success',
          duration: 2000
        });
      }
    });
    var query = wx.createSelectorQuery()
      query.select('.answerSheet').boundingClientRect(function (res) {
        that.setData({
          height:res.height-33+'px'
        })  
     }).exec();
 },
  subscribe: function () {
    if (app.compareVersion()) {
      wx.requestSubscribeMessage({
        tmplIds: ['F-R0plLILeYajz4MT1FYP1UVx6UJFVrwvQWXuueVS_4'],
        success(res) {
          console.log("res=============", res);
        },
        fail(res) {
          console.log("res=============", res);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     wx.hideShareMenu();
    this.setData({
      teamTypeId: options.teamTypeId,
    });
    this.getMultipleChoice();
  },

 /*获取每日题目*/
  getMultipleChoice: function() {
    var that = this;
    app.func.req('multipleChoice/getMultipleChoice', {
      teamTypeId: that.data.teamTypeId
    }, function(data) {
      if (data.code == 200) {
        that.setData({
          choiceId: data.data.id,
          items: data.data.optionContentArray,
          content: data.data.content
        })
      } else {
        that.setData({
          dataMsg: data.msg
        })
      }
    });
  },

  getMultipleChoiceLogs: function () {
    wx.navigateTo({
      url: '../chioceLog/chioceLog'
    })
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