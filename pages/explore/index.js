import { request } from '../../utils/request'

Page({
  data: {
    applications: [],
    loading: true,
    applicationIcons: {
      3: 'idcard',
      4: 'apps-o',
      5: 'brush-o',
      6: 'contact-o',
      7: 'exchange',
      8: 'smile-o',
      9: 'user-circle-o',
      10: 'newspaper-o',
      11: 'font-o',
      12: 'shrink',
      13: 'hd',
      16: 'friends-o'
    }
  },

  onLoad() {
    this.unloaded = false
  },

  onShow() {
    this.pageShowing = true
    this.getTabBar().setData({ selected: 2 })
    this.getExploreData()
  },

  onHide() {
    this.pageShowing = false
  },

  onUnload() {
    this.unloaded = true
    this.pageShowing = false
  },

  getExploreData() {
    this.setData({ loading: true })
    request({
      url: getApp().url + 'otherApi/exploreIndex',
      method: 'GET',
      loginOnInvalid: false
    }).then((res) => {
      if (this.unloaded || !this.pageShowing) {
        return
      }

      if (res.code === 200) {
        this.setData({
          applications: res.data
        })
      }
    }).catch(() => {}).finally(() => {
      if (!this.unloaded && this.pageShowing) {
        this.setData({ loading: false })
      }
    })
  },

  navigateTo(e) {
    const appId = Number(e.currentTarget.dataset.appId || 0)
    const title = e.currentTarget.dataset.title || '图片处理'

    if (appId === 3) {
      wx.switchTab({
        url: '/pages/sizeList/index'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/exploreHandle/index?appId=' + appId + '&title=' + encodeURIComponent(title)
    })
  }
})
