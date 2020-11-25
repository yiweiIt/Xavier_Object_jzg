const app = getApp();

Component({
  /**
   * 组件的初始数据
   */
  data: {
    //省市级联
    provinces: [],
    multiArray: [],
    multiIndex: [],
  },

  pageLifetimes: {
    show: function() {
      this.getCityInfo();
    }
  },

  properties: {
    areaTitle: {
      type: String,
      value: ""
    },
    isDisabled: {
      type: String,
      value: false
    },
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    //获取数据库数据
    getCityInfo: function() {
      var that = this;
      wx.showLoading({
        title: 'Loading...',
      })
      app.func.req('areas/getAllThirdArea', {}, function(data) {     
        wx.hideLoading();
        // //获取云数据库数据
         var temp = data;
         temp.shift();
         console.log(temp);
        // //初始化更新数据
        that.setData({
          provinces: temp,
          multiArray: [temp, temp[0].dataList, temp[0].dataList[0].dataList],
          multiIndex: [0, 0, 0]
        })
        })
    },

    //滑动
    bindMultiPickerColumnAreaChange: function(e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      //更新滑动的第几列e.detail.column的数组下标值e.detail.value
      data.multiIndex[e.detail.column] = e.detail.value;
      //如果更新的是第一列“省”，第二列“市”的数组下标置为0
      if (e.detail.column == 0) {
        data.multiIndex = [e.detail.value, 0, 0];
      } else if (e.detail.column == 1) {
        //如果更新的是第二列“市”，第一列“省”的下标不变
        data.multiIndex = [data.multiIndex[0], e.detail.value, 0];
      }
      var temp = this.data.provinces;
      data.multiArray[0] = temp;
      if (temp[data.multiIndex[0]] && (temp[data.multiIndex[0]].dataList).length > 0) {
        //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
        data.multiArray[1] = temp[data.multiIndex[0]].dataList;
        var areaArr = (temp[data.multiIndex[0]].dataList[data.multiIndex[1]]).dataList;
        //如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
        data.multiArray[2] = areaArr.length > 0 ? areaArr : [];
      } else {
        //如果第二列“市”的个数不大于0，那么第二列“市”赋值为空数组
        data.multiArray[1] = [];
        data.multiArray[2] = [];
      }
      //setData更新数据
      this.setData(data);
    },

    //点击确定
    bindMultiPickerAreaChange: function(e) {
      var province = this.data.multiArray[0][this.data.multiIndex[0]].title
      var city = this.data.multiArray[1][this.data.multiIndex[1]].title
      var county = this.data.multiArray[2][this.data.multiIndex[2]].title
      // var areaTitle =  county != "全部"?province + city + county:
      var areaTitle = county != "全部" ? province + city + county : city != "全部" ? province + city : province
      this.setData({
        multiIndex: e.detail.value,
        areaTitle: areaTitle
      })
      // this.setData({
      //   areaTitle: this.data.multiArray[0][this.data.multiIndex[0]].title + this.data.multiArray[1][this.data.multiIndex[1]].title + this.data.multiArray[2][this.data.multiIndex[2]].title
      // })
      this.changeThirdArea();
    },
    changeThirdArea: function() {
      this.triggerEvent('changeThirdArea', {
        provinceId: this.data.multiArray.length > 0 ? (this.data.multiArray[0][this.data.multiIndex[0]] ? this.data.multiArray[0][this.data.multiIndex[0]].id : '') : '',
        cityId: this.data.multiArray.length > 0 ? (this.data.multiArray[1][this.data.multiIndex[1]] ? this.data.multiArray[1][this.data.multiIndex[1]].id : '') : '',
        countyId: this.data.multiArray.length > 0 ? (this.data.multiArray[2][this.data.multiIndex[2]] ? this.data.multiArray[2][this.data.multiIndex[2]].id : '') : '',
        // areaTitle: this.data.multiArray[0][this.data.multiIndex[0]].title + this.data.multiArray[1][this.data.multiIndex[1]].title + this.data.multiArray[2][this.data.multiIndex[2]].title
        areaTitle: this.data.areaTitle
      })
    }
  }
})