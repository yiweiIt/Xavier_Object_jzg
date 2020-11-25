// pages/pop/pop.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    modalHidden: {
      type: Boolean,
      value: true
    }, //这里定义了modalHidden属性，属性值可以在组件使用时指定.写法为modal-hidden
    modalMsg: {
      type: String,
      value: ' ',
    }
  },
  data: {
    // 这里是一些组件内部数据
    text: "text",
  },
  methods: {
    // 这里放置自定义方法,取消弹窗
    my_Cancel: function () {
      //触发取消回调
      this.triggerEvent("error")
      this.setData({
        modalHidden: true,
      })
    },
    // 自定义确定方法
    my_Sure: function () {
      //触发成功回调
      this.triggerEvent("success");
      console.log(this.data.text)
      this.setData({
        modalHidden: true,
      })
    }
  }
})
