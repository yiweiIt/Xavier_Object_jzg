const app = getApp();
Page({
  data: {
    page: {
      index: 0,
      size: 10
    },
    canLoadMore: true, //是否有下一页

    isOnload: false, //是否初始化加载

    teams: [], //班组列表

    provinceId: "", //省份id
    cityId: "", //市id

    teamTypeId: "", //工种id
  },

  /**
   * 跳转 班组详情
   */
  goTeamDetail: function (e) {
    wx.navigateTo({
      url: 'bztdxq/bztdxq?id=' + e.currentTarget.dataset.name
    })
  },

  //城市切换
  changeArea: function(event) {
    this.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId
    })
    this.doSearch();
  },

  //工种切换
  changeTeamType: function(event) {
    this.setData({
      teamTypeId: event.detail.teamTypeId
    })
    this.doSearch();
  },

  //条件查询
  doSearch: function() {
    this.setData({
      page: {
        index: 0,
        size: this.data.page.size
      },
      isOnload: true
    });
    this.getTeams();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.doSearch();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    this.doSearch();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        },
        isOnload: false
      });
      this.getTeams();
    }
  },

  /**
   * 找活列表
   */
  getTeams: function() {
    var that = this;
    app.isAuthorize().then(value => {
      app.func.req('teams/wxQuery', {
        page: that.data.page.index,
        size: that.data.page.size,
        typeId: that.data.teamTypeId ? that.data.teamTypeId : '',
        provinceId: that.data.provinceId ? that.data.provinceId : '',
        cityId: that.data.cityId ? that.data.cityId : ''
      }, function (data) {
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            teams: data.data
          });
        } else {
          that.setData({
            canLoadMore: !data.last,
            teams: that.data.teams.concat(data.data)
          });
        }
      })
    })
  },
})