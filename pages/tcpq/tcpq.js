/**
 * @author 张泽兴
 * @type {wx.App}
 */
const app = getApp();
Page({
  data: {
    page: {
      index: 0,
      size: 20
    },
    canLoadMore: true, //是否有下一页
    isOnload: false, //是否初始化加载
    hires: [],
    provinceId: "", //省份id
    cityId: "", //市id
    teamTypeId: "" //工种id
  },

  bindSearchStr: function (e) {
    this.setData({
      queryWord: e.detail.value
    });
  },

  //城市切换
  changeArea: function (event) {
    console.log(event.detail)
    this.setData({
      provinceId: event.detail.provinceId,
      cityId: event.detail.cityId,
      areaTitle: event.detail.areaTitle
    })
    if (event.detail.provinceId) {
      wx.setStorageSync('tcpq_provinceId', event.detail.provinceId);
    } else {
      wx.removeStorage({
        key: 'tcpq_provinceId',
        success: function (res) { },
      })
    }
    if (event.detail.cityId) {
      wx.setStorageSync('tcpq_cityId', event.detail.cityId);
    } else {
      wx.removeStorage({
        key: 'tcpq_cityId',
        success: function (res) { },
      })
    }
    if (event.detail.areaTitle) {
      wx.setStorageSync('tcpq_areaTitle', event.detail.areaTitle);
    } else {
      wx.removeStorage({
        key: 'tcpq_areaTitle',
        success: function (res) { },
      })
    }
    this.doSearch();
  },
  laborRecruitment:function(){
    app.isAuthorize().then(value => {
        wx.redirectTo({
          url: '../zgxx/zgxx'
        })
      })
  },
  //工种切换
  changeTeamType: function (event) {
    console.log(event.detail)
    this.setData({
      teamTypeId: event.detail.teamTypeId
    })
    this.doSearch();
  },

  //条件查询
  doSearch: function () {
    this.setData({
      page: {
        index: 0,
        size: this.data.page.size,
        canLoadMore: true, //是否有下一页
        isOnload: false, //是否初始化加载
        hires: []
      },
      isOnload: true
    });
    this.getHires();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('tcpq_provinceId')) {
      this.setData({
        provinceId: wx.getStorageSync('tcpq_provinceId')
      });
    }
    if (wx.getStorageSync('tcpq_cityId')) {
      this.setData({
        cityId: wx.getStorageSync('tcpq_cityId')
      });
    }
    if (wx.getStorageSync('tcpq_areaTitle')) {
      this.setData({
        areaTitle: wx.getStorageSync('tcpq_areaTitle')
      });
    }
    this.doSearch();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.doSearch();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        },
        isOnload: false
      });
      this.getHires();
    }
  },
  getHires: function () {
    var that = this;
    app.func.req('projectHires/wxWorryQuery', {
      page: that.data.page.index,
      size: that.data.page.size,
      queryWord: that.data.queryWord || '',
      teamTypeId: that.data.teamTypeId || '',
      provinceId: that.data.provinceId || '',
      cityId: that.data.cityId || ''
    }, function (data) {
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: data.length == that.data.page.size ? true : false,
          hires: data
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        that.setData({
          canLoadMore: data.length == that.data.page.size ? true : false,
          hires: that.data.hires.concat(data)
        });
      }
    });
  },
  goHireDetail: function (e) {
      if (app.compareVersion()) {
        wx.requestSubscribeMessage({
          tmplIds: ['uYvyuyxSltmJle6b9btUaWx3BsV3_1wVE2Bs8xRCH50'],
          success(res) {
            console.log("res=============", res);
          },
          fail(res) {
            console.log("res=============", res);
          }
        })
      }
      wx.navigateTo({
        url: '../hireDetail/hireDetail?id=' + e.currentTarget.dataset.name
      })
  },



  // goWypq: function () {
  //   var that = this;
  //   app.isBind().then(value => {
  //     wx.navigateTo({
  //       url: '../fbpq/fbpq',
  //     })
  //   })
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (app.isBindPhone()) {
      app.func.req3('scores/wxShare', {}, function (data) {
        if (data.error) {
        } else {
          wx.showToast({
            title: '恭喜你，获得2积分',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
})
