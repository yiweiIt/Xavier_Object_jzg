const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    modalHidden: {
      type: Boolean,
      value: true
    },
    areaTitle: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //省市级联
    provinces: [],
    multiArray: [],
    multiIndex: [0, 0]
  },

  pageLifetimes: {
    show: function() {
      this.getCityInfo();
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    //获取数据库数据
    getCityInfo: function() {
      var that = this;
      console.log(that.data.modalHidden)
      wx.showLoading({
        title: 'Loading...',
      })
      app.func.req('areas/getAllTwoArea', {}, function(data) {
        wx.hideLoading();
        //获取云数据库数据
        var temp = data;
        //初始化更新数据
        that.setData({
          provinces: temp,
          multiArray: [temp, temp[0].dataList],
          multiIndex: [0, 0]
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
        data.multiIndex = [e.detail.value, 0];
      } else if (e.detail.column == 1) {
        //如果更新的是第二列“市”，第一列“省”的下标不变
        data.multiIndex = [data.multiIndex[0], e.detail.value];
      }
      var temp = this.data.provinces;
      data.multiArray[0] = temp;
      if ((temp[data.multiIndex[0]].dataList).length > 0) {
        //如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
        data.multiArray[1] = temp[data.multiIndex[0]].dataList;
      } else {
        //如果第二列“市”的个数不大于0，那么第二列“市”赋值为空数组
        data.multiArray[1] = [];
      }
      //setData更新数据
      this.setData(data);
    },

    //点击确定
    bindMultiPickerAreaChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
      this.setData({
        areaTitle: this.data.multiArray[0][this.data.multiIndex[0]].title + ' - ' + this.data.multiArray[1][this.data.multiIndex[1]].title
      })
      this.changeArea();
    },
    changeArea: function() {
      this.triggerEvent('changeArea', {
        provinceId: this.data.multiArray[0][this.data.multiIndex[0]].id,
        cityId: this.data.multiArray[1][this.data.multiIndex[1]].id,
        areaTitle: this.data.multiArray[0][this.data.multiIndex[0]].title + ' - ' + this.data.multiArray[1][this.data.multiIndex[1]].title
      })
    }
  }
})