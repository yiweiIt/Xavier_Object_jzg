// var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// var qqMap = new QQMapWX({
//   key: 'QICBZ-MPHCJ-N4PF3-FVPLP-ROLWO-J2B7B'
// });
const app = getApp();

Page({
  data: {
    scale: '15',
    Height: '0',
    controls: '40',
    latitude: '',
    longitude: '',
    markers: [],
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('myMap')
  },
  onLoad: function () {
    var that = this;
    this.initShopDatas();

    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        that.setData({
          //markers: that.getSchoolMarkers(),
          scale: 15,
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    });

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          },
        })
      }
    })
  },
  controltap(e) {
    //this.moveToLocation();
    console.log("2222");
  },

  markertap(e) {
    //this.moveToLocation();
    console.log("33333");
  },

  moveToLocation: function () {
    console.log(this.mapCtx);
    this.mapCtx.moveToLocation()
  },

  strSub: function (a) {
    var str = a.split(".")[1];
    str = str.substring(0, str.length - 1)
    return a.split(".")[0] + '.' + str;
  },

/**
  createMarkerBak(itm, lat, long) {
    let marker = {
      iconPath: "https://static.jianzhugang.com/mini/image/address.png",
      id: itm.id || 0,
      name: itm.title || '',
      title: itm.title || '',
      latitude: lat,
      longitude: long,
      // label: {
      //   anchorX: 2, 
      //   anchorY: -4,
      //   borderWidth: 1,   //边框宽度
      //   borderColor: "#000", //边框颜色,
      //   borderRadius: 3,   //边框圆角
      //   bgColor: "#fff",   //背景色
      //   padding: 5,      //文本留白
      //   textAlign: "left",
      //   content: itm.title
      // },
      width: 30,
      height: 30,
      callout: {
        content: itm.title,
        color: "#010",  //文本颜色
        fontSize: 10,
        borderRadius: 4,
        bgColor: "#fff",
        padding: 5,
        textAlign: "right",
        display: "ALWAYS"
      }
    };
    return marker;
  },
   */

  createMarker(itm) {
    let marker = {
      iconPath: "http://static.jianzhugang.com/mini/image/star.png",
      id: itm.id || 0,
      name: itm.title || '',
      title: itm.title || '',
      latitude: itm.latitude,
      longitude: itm.longitude,
      width: 30,
      height: 30,
      callout: {
        content: itm.title,
        color: "#010",  //文本颜色
        fontSize: 13,
        borderRadius: 4,
        bgColor: "#fff",
        padding: 8,
        textAlign: "right"
       // ,display: "ALWAYS"
      },
      label: {
        x: 15,
        y: -28,
        // anchorX: 0, 
        // anchorY: 0,
        borderWidth: 1,   //边框宽度
        borderColor: "#000", //边框颜色,
        borderRadius: 3,   //边框圆角
        bgColor: "#fff",   //背景色
        padding: 5,      //文本留白
        textAlign: "left",
        content: itm.title
      },
    };
    return marker;
  },

  initShopDatas: function () {
    var that = this;
    app.func.req('shops/query', {
      page: 0,
      size: 300
    }, function (data) {
      that.initMarkers(data.content);
    })
  },

  initMarkers: function (items) {
    var meMarkers = [];
    for (let item of items) {
      if (item.longitude != null){
        meMarkers.push(this.createMarker(item));
      }
    }
    this.setData({
      markers: meMarkers
    })
  },

/** @describe */
  getLonAndLatByAddress: function (itm) {
    var that = this;
    var markers = that.data.markers;
    qqMap.geocoder({
      address: itm.address,
      success: res => {
        var item = that.createMarker(itm, res.result.location.lat, res.result.location.lng);
        console.log(item);
        console.log(markers);
        markers.push(item);

        that.setData({
          markers: markers
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },

  goShopDetail: function (e) {
    wx.navigateTo({
      url: '../wjdetail/wjdetail?id=' + e.markerId
    })
  }
});