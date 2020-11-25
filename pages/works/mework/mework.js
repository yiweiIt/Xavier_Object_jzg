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
    maskHidden: false,
    avatarPhonto: ''
  },

  // 跳转发布找活
  goWorking: function () {
    app.isBind().then(value => {
      wx.navigateTo({
        url: '../meworkdetail/meworkdetail?source=0&originate=0'
      })
    })
  },

  //跳转到找活详情
  goHireDetail: function (e) {
    wx.navigateTo({
      url: '../meworkdetail/meworkdetail?id=' + e.currentTarget.dataset.name+'&source=1',
    })
  },

  //条件查询
  doSearch: function () {
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
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.doSearch();
  },
  /*创建个人找活卡片*/
  share:function(e){
    var that = this;
    wx.getUserInfo({
      success: res => {
        this.setData({
          avatarPhonto: res.userInfo.avatarUrl
        });
      }
    })
    var address = e.currentTarget.dataset.item.address?e.currentTarget.dataset.item.address:'';
    var teamTypeName = e.currentTarget.dataset.item.teamTypeName;
    var userName = e.currentTarget.dataset.item.userName;
    var sex = e.currentTarget.dataset.item.sex;
    var createTime = e.currentTarget.dataset.item.createTime;
    var contactNumber = e.currentTarget.dataset.item.contactNumber;
    var age = e.currentTarget.dataset.item.age;
    that.setData({
      nowId: e.currentTarget.dataset.id,
      maskHidden: true
    });
    wx.showLoading({
      title: '努力生成中...',
    })
    setTimeout(function () {
      that.createNewImg(address, teamTypeName, userName, sex, createTime, age,contactNumber);
    }, 1000)
  },
  //创建画板
  createNewImg: function (address, teamTypeName, userName, sex, createTime, age, contactNumber){
    var that = this;
    var avatarPhonto = that.data.avatarPhonto;
    let avatvarImg = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: avatarPhonto,
        success: function (res) {
          that.setData({
            avatar: res.path
          })
          resolve(res);
        }
      })
    });
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://static.jianzhugang.com/mini/newIcon/ersonalCard2.png',
        success: function (res) {
          that.setData({
            phoneIcon: res.path
          })
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://static.jianzhugang.com/mini/newIcon/ersonalCard1.png',
        success: function (res) {
          that.setData({
            workTypeIcon: res.path
          })
          resolve(res);
        }
      })
    });
    let promise3= new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://static.jianzhugang.com/mini/newIcon/ersonalCard4.png',
        success: function (res) {
          that.setData({
            addressIcon: res.path
          })
          resolve(res);
        }
      })
    });
    let promise4= new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://static.jianzhugang.com/mini/newIcon/ersonalCard3.png',
        success: function (res) {
          that.setData({
            timeIcon: res.path
          })
          resolve(res);
        }
      })
    });
    let promise5 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: 'https://static.jianzhugang.com/mini/newIcon/lookingShareBg.jpg',
        success: function (res) {
          that.setData({
            lookingShareBg: res.path
          })
          resolve(res);
        }
      })
    });
    Promise.all([avatvarImg, promise1, promise2, promise3, promise4, promise5]).then(res => {
      const context = wx.createCanvasContext('mycanvas');
      context.drawImage(that.data.lookingShareBg, 0, 0, 400, 320)
      /*画头像*/
      context.save();
      context.beginPath();
      context.arc(69, 70, 45, 0, 90, false);
      context.setStrokeStyle('#ffffff');
      context.clip();
      context.drawImage(that.data.avatar, 24, 25, 90, 90);
      context.restore();
      context.stroke();
      /*绘制姓名*/
      context.setFontSize(24);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      var name = that.fittingString(context, userName, 260);
      context.fillText(name, 126, 60);
      context.stroke();  
      /*绘制性别*/
      context.setFontSize(24);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      context.fillText(sex, 240, 100);
      context.stroke();  
      /*绘制年龄*/
      context.setFontSize(22);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      context.fillText(age+'岁', 126,100);
      context.stroke(); 
      /*绘制电话号码*/
      context.drawImage(that.data.phoneIcon, 32, 130, 20, 25);
      context.setFontSize(22);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      var phoneNumber = that.fittingString(context, contactNumber, 310);
      context.fillText(phoneNumber, 70, 150);
      context.stroke();
      /*绘工种Icon*/
      context.drawImage(that.data.workTypeIcon, 30, 175, 25, 25);
      context.setFontSize(22);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      var workType = that.fittingString(context, teamTypeName, 310);
      context.fillText(workType, 70, 195);
      context.stroke();
      /*绘地址Icon*/
      context.drawImage(that.data.addressIcon, 30, 220, 24, 25);
      context.setFontSize(22);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      var adressInfo = that.fittingString(context, address, 310);
      context.fillText(adressInfo, 70, 243);
      context.stroke();
      /*绘时间Icon*/
      context.drawImage(that.data.timeIcon, 30, 265, 25, 25);
      context.setFontSize(22);
      context.setFillStyle('#fff');
      context.setTextAlign('left');
      var time = that.fittingString(context, createTime, 310);
      context.fillText(time, 70, 285);
      context.stroke();

      context.draw(true, function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            that.setData({
              imagePath: tempFilePath
            });
            wx.hideLoading()
          },
          fail: function (res) {
            console.log(res)
          }
        })
      })
    })
  },
  /*画图文字隐藏*/
  fittingString(_ctx, str, maxWidth) {
    let strWidth = _ctx.measureText(str).width;
    const ellipsis = '…';
    const ellipsisWidth = _ctx.measureText(ellipsis).width;
    if (strWidth <= maxWidth || maxWidth <= ellipsisWidth) {
      return str;
    } else {
      var len = str.length;
      var str = str.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      while (strWidth >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.slice(0, len);
        strWidth = _ctx.measureText(str).width;
      }
      return str + ellipsis;
    }
  },
  //关闭弹层
  closeImg: function () {
    this.setData({
      maskHidden: false
    })
  },
  //点击保存到相册
  baocun: function () {
    var that = this;
    that.setData({
      maskHidden: false
    })
    that.onShareAppMessage(1);
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
      this.getLookingLife();
    }
  },

  /**
   * 找活列表
   */
  getLookingLife: function () {
    var that = this;
    app.func.req('lookingLifes/getLookingLifesByAccountId', {}, function (data) {
      if (that.data.isOnload) {
        that.setData({
          canLoadMore: !data.last,
          lookinglifes: data.content
        });
      } else {
        that.setData({
          canLoadMore: !data.last,
          lookinglifes: that.data.lookinglifes.concat(data.content)
        });
      }
    })
  },

  changeStatus: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.type);
    app.func.req('lookingLifes/updateLookingLifeStatus', {
      id: e.currentTarget.dataset.name,
      status: e.currentTarget.dataset.type
    }, function (data) {
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500,
      });
      that.doSearch();
    })
  },
  
  onShareAppMessage: function (ops) {
    if (ops.from =="button"){
      var share = {
        title: '我正在找活，欢迎联系',
        path: '/pages/works/workdetail/workdetail?id=' + this.data.nowId,
        imageUrl: this.data.imagePath,
        success: function (res) {
          console.log('成功');
        },
        fail: function (res) {
          console.log('失败');
        }
      }
     }else{
      var share= {
          title: '班组报名，找活更快！',
          path: "pages/works/meworkdetail/meworkdetail?openid=" + wx.getStorageSync('openId')+'&source=2&originate=2' + '&optionName=findJob',
          imageUrl: 'http://static.jianzhugang.com/mini/image/quick_registration.jpg'
        }
    }
    return share
  }
})