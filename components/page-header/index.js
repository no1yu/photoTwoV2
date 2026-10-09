Component({
  properties: {
    title: String,
    back: Boolean,
    left: Boolean,
    light: Boolean
  },

  data: {
    statusBarHeight: 0,
    navigationHeight: 0,
    menuWidth: 0
  },

  lifetimes: {
    attached() {
      const windowInfo = wx.getWindowInfo()
      const menu = wx.getMenuButtonBoundingClientRect()
      this.setData({
        statusBarHeight: windowInfo.statusBarHeight,
        navigationHeight: (menu.top - windowInfo.statusBarHeight) * 2 + menu.height,
        menuWidth: windowInfo.windowWidth - menu.left + 12
      })
    }
  },

  methods: {
    navigateBack() {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          wx.switchTab({
            url: '/pages/home/index'
          })
        }
      })
    }
  }
})
