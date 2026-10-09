Component({
  data: {
    selected: 0,
    hidden: false,
    list: [
      {
        pagePath: '/pages/home/index',
        text: '首页',
        icon: '/images/tabs/home.png',
        selectedIcon: '/images/tabs/home_cur.png'
      },
      {
        pagePath: '/pages/sizeList/index',
        text: '规格',
        icon: '/images/tabs/size.png',
        selectedIcon: '/images/tabs/size_cur.png'
      },
      {
        pagePath: '/pages/explore/index',
        text: '探索',
        icon: '/images/tabs/explore.png',
        selectedIcon: '/images/tabs/explore_cur.png'
      },
      {
        pagePath: '/pages/mine/index',
        text: '我的',
        icon: '/images/tabs/mine.png',
        selectedIcon: '/images/tabs/mine_cur.png'
      }
    ]
  },

  methods: {
    switchTab(e) {
      wx.switchTab({
        url: this.data.list[e.currentTarget.dataset.index].pagePath
      })
    }
  }
})

