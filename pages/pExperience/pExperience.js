// pages/pExperience/pExperience.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAdd:'',
    hireTitle:'',
    experience:'',
    startDate:'',
    endDate:'',
    provinceId:'',
    cityId:'',
    countyId:'',
    areaTitle:'',
    current: 0,//详情输入的字符
    max: 200,//详情最大输入字符
    hireRequest:'',
    maxImg: 8, 
    imgArr:[],
    imgArrLen:0,
    imgArrLength:0,
    buttonClicked: false
  },
  /*项目名称*/
  bindHireTitle: function(e) {
    // e.detail.value = filtion(e.detail.value)
    this.setData({
      hireTitle: e.detail.value
    });
  },
  /*详情*/
  bindHireRequest:function(e){
    var that = this
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.max) {
      return;
    }
    this.setData({
      current: length,
      hireRequest: e.detail.value
    });
  },
   // 地区选择
   changeThirdArea: function (e) {
    var that = this;
    this.setData({
      provinceId : e.detail.provinceId,
      cityId : e.detail.cityId,
      countyId : e.detail.countyId,
      areaTitle: e.detail.areaTitle
    })
  },
  //日期选择
  bindDateChange: function(e) {
    if(e.target.dataset.type=="end"){
      if(this.data.startDate==""){
        wx.showToast({
          title: '开工时间不能为空',
          icon: 'none',
          duration: 2000
        })
      }else{
          var checkDate = this.checkDateValid(this.data.startDate,e.detail.value);
          if(checkDate){
            this.setData({
              endDate: e.detail.value
            })
          }else{
            wx.showToast({
              title: '完工时间不得早于开工时间',
              icon: 'none',
              duration: 2000
            })
          }
      }
    }else{
      if(this.data.endDate!=""){
          var checkDate = this.checkDateValid(e.detail.value,this.data.endDate);
          if(checkDate){
            this.setData({
              startDate: e.detail.value
            })
          }else{
            wx.showToast({
              title: '完工时间不得早于开工时间',
              icon: 'none',
              duration: 2000
            })
          }
      }else{
        this.setData({
          startDate: e.detail.value
        })        
      }  
    }
  },
  checkDateValid:function(date1, date2){
    if (util.transTime(date2 + ' 00:00:00') <= util.transTime(date1 + ' 00:00:00')) {
      return false;
    }else{
      return true;
    }
  },
  /*保存找活名片*/
  saveBusinessCard:function(){
      var that = this;
       util.buttonClicked(that);
      if (!that.data.hireTitle) {
        wx.showToast({
          title: '项目名称不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }   
      if (!that.data.startDate) {
        wx.showToast({
          title: '开工时间不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (!that.data.endDate) {
        wx.showToast({
          title: '完工时间不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (!that.data.areaTitle) {
        wx.showToast({
          title: '所在地区不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (!that.data.hireRequest) {
        wx.showToast({
          title: '项目详情不能为空',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var list = [{hireTitle:that.data.hireTitle,
                startDate:that.data.startDate,
                endDate:that.data.endDate,
                areaTitle:that.data.areaTitle,
                hireRequest:that.data.hireRequest,
                current:that.data.current,
                imgArr:that.data.imgArr,
                imgArrLen:that.data.imgArrLen,
                imgArrLength:that.data.imgArrLength
               }];
      var parameter =  JSON.parse(JSON.stringify(list));
      that.setData({
        experience:parameter
      })
      that.returnWithGinseng(parameter);
  },
  /*携参返回上一层*/
  returnWithGinseng:function(parameter){ 
    var that = this;
      let pages = getCurrentPages(); 
      let prevPage = pages[pages.length - 2]; 
      console.log(prevPage.data.experience);
      prevPage.setData({
        experience: prevPage.data.experience.concat(parameter),
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1 //想要返回的层级
        })
      }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.add == 1){
        this.setData({
           isAdd:true
        });
     }else{
        this.setData({
          isAdd:false,
          index:options.index
        });   
        this.illustrateProject(options.index);   
     }
  },
 /*显示项目*/
 illustrateProject:function(index){
   var that = this;
    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2]; 
    console.log(prevPage.data.experience[index].areaTitle); 
    var dataList = prevPage.data.experience[index];
    that.setData({
       hireTitle:dataList.hireTitle,
       areaTitle:dataList.areaTitle,
       startDate:dataList.startDate,
       endDate:dataList.endDate,
       hireRequest:dataList.hireRequest,
       current:dataList.current,
       imgArr:dataList.imgArr,
       imgArrLen:dataList.imgArrLen,
       imgArrLength:dataList.imgArrLength
    });
 },
 /*保存修改*/
 changeBack:function(){
    var that = this;
    util.buttonClicked(that);
   if (!that.data.hireTitle) {
     wx.showToast({
       title: '项目名称不能为空',
       icon: 'none',
       duration: 2000
     })
     return;
   }
   if (!that.data.startDate) {
     wx.showToast({
       title: '开工时间不能为空',
       icon: 'none',
       duration: 2000
     })
     return;
   }
   if (!that.data.endDate) {
     wx.showToast({
       title: '完工时间不能为空',
       icon: 'none',
       duration: 2000
     })
     return;
   }
   if (!that.data.areaTitle) {
     wx.showToast({
       title: '所在地区不能为空',
       icon: 'none',
       duration: 2000
     })
     return;
   }
   if (!that.data.hireRequest) {
     wx.showToast({
       title: '项目详情不能为空',
       icon: 'none',
       duration: 2000
     })
     return;
   }
    var index = that.data.index;
    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2];
    var prevPageData = prevPage.data.experience;
    var dataList = prevPage.data.experience[index]; 
    prevPage.data.experience[index].hireTitle = that.data.hireTitle;
    prevPage.data.experience[index].areaTitle = that.data.areaTitle;
    prevPage.data.experience[index].startDate = that.data.startDate;
    prevPage.data.experience[index].endDate = that.data.endDate;
    prevPage.data.experience[index].hireRequest = that.data.hireRequest;
    prevPage.data.experience[index].current = that.data.current;
    prevPage.data.experience[index].imgArr = that.data.imgArr;
    prevPage.data.experience[index].imgArrLen = that.data.imgArrLen;
    prevPage.data.experience[index].imgArrLength = that.data.imgArrLength;
    prevPage.setData({
      experience: prevPage.data.experience,
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    }, 1000)
 },
 deleteBack:function(){
    var that = this;
    var index = that.data.index;
    let pages = getCurrentPages(); 
    let prevPage = pages[pages.length - 2];
    var prevPageData = prevPage.data.experience;
    prevPageData.splice(index, 1);
    prevPage.setData({
      experience: prevPageData,
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    }, 1000)  
 },

  /*上传图片*/
  uploadIdBack: function (e) {
    console.log(e.currentTarget.dataset.index);
    var that = this;
    var imgArr = that.data.imgArr;
    if(!imgArr){
        that.setData({
          imgArr:[]
        });
    }
    if (that.data.imgArr.length < that.data.maxImg){
      that.uploadImages();
    }else{
      wx.showToast({
          title: "最多上传" + that.data.maxImg + "张照片！"
      })
    }
  },
/*上传图片*/
uploadImages:function(){
  var that = this;
  wx.chooseImage({
    count: that.data.maxImg - that.data.imgArr.length,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 10000
      })
      const tempFilePaths =res.tempFilePaths;
      var imgArr = that.data.imgArr;
      for(var i=0;i<tempFilePaths.length;i++){   
          wx.uploadFile({
            url: app.func.rootDocment + 'app/files/uploadImage',
            filePath: res.tempFilePaths[i],
            name: 'file',
            success: function (res) {
              imgArr.push({"img":JSON.parse(res.data).url});
              if (imgArr.length == that.data.maxImg){
                var n = imgArr.length;
              }else{
                var n = imgArr.length + 1;
              }
              if (imgArr.length==4){
                var m = 1 ;
              }else{
                var m = Math.ceil(n / 4);
              }
              var len =  Math.ceil(n/4)*170;

              that.setData({
                imgArr:imgArr,
                imgArrLen:len,
                imgArrLength:m
              });
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
    }
  })
},


  /*删除照片*/
  clearIdBack:function(e){
    console.log(e.currentTarget.dataset.index);
    var that = this;
    var index = e.currentTarget.dataset.index;
    var imgArr = that.data.imgArr;
    imgArr.splice(index, 1);
    if (imgArr.length == that.data.maxImg) {
      var n = imgArr.length;
    } else {
      var n = imgArr.length + 1;
    }
    if (imgArr.length == 4) {
      var m = 1;
    } else {
      var m = Math.ceil(n / 4);
    }
    var len =  Math.ceil(n/4)*170;
    console.log(imgArr);
    that.setData({
      imgArr:imgArr,
      imgArrLen:len,
      imgArrLength: m 
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})