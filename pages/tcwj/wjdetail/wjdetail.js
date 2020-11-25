const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {},
    shopId:'',
    phone: "",
    starArr: '', // 用于模拟输出星级的数组
    enStarArr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      shopId:options.id
    });
    this.loadShop();
  },
  loadShop:function(){
    var that = this;
    app.func.req('shops/get',{
      id: that.data.shopId
    },function(data){
      if (data.starLevel != null) {
        // 不等于空
        let star = []
        let enstar = []
        for (var i = 0; i < parseInt(data.starLevel); i++) {
          star.push('1')
        }
        for (var i = 0; i < 5 - parseInt(data.starLevel); i++) {
          enstar.push('1')
        }

        that.setData({
          starArr: star,
          enStarArr: enstar
        })
      } else {
        let star = []
        let enstar = []
        // 等于空
        for (var i = 0; i < 5; i++) {
          star.push('1')
        }

        that.setData({
          starArr: [],
          enStarArr: []
        })
      }
      that.setData({
        shopInfo: data
      });

      if (data !== null) {
        that.filterPhone();
      };
     
    });
  },
/**
 * 过滤电话号码
 */
  filterPhone: function () {

    var phoneNum = "";
    if (this.data.shopInfo.phone !== null && this.data.shopInfo.phone !== '') {
      phoneNum = this.data.shopInfo.phone;
    } else {
      phoneNum = this.data.shopInfo.userName
    }

    if (phoneNum != '' && phoneNum != null) {
      this.setData({
        phone: phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

 
})