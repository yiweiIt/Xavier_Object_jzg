// pages/teamManagement/teamManagement.js
const app = getApp()

Page({
  data: {
    index: 0,
    array: [],
    workdata: [],
    teamTypeId: '', //工种id
    status:0,
    quality:'',
    crafts:'',
    regulation:'',
    teamTypeNameStr:''
  },

  /**获取所有工种*/
  teamTypesArray: function () {
    var that = this;
    app.func.req('teamTypes/listAll', {}, function (data) {
      if (data) {
        var arrayArr = [];
        for (var i in data) {
          arrayArr.push(data[i].title);
          if(data[i].id == that.data.teamTypeId){
              var teamTypeNameStr =data[i].category.text+'-'+data[i].title;
          }
        };
        console.log(teamTypeNameStr);
        that.setData({
          array: arrayArr,
          workdata: data,
          indexId:that.data.teamTypeId,
          teamTypeNameStr: teamTypeNameStr
        });
        that.getTeamTypeInfo(that.data.teamTypeId);
      }
    });
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    this.getTeamTypeInfo(this.data.teamTypesArray[e.detail.value].id);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
      if (options.status==0){
        wx.setNavigationBarTitle({
          title: '操作规范'
        })
      } else if (options.status == 1){
        wx.setNavigationBarTitle({
          title: '工艺标准'
        })
      }else{
        wx.setNavigationBarTitle({
          title: '质量标准'
        })
      }
      this.setData({
        teamTypeId: options.teamTypeId,
        status: options.status
      });
     this.teamTypesArray();
     wx.hideShareMenu();
    // this.getTeamTypeInfo(options.teamId);
  },

  /*显示操作规范*/
  getTeamTypeInfo: function (id){
    var that = this;
    let quality="";
    let crafts = "";
    let regulation = "";
    var url = 'teamTypes/getTeamTypeInfo?id=' + id;
    wx.showLoading({ title: '加载中...',});
    app.func.req(url, {}, function (data) {
      wx.hideLoading();
      if (data) {
        if (data.quality != null && data.quality != "" && data.quality!=undefined){
          quality = data.quality.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
        }else{
          quality ="尚未录入质量标准";
        }

        if (data.crafts != null && data.crafts != "" && data.crafts != undefined) {
          crafts = data.crafts.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
        } else {
          crafts = "尚未录入工艺标准";
        }


        if (data.regulation != null && data.regulation != "" && data.regulation != undefined) {
          regulation = data.regulation.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
        } else {
          regulation = "尚未录入操作规范";
        }
        that.setData({
          quality: quality,
          crafts: crafts,
          regulation: regulation
        })         
      }
    });    
  },
  //工种切换
  changeTeamType: function (event) {
    var that = this;
    let workdata = this.data.workdata
    workdata.teamTypeName = event.detail.teamTypeName;
    this.setData({
      teamTypeId: event.detail.teamTypeId
    });
    this.getTeamTypeInfo(event.detail.teamTypeId);
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