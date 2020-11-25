const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    modalHidden: {
      type: String,
      value: true
    },
    teamTypeName: {
      type: String,
      value: ''
    },
    isDisabled: {
      type: String,
      value: false
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    //类型工种级联
    teamTypes: [],
    multiArray: [],
    multiIndex: []
  },

  pageLifetimes: {
    show: function () {
      this.getTeamTypes();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取数据库数据
    getTeamTypes: function () {
      var that = this;
      wx.showLoading({
        title: 'Loading...',
      })
      app.func.req('teamTypes/getTeamTypeList', { flag: that.data.modalHidden }, function (data) {
        wx.hideLoading();
        //获取云数据库数据
        var temp = data;
        temp.splice(0, 4);
        //初始化更新数据
        that.setData({
          teamTypes: temp,
          multiArray: [temp, temp[0].titles],
          multiIndex: [0, 0]
        })
      })
    },

    //滑动
    bindMultiPickerTeamTypeColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      //更新滑动的第几列e.detail.column的数组下标值e.detail.value
      data.multiIndex[e.detail.column] = e.detail.value;
      //如果更新的是第一列“类型”，第二列“工种”的数组下标置为0
      if (e.detail.column == 0) {
        data.multiIndex = [e.detail.value, 0];
      } else if (e.detail.column == 1) {
        //如果更新的是第二列“工种”，第一列“类型”的下标不变
        data.multiIndex = [data.multiIndex[0], e.detail.value];
      }
      var temp = this.data.teamTypes;
      data.multiArray[0] = temp;
      if ((temp[data.multiIndex[0]].titles).length > 0) {
        //如果第二列“工种”的个数大于0,通过multiIndex变更multiArray[1]的值
        data.multiArray[1] = temp[data.multiIndex[0]].titles;
      } else {
        //如果第二列“工种”的个数不大于0，那么第二列“工种”赋值为空数组
        data.multiArray[1] = [];
      }
      //setData更新数据
      this.setData(data);
    },

    //点击确定
    bindMultiPickerTeamTypeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        multiIndex: e.detail.value
      })
      this.setData({
        teamTypeName: this.data.multiArray[1].length > 0 ? this.data.multiArray[0][this.data.multiIndex[0]].title + ' - ' + this.data.multiArray[1][this.data.multiIndex[1]].title : ''
      })
      this.changeTeamType();
    },
    changeTeamType: function () {
      this.triggerEvent('changeTeamType', {
        teamTypeId: this.data.multiArray[1].length > 0 ? this.data.multiArray[1][this.data.multiIndex[1]].id : '',
        teamTypeName: this.data.multiArray[1].length > 0 ? this.data.multiArray[0][this.data.multiIndex[0]].title + ' - ' + this.data.multiArray[1][this.data.multiIndex[1]].title : ''
      })
    }
  }
})