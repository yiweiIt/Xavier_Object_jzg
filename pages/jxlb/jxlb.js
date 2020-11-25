const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    page: {
      index: -1,
      size: 10
    },
    duration: 100,
    winHeight: 0, //窗口高度
    currentTab: 0,
    queryWord: "", //搜索关键字
    canLoadMore: true, //是否有下一页
    cityId: null,
    provinceId: null,
    machineries: [],
    machinerents: [],
    machineapplys: [],
    mechanicList: [],
    publishTitle: '我要找机械',
    publishName: 'rent',
    typeArray: [[], []],
    typeIndex: [0, 0],
    typeId: '',
    jxlNamesArray: [[], []],
    jxlIndex: [0, 0],
    jxlName: "全部机械",
    typeName: "机械分类", //工种名称
    types: '',
    allMachineAsk: [], // 机械分类总数据
    districtId: '', // 地区期筛选信息
    cateId: '' // 机械列表的机械分类选中 id
  },


  changeThirdArea: function (event) {
    this.setAreaId(event.detail.countyId, event.detail.cityId, event.detail.provinceId, event.detail.areaTitle);
    if (event.detail.areaTitle != "全部") {
      wx.setStorageSync("jxlb_areaTitle", event.detail.areaTitle)
    } else {
      wx.removeStorageSync("jxlb_areaTitle")
    }
    this.doSearch();
  },

  /**
   * 根据省市改变或分类改变更改列表
   */
  doSearch: function () {
    this.setData({
      page: {
        index: 0,
        size: this.data.page.size
      },
    });
    if (this.data.currentTab === 0) {
      this.getMachineries();
      this.setData({
        machineries: [],
        publishTitle: '我要找机械',
        publishName: 'rent'
      })
    }
    if (this.data.currentTab === 1) {
      this.getmachineRent();
      this.setData({
        machinerents: [],
        publishTitle: '我要出租机械',
        publishName: 'let'
      })
    }
    if (this.data.currentTab === 2) {
      this.getMechanicList();
      this.setData({
        mechanicList: [],
        publishTitle: '我要招聘',
        publishName: 'mechanic'
      })
    }
    if (this.data.currentTab === 3) {
      this.getpeopleWorks();
      this.setData({
        machineapplys: [],
        publishTitle: '我要求职',
        publishName: 'apply'
      })
    }
  },


  setAreaId(countyId, cityId, provinceId, areaTitle) {
    this.setData({
      areaTitle: areaTitle
    })
    if (countyId) {
      this.setData({
        districtId: countyId,
        cityId: '',
        provinceId: ''
      })
      wx.setStorageSync("jxlb_countyId", countyId)
      wx.removeStorageSync("jxlb_cityId")
      wx.removeStorageSync("jxlb_provinceId")
    } else if (cityId) {
      this.setData({
        districtId: '',
        cityId: cityId,
        provinceId: ''
      })
      wx.setStorageSync("jxlb_cityId", cityId)
      wx.removeStorageSync("jxlb_countyId")
      wx.removeStorageSync("jxlb_provinceId")
    } else if (provinceId) {
      this.setData({
        districtId: '',
        cityId: '',
        provinceId: provinceId
      })
      wx.setStorageSync("jxlb_provinceId", provinceId)
      wx.removeStorageSync("jxlb_countyId")
      wx.removeStorageSync("jxlb_cityId")
    } else {
      this.setData({
        districtId: '',
        cityId: '',
        provinceId: ''
      })
      wx.removeStorageSync("jxlb_countyId")
      wx.removeStorageSync("jxlb_cityId")
      wx.removeStorageSync("jxlb_provinceId")
    }
  },

  loadStorage() {
    var countyId = wx.getStorageSync("jxlb_countyId")
    var cityId = wx.getStorageSync("jxlb_cityId")
    var provinceId = wx.getStorageSync("jxlb_provinceId")
    var areaTitle = wx.getStorageSync("jxlb_areaTitle")

    this.setAreaId(countyId, cityId, provinceId, areaTitle);

    var cateId = wx.getStorageSync("jxlb_cateId")
    var typeName = wx.getStorageSync("jxlb_typeName")
    if (cateId) {
      this.setData({
        cateId: cateId,
        typeName: typeName
      })
    }
  },

  /**
   * 滑动切换tab
   */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current === 0){
      that.setData({
        publishTitle: '我要找机械',
        publishName: 'rent'
      })
    }
    if (e.detail.current === 1) {
      that.setData({
        publishTitle: '我要出租机械',
        publishName: 'let'
      })
    }
    if (e.detail.current === 2) {
      that.setData({
        publishTitle: '我要招聘',
        publishName: 'mechanic'
      })
    }
    if (e.detail.current === 3) {
      that.setData({
        publishTitle: '我要求职',
        publishName: 'apply'
      })
    }
    this.initSwitchTab();
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var currentIndx = parseInt(e.target.dataset.current);
      that.setData({
        currentTab: currentIndx
      });
    }
    if (that.data.currentTab === 0) {
      that.setData({
        publishTitle: '我要找机械',
        publishName: 'rent'
      })
    }
    if (that.data.currentTab === 1) {
      that.setData({
        publishTitle: '我要出租机械',
        publishName: 'let'
      })
    }
    if (that.data.currentTab === 2) {
      that.setData({
        publishTitle: '我要招聘',
        publishName: 'mechanic'
      })
    }
    if (that.data.currentTab === 3) {
      that.setData({
        publishTitle: '我要求职',
        publishName: 'apply'
      })
    }
  },

  /**
   * 找机械数据
   */
  getMachineries: function () {
    var that = this;
    wx.showLoading({ title: '加载中' });
    let types = '';
    app.func.req('machine/machineIns/query', {
      page: that.data.page.index,
      size: that.data.page.size,
      areaId: that.data.districtId ? that.data.districtId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      machineTypeId: that.data.cateId ? that.data.cateId : '',
      // machineTypeId: 'MACHINE_CATEGORY_1',
      queryWord: that.data.queryWord ? that.data.queryWord : '',
    }, function (data) {
      wx.hideLoading();
      if (data) {
        let arr = []
        data.content.forEach(function (v, k, arr) {
          v.machineType.text = v.machineType.text.replace(/-/g, '')
        })
        that.setData({
          canLoadMore: !data.last,
          machineries: that.data.machineries.concat(data.content),
        });
      }
      that.setData({
        winHeight: (that.data.machineries.length) * 200
      });
    });
  },
  /**
   * 机械出租数据
   */
  getmachineRent: function () {
    var that = this;
    wx.showLoading({ title: '加载中' });
    let types = ''
    app.func.req('machine/machineOuts/query', {
      page: that.data.page.index,
      size: that.data.page.size,
      areaId: that.data.districtId ? that.data.districtId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      machineTypeId: that.data.cateId ? that.data.cateId : '',
      queryWord: that.data.queryWord ? that.data.queryWord : '',
    }, function (data) {
      wx.hideLoading();
      if (data) {
        let arr = []
        data.content.forEach(function (v, k, arr) {
          v.machineType.text = v.machineType.text.replace(/-/g, '')
        })
        that.setData({
          canLoadMore: !data.last,
          machinerents: that.data.machinerents.concat(data.content),
        });
      }
      that.setData({
        winHeight: (that.data.machinerents.length) * 180
      });
    });
  },
  // 招聘机手数据
  getMechanicList: function () {
    var that = this;
    wx.showLoading({ title: '加载中' });
    app.func.req('machineRecruit/query', {
      page: that.data.page.index,
      size: that.data.page.size,
      areaId: that.data.districtId ? that.data.districtId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      machineTypeId: that.data.cateId ? that.data.cateId : ''
    }, function (data) {
      wx.hideLoading();
      if (data) {
        that.setData({
          canLoadMore: !data.last,
          mechanicList: that.data.mechanicList.concat(data.content)
        });
      }
      that.setData({
        winHeight: (that.data.mechanicList.length) * 180
      });
    })
  },
  /**
   * 机手求职数据
   */
  getpeopleWorks: function () {
    var that = this;
    wx.showLoading({ title: '加载中' });
    let types = ''
    app.func.req('machine/machinerWants/query', {
      page: that.data.page.index,
      size: that.data.page.size,
      areaId: that.data.districtId ? that.data.districtId : '',
      cityId: that.data.cityId ? that.data.cityId : '',
      provinceId: that.data.provinceId ? that.data.provinceId : '',
      machineTypeId: that.data.cateId ? that.data.cateId : '',
      queryWord: that.data.queryWord ? that.data.queryWord : '',
    }, function (data) {
      wx.hideLoading();
      if (data) {
        let arr = []
        data.content.forEach(function (v, k, arr) {
          v.machineType.text = v.machineType.text.replace(/-/g, '')
        })
        that.setData({
          canLoadMore: !data.last,
          machineapplys: that.data.machineapplys.concat(data.content),
        });
      }
      that.setData({
        winHeight: (that.data.machineapplys.length) * 180
      });

    });
  },
  /**
   * 机械分类导航二级元素改变
   */
  bindMechanicalColumnChange: function (e) {
    let result = this.data
    let that = this
    let fen = [] // 子级数组
    that.data.allMachineAsk[e.detail.value].titles.forEach((v, k) => {
      fen.push(v.title)
    })
    if (e.detail.column == 0) {
      this.setData({
        typeArray: [that.data.typeArray[0], fen],
        typeIndex: [e.detail.value, 0]
      })
    }
  },

  /**
   *机械分类导航最后的改变
   */
  bindMechanicalChange: function (e) {
    // 判断选中
    var cateId = '';
    var typeName = '';
    var classId = '';
    var className = '';
    var idx = e.detail.value[0];
    cateId = this.data.allMachineAsk[idx].titles[e.detail.value[1]].id
    classId = this.data.allMachineAsk[idx].id
    typeName = this.data.allMachineAsk[idx].titles[e.detail.value[1]].title
    className = this.data.allMachineAsk[idx].categroy

    this.setData({
      cateId: cateId ? cateId : classId,
      typeName: typeName != "全部" ? typeName : className
    })

    if (this.data.typeName != "全部") {
      wx.setStorageSync("jxlb_cateId", this.data.cateId)
      wx.setStorageSync("jxlb_typeName", this.data.typeName)
    } else {
      wx.removeStorageSync("jxlb_cateId")
      wx.removeStorageSync("jxlb_typeName")
    }


    this.doSearch();
  },
  /*下拉加载更多*/
  onReachBottom: function () {
    console.log('上拉触底事件');
    // var that = this;
    // if (that.data.currentTab == 0) {
    //   that.loadMoreMachines();
    // }
    // if (that.data.currentTab == 1) {
    //   that.loadMoreRents();
    // }
    // if (that.data.currentTab == 2) {
    //   that.loadMoreMechanic();
    // }
    // if (that.data.currentTab == 3) {
    //   that.loadMoreApplys();
    // }
  },
  /*利用scroll-view进行分页操作-工程找机械*/
  loadMoreData: function () {
    let that = this;
    if (that.data.currentTab === 0) {
      that.loadMoreMachines();
    }
    if (that.data.currentTab === 1) {
      that.loadMoreRents();
    }
    if (that.data.currentTab === 2) {
      that.loadMoreMechanic();
    }
    if (that.data.currentTab === 3) {
      that.loadMoreApplys();
    }
  },
  // 加载更多找机械
  loadMoreMachines: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        }
      });
      this.getMachineries();
    }
  },
  // 加载更多机械出租
  loadMoreRents: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        }
      });
      this.getmachineRent();
    }
  },
  // 加载更多机手招聘信息
  loadMoreMechanic: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        }
      });
      this.getMechanicList();
    }
  },
  // 加载更多求职
  loadMoreApplys: function () {
    if (this.data.canLoadMore) {
      this.setData({
        page: {
          index: ++this.data.page.index,
          size: this.data.page.size
        }
      });
      this.getpeopleWorks();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    if (parseInt(options.type) === 2) {
      that.setData({
        currentTab: 0
      })
    }
    that.getMechanicalMenu();
    that.loadStorage();
  },

  initSwitchTab: function () {
    this.setData({
      page: {
        index: -1,
        size: 10
      },
      canLoadMore: true,
      machineries: [],
      machinerents: [],
      machineapplys: [],
      mechanicList: []
    });
    this.goToTop();

    if (this.data.currentTab === 0) {
      this.loadMoreMachines();
    }
    if (this.data.currentTab === 1) {
      this.loadMoreRents();
    }
    if (this.data.currentTab === 2) {
      this.loadMoreMechanic();
    }
    if (this.data.currentTab === 3) {
      this.loadMoreApplys();
    }
  },

  goToTop: function () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 获取机械导航分类接口
   */
  getMechanicalMenu() {
    var that = this;
    app.func.req('dicts/getDictsCategory', {},
      function (data) {
        var arr1 = []
        var allMachineAsk = []
        var titles = []
        data.forEach((v, k) => {
          // arr1.push(v.categroy)
          allMachineAsk.push(v)
        })
        allMachineAsk.unshift({
          categroy: "全部",
          id: "",
          titles: []
        })
        allMachineAsk.forEach((item, index) => {
          arr1.push(item.categroy)
          item.titles.unshift({
            id: '',
            title: '全部'
          })
        })

        allMachineAsk[0].titles.forEach((v, k) => {
          titles.push(v.title)
        })
        that.setData({
          typeArray: [arr1, titles],
          allMachineAsk: allMachineAsk
        })
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo'),
      page: {
        index: 0,
        size: 10
      },
    })
    that.initSwitchTab();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var that = this;
    if (app.isBindPhone()) {
      app.func.req3('scores/wxShare', {}, function (data) {
        if (data.error) {
          // wx.showToast({
          //   title: '你今天已经分享过啦！',
          //   icon: 'none',
          //   duration: 2000
          // })
        } else {
          wx.showToast({
            title: '恭喜你，获得2积分',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    return {
      title: '建筑港机械列表',
      path: '/pages/jxlb/jxlb',
      success: function (res) { // 转发成功
      },
      fail: function (res) { // 转发失败
      }
    }
  },
  /**
   * 跳转找机械详情
   */
  goMachineDetil: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../machinedetails/machinedetails?id=' + e.currentTarget.dataset.name
      })
    })
  }, 1000),

  // 跳转机械出租详情
  gorentDetail: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../rentdetails/rentdetails?id=' + e.currentTarget.dataset.name
      })
    })
  }, 1000),
  // 跳转机手求职详情
  gojobDetail: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../jobdetails/jobdetails?id=' + e.currentTarget.dataset.name
      })
    })
  }, 1000),

  // 跳转招机手详情
  goMechanicDetail: util.throttle(function (e) {
    app.isAuthorize().then(value => {
      wx.navigateTo({
        url: '../mechanicRecruitment/mechanicRecruitment?id=' + e.currentTarget.dataset.name
      })
    })
  }, 1000),

  goPublish: util.throttle(function (e) {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../machinepublish/machinepublish?id=' + e.currentTarget.dataset.name
      })
    })
  }, 1000)
})
