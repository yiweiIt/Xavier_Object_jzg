// pages/idcard/idcard.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    hireId:'',
    optionName:'aisle'
  },

  // 上传图片
  uploadIdBack: function (e) {
    console.log(e.currentTarget.dataset.type);
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        console.log(res.tempFilePaths[0]);
        wx.uploadFile({
          url: app.func.rootDocment + 'app/files/uploadImage',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function (res) {
            if (e.currentTarget.dataset.type == "0") {
              that.setData({
                idBackUrl: JSON.parse(res.data).url,
                idBackId: JSON.parse(res.data).id,
                isShowIdBack: true
              })
            } else if (e.currentTarget.dataset.type == "1") {
              that.setData({
                idFrontUrl: JSON.parse(res.data).url,
                idFrontId: JSON.parse(res.data).id,
                isShowIdFront: true
              })
            } else {
              that.setData({
                idPhoto: JSON.parse(res.data).url,
                idPhotoImg: true
              })
            }
            wx.hideToast();
          },
          fail: function (error) {
            wx.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 2000
            })
            wx.hideToast();
          },
        })
      }
    })
  },

  // 删除图片
  clearIdBack: function (e) {
    var that = this;
    if (e.currentTarget.dataset.type == "0") {
      that.setData({
        idBackUrl: '',
        idBackId: '',
        isShowIdBack: false
      })
    } else if (e.currentTarget.dataset.type == "1") {
      that.setData({
        idFrontUrl: '',
        idFrontId: '',
        isShowIdFront: false
      })
    } else {
      that.setData({
        idPhoto: '',
        idPhotoImg: false
      })
    }
  },
  doSave: function () {
    var that = this;
    console.log(that.data);
    var nameReg = /^[\u4E00-\u9FA5A-Za-z\S]+(·[\u4E00-\u9FA5A-Za-z]+)*$/;
    if (that.data.name == ' ' || that.data.name == undefined) {
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        showCancel: false,
        success(res) {
        }
      })
      return;
    }
    if (!nameReg.test(that.data.name)) {
      wx.showModal({
        title: '提示',
        content: '姓名格式错误',
        showCancel: false,
        success(res) {
        }
      })
      return;
    }
    if (that.data.idNum == ' ' || that.data.idNum == undefined) {
      wx.showModal({
        title: '提示',
        content: '身份证号不能为空',
        showCancel: false,
        success(res) {
        }
      })
      return;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(that.data.idNum)) {
      wx.showModal({
        title: '提示',
        content: "身份证号不合法~",
        success: function (res) {
        }
      })
      return;
    }
    if (that.data.idBackId == '' || !that.data.idBackId) {
      wx.showModal({
        title: '提示',
        content: '请上传身份证头像面',
        showCancel: false,
        success(res) {
        }
      })
      return;
    }
    if (that.data.idFrontId == '' || !that.data.idFrontId) {
      wx.showModal({
        title: '提示',
        content: '请上传身份证国徽面',
        showCancel: false,
        success(res) {
        }
      })

      return;
    }

    // if (that.data.idPhoto == '' || !that.data.idPhoto) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请上传个人真实照片',
    //     showCancel: false,
    //     success(res) {
    //     }
    //   })
    //   return;
    // }
    if(that.data.entryType == 1){
      var parameter = {
        "idFront.id": that.data.idFrontId,
        "idBack.id": that.data.idBackId,
        title: that.data.name,
        idphotoScan: that.data.idFrontUrl,
        idphotoScan2: that.data.idBackUrl,
        idNumber: that.data.idNum,
        hireId: that.data.hireId
      }
    }else{
      var parameter = {
        "idFront.id": that.data.idFrontId,
        "idBack.id": that.data.idBackId,
        title: that.data.name,
        idphotoScan: that.data.idFrontUrl,
        idphotoScan2: that.data.idBackUrl,
        idNumber: that.data.idNum,
        // idPhoto: that.data.idPhoto,
      }
    }
    app.func.req('accounts/wxMeDoShiMin', parameter , function (data) {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 2000,
          complete: function () {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          }
        })
    });
  },

  formSubmit: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    this.doSave();
  },

  bindName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  success:function(e){
    this.setData({
      idNum: e.detail.id.text
    });
   // this.saveAndUp(e.detail.image_path);
  },
  /*扫描银行卡*识别保留后上传银行卡正面照*/
  saveAndUp:function(imagePath){
    var that = this;
    wx.uploadFile({
      url: app.func.rootDocment + 'app/files/uploadImage',
      filePath: imagePath,
      name: 'file',
      success: function (res) {
        console.log(res);
        that.setData({
          idBackUrl: JSON.parse(res.data).url,
          idBackId: JSON.parse(res.data).id,
          isShowIdBack: true
        })
        wx.hideToast();
      },
      fail: function (error) {
        wx.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 2000
        })
        wx.hideToast();
      },
    })
  },
  bindIdNum: function (e) {
    this.setData({
      idNum: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.hireId);
    if (options.hireId){
      this.setData({
        hireId: options.hireId,
        entryType:1
      })
    }else{
      this.setData({
        entryType: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})
