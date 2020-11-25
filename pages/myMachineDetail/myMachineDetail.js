// pages/myMachineDetail/myMachineDetail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    machineIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadUrl(options.statusId);
    this.loadData(options.id);
    this.setData({
      machineId: options.id
    })
  },

  // 定义标题和url
  loadUrl: function(id) {
    var that = this;
    switch (id) {
      case 'machineIns':
        that.setData({
          getUrl: '/machine/machineIns/get',
          updateUrl: '/machine/machineIns/editStatus',
          statusId: 'machineIns',
          machineStatus: [{
            statusId: 'MACHINEIN_STATUS_ONGOING',
            text: '正在招租'
          }, {
            statusId: 'MACHINEIN_STATUS_DONE',
            text: '已完成'
          }],
        })
        wx.setNavigationBarTitle({
          title: '招租详情',
        })
        break;
      case 'machineOuts':
        that.setData({
          getUrl: '/machine/machineOuts/get',
          updateUrl: '/machine/machineOuts/editStatus',
          statusId: 'machineOuts',
          machineStatus: [{
            statusId: 'MACHINEOUT_STATUS_ONGOING',
            text: '正在出租'
          }, {
            statusId: 'MACHINEOUT_STATUS_DONE',
            text: '已完成'
          }],
        })
        wx.setNavigationBarTitle({
          title: '出租详情',
        })
        break;
      case 'machineRecruit':
        that.setData({
          getUrl: '/machineRecruit/get',
          updateUrl: '/machineRecruit/editStatus',
          statusId: 'machineRecruit',
          machineStatus: [{
            statusId: 'MACHINERECRUIT_STATUS_ONGOING',
            text: '正在招聘'
          }, {
            statusId: 'MACHINERECRUIT_STATUS_DONE',
            text: '已完成'
          }],
        })
        wx.setNavigationBarTitle({
          title: '招聘详情',
        })
        break;
      case 'machinerWants':
        that.setData({
          getUrl: '/machine/machinerWants/get',
          updateUrl: '/machine/machinerWants/editStatus',
          statusId: 'machinerWants',
          machineStatus: [{
            statusId: 'MACHINEWANT_STATUS_ONGOING',
            text: '正在求职'
          }, {
            statusId: 'MACHINEWANT_STATUS_DONE',
            text: '已完成'
          }]
        })
        wx.setNavigationBarTitle({
          title: '求职详情',
        })
        break;
    }
  },

  // get
  loadData: function(id) {
    var that = this;
    app.func.req(that.data.getUrl, {
      id: id
    }, function(data) {
      that.setData({
        machineInfo: data,
        machineType: data.machineType.text.replace(/-/g, ''),
      })
      if (data.firstInTime){
        that.setData({
          firstInTime: data.firstInTime.slice(0, 10),
          lastInTime: data.lastInTime.slice(0, 10),
        })
      }
    })
  },

  updateStatus: function() {
    var status = this.data.machineStatus[this.data.machineIndex].statusId;
    app.func.req(this.data.updateUrl, {
      statusId: status,
      id: this.data.machineId
    }, function(data) {
      wx.showModal({
        title: '提示',
        content: '信息更新成功!',
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    });
  },
  changeMachineStatus: function (e) {
    this.setData({
      machineIndex: e.detail.value
    });
  },

})