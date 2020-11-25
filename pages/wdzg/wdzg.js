const app = getApp();
// pages/wdzg/wdzg.js
Page({
  data: {
    isIncrease: true,
    prompt: '可查看发布招工的报名列表，以及修改招聘状态',
    nodata: false,
    myPartHires: [],
    signUpList: [],
    page: {
      index: 0,
      size: 10
    },
    simWindow: 'none',
    canLoadMore: true, //是否有下一页
    isOnload: false, //是否初始化加载
    useCanLoadMore: true, //是否有下一页
    useIsOnload: false,
    maskHidden: false,
    avatarPhonto: ''
  },
  onShow: function (options) {
    this.sendSocketMessage();
  },

  onLoad: function (options) {
    this.getHiresInfo();
  },

  sendSocketMessage: function (msg) {
    let that = this
    return new Promise((resolve, reject) => {
      app.sendSocketMessage(msg);
      app.globalData.callback = function (res) {
        console.log('收到服务器内容', res);
        if (JSON.parse(res).checked) {
          console.log(that.data.myPartHires)
          var index = that.data.myPartHires.findIndex(item => item.id == JSON.parse(res).hireId);
          console.log(index);
          var hireListMessage = that.data.myPartHires[index];
          hireListMessage.checked = JSON.parse(res).checked;
          hireListMessage.count = JSON.parse(res).count;
          console.log(hireListMessage);
          var message = that.data.myPartHires;
          message.splice(index, 1, hireListMessage);
          console.log(message);
          that.setData({
            myPartHires: message
          });
        }
        resolve(res)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    if (this.data.isIncrease) {
      this.recruit();
    } else {
      this.related();
    }
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
    }, 1500);
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
      if (this.data.isIncrease) {
        this.getHiresInfo();
      } else {
        this.signUpList();
      }
    }
  },
  /*查看报名列表*/
  viewRegistration: function (e) {
    var that = this;
    app.func.req('/hireApplys/selectApply', {
      hireId: e.currentTarget.dataset.name
    }, function (data) {
      wx.navigateTo({
        url: '../wdzg/registrationList/registrationList?hireId=' + e.currentTarget.dataset.name
      })
      setTimeout(function () {
        var index = e.currentTarget.dataset.index;
        var hireListNext = that.data.myPartHires[index];
        hireListNext.checked = false;
        hireListNext.count = 0;
        var next = that.data.myPartHires;
        next.splice(index, 1, hireListNext);
        that.setData({
          myPartHires: next
        });
      }, 1000);
    });
  },
  // 立即发布跳转
  simJump: function () {
    wx.switchTab({
      url: '../publish/publish'
    })
  },

  goMyHireDetail: function (e) {
    wx.navigateTo({
      url: '../kbjzgxq/kbjzgxq?id=' + e.currentTarget.dataset.name
    })
  },

  /*查询报名申请列表*/
  signUpList: function () {
    var that = this;
    wx.showLoading({ title: '' });
    app.func.req('hireApplys/query', {
      page: that.data.page.index,
      size: that.data.page.size
    }, function (data) {
      wx.hideLoading();
      if (data.code == 200) {
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            signUpList: data.data
          });
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          that.setData({
            canLoadMore: !data.last,
            signUpList: that.data.signUpList.concat(data.data)
          });
        }
      }
      if (that.data.signUpList.length == 0) {
        that.setData({
          nodata: true
        });
      } else {
        that.setData({
          nodata: false
        });
      }
    });
  },
  /*查看申请招工报名*/
  goHireDetail: function (e) {
    console.log(e.currentTarget.dataset.hirestatus);
    if (e.currentTarget.dataset.hirestatus != 'HIRE_TYPE_AUDITED') {
      wx.showToast({
        title: '抱歉！该项目已招满',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '../hireDetail/hireDetail?id=' + e.currentTarget.dataset.name
      })
    }
  },

  /*我的招工发布*/
  getHiresInfo: function () {
    var that = this;
    var phone = wx.getStorageSync('mobile');
    app.func.req('projectHires/wxMyHires', {
      page: that.data.page.index,
      size: that.data.page.size
    }, function (data) {
      wx.hideLoading();
      if (data.code == 200) {
        if (that.data.isOnload) {
          that.setData({
            canLoadMore: !data.last,
            myPartHires: data.data
          });
        } else {
          that.setData({
            canLoadMore: !data.last,
            myPartHires: that.data.myPartHires.concat(data.data)
          });
        }
        if (that.data.myPartHires.length == 0) {
          that.setData({
            nodata: true
          });
        } else {
          that.setData({
            nodata: false
          });
        }
      }
    });
  },

  /*更改状态*/
  changeStatus: function (e) {
    var that = this;
    if (e.currentTarget.dataset.type == 1) {//改为已招满updatastop
      var status = 'HIRE_TYPE_FULL';
      var _status = '已招满';
    } else {
      var status = 'HIRE_TYPE_AUDITED';
      var _status = '正在招聘';
    }
    wx.showLoading({ title: '状态修改中...' });
    app.func.req('projectHires/updateStatusHire', {
      status: status,
      id: e.currentTarget.dataset.name
    }, function (data) {
      var index = e.currentTarget.dataset.index;
      var hireList = that.data.myPartHires[index];
      hireList.status = _status;
      console.log(hireList);
      var m = that.data.myPartHires;
      m.splice(index, 1, hireList);
      console.log(m);
      that.setData({
        myPartHires: m
      });

    })
  },


  recruit: function () {
    this.setData({
      myPartHires: [],
      page: {
        index: 0,
        size: 10
      },
      canLoadMore: true,
      isOnload: false,
      isIncrease: true,
      prompt: '查看发布招工的报名列表，以及修改招聘状态'
    });
    this.getHiresInfo();
  },


  related: function () {
    this.setData({
      signUpList: [],
      page: {
        index: 0,
        size: 10
      },
      canLoadMore: true,
      isOnload: false,
      isIncrease: false,
      prompt: '查看已申请的招工报名'
    });
    this.signUpList();
  },

  /*点击生成海报图*/
  share: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var areaFullTitle = e.currentTarget.dataset.item.areaFullTitle;
    var title = e.currentTarget.dataset.item.title;
    var contacts = e.currentTarget.dataset.item.contacts;
    var peopleNumber = e.currentTarget.dataset.item.peopleNumber;
    var phone = e.currentTarget.dataset.item.phone;
    var salary = e.currentTarget.dataset.item.salary;
    var publishedTime = e.currentTarget.dataset.item.publishedTime;
    var teamTypeTitle = e.currentTarget.dataset.item.teamTypeTitle;
    var isTop = e.currentTarget.dataset.item.isTop;
    wx.getUserInfo({
      success: res => {
        that.setData({
          avatarPhonto: res.userInfo.avatarUrl
        });
      }
    })
    that.setData({
      maskHidden: true,
      nowId: e.currentTarget.dataset.id,
      nowTitle: title
    });
    wx.showLoading({
      title: '努力生成中...',
    })
    setTimeout(function () {
      that.createNewImg(areaFullTitle, title, contacts, peopleNumber, phone, salary, publishedTime, teamTypeTitle, isTop);
    }, 1000)
  },
  //关闭弹层
  closeImg: function () {
    this.setData({
      maskHidden: false
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function (areaFullTitle, title, contacts, peopleNumber, phone, salary, publishedTime, teamTypeTitle, isTop) {
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
        src: 'https://static.jianzhugang.com/mini/newIcon/urgentHireBg.png',
        success: function (res) {
          that.setData({
            path4: res.path
          })
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../image/hireAdressIcon.png',
        success: function (res) {
          that.setData({
            path1: res.path
          })
          resolve(res);
        }
      })
    });
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../image/theTimeIcon.png',
        success: function (res) {
          that.setData({
            path2: res.path
          })
          resolve(res);
        }
      })
    });
    let promise4 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../image/canvasImg.png',
        success: function (res) {
          that.setData({
            path5: res.path
          })
          resolve(res);
        }
      })
    });
    let promise5 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../image/hireMark.png',
        success: function (res) {
          that.setData({
            path3: res.path
          })
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, avatvarImg, promise2, promise3, promise4, promise5
    ]).then(res => {
      const context = wx.createCanvasContext('mycanvas');
      context.setFillStyle("#fff")
      context.fillRect(0, 0, 400, 320);
      context.drawImage('/' + that.data.path1, 15, 25, 22, 22);
      //绘制地址
      context.setFontSize(17);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      var adress = that.fittingString(context, areaFullTitle, 150);
      context.fillText(adress, 45, 44);
      context.stroke();
      //绘制时间
      context.setFontSize(17);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      context.fillText(publishedTime, 220, 44);
      context.stroke();
      context.drawImage('/' + that.data.path2, 190, 25, 22, 22);
      //绘制底部栏线
      context.moveTo(15, 62);
      context.lineTo(385, 62);
      context.strokeWidth = 1;
      context.strokeStyle = '#ddd';
      context.stroke();
      // //绘制头像
      context.save();
      context.beginPath();
      context.arc(60, 123, 45, 0, 90, false);
      context.setStrokeStyle('#ffffff');
      context.clip();
      context.drawImage(that.data.avatar, 15, 78, 90, 90);
      context.restore();
      context.stroke();

      //绘画招聘人
      context.setFontSize(20);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      context.fillText(contacts, 120, 110);
      context.stroke();
      //绘画手机号码
      context.setFontSize(20);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      context.fillText(phone, 120, 145);
      context.stroke();
      //绘制获取完整手机号码
      // var path5 ='/image/canvasImg.png'
      context.drawImage('/' + that.data.path5, 250, 121, 134, 26);
      //绘制项目名称
      context.setFontSize(20);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      var titles = that.fittingString(context, '项目名称 : ' + title, 370);
      context.fillText(titles, 15, 205);
      context.stroke();
      //所需工种
      context.setFontSize(20);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      var workTypes = that.fittingString(context, '所需工种 : ' + teamTypeTitle + peopleNumber + '名', 370);
      context.fillText(workTypes, 15, 245);
      context.stroke();
      //薪资价格
      context.setFontSize(20);
      context.setFillStyle('#222');
      context.setTextAlign('left');
      var moneys = that.fittingString(context, '薪资待遇 : ' + salary, 370);
      context.fillText(moneys, 15, 285);
      context.stroke();
      /*画急聘招工图表-头像*/
      if (isTop > 1) {
        var path3 = "/image/hireMark.png";
        context.drawImage('/' + that.data.path3, 78, 138, 30, 30);
        /*画急聘招工图*/
        context.drawImage(that.data.path4, 275, 212, 90, 90);
      }
      context.draw(true, function () {
        that.canvasTo();
      })
    })

  },
  canvasTo: function () {
    var that = this;
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
  //点击保存到相册
  baocun: function () {
    var that = this;
    that.setData({
      maskHidden: false
    })
    that.onShareAppMessage();
  },
  onShareAppMessage: function () {
    var share = {
      title: this.data.nowTitle,
      path: '/pages/hireDetail/hireDetail?id=' + this.data.nowId,
      imageUrl: this.data.imagePath,
      success: function (res) {
        console.log('成功');
      },
      fail: function (res) {
        console.log('失败');
      }
    }
    return share
  }
})