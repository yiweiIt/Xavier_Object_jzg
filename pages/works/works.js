/**
 * @author 张泽兴
 * @type {wx.App}
 */
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: {
      index: 0,
      size: 10
    },
    canLoadMore: true, //是否有下一页

    isOnload: false, //是否初始化加载

    lookinglifes: [], //找活列表

    provinceId: "", //省份id
    cityId: "", //市id

    teamTypeId: "" //工种id
  },

  // 跳转发布找活
  // goWorking: function() {
  //   if (app.isBind()) {
  //     wx.navigateTo({
  //       url: 'pubwork/pubwork'
  //     })
  //   }
  // },
  // 跳转发布找活
  goWorking: function () {
    app.isBind().then(value => {
      wx.navigateTo({
        url: 'meworkdetail/meworkdetail?source=3&originate=1'
      })
    })
  },
  //跳转到找活详情
  goHireDetail: function(e) {
    wx.navigateTo({
      url: 'workdetail/workdetail?id=' + e.currentTarget.dataset.name,
    })
  },
  //城市切换
  changeArea: function(event) {
    console.log(event.detail)
    this.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId
    })
    this.doSearch();
  },
  //工种切换
  changeTeamType: function(event) {
    console.log(event.detail)
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
    this.getLookingLife();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var that = this;
     this.doSearch();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];
    if (currPage.data.backPageParam =="myTab"){
      this.doSearch();
    }
    // this.doSearch();
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
      this.getLookingLife();
    }
  },

  /**
   * 找活列表
   */
  getLookingLife: function() {
    var that = this;
    app.func.req('lookingLifes/getLookingLifes', {
      page: that.data.page.index,
      size: that.data.page.size,
      teamTypeId: that.data.teamTypeId ? that.data.teamTypeId : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
      auditStatus: 1
    }, function(data) {
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: !data.last,
          lookinglifes: data.content
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: !data.last,
          lookinglifes: that.data.lookinglifes.concat(data.content)
        });
      }
    })
  },

  changetype: function () {
    wx.navigateTo({
      url: '../dl/dl?publish=1',
    })
  },
})