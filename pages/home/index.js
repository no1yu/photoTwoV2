import { goLogin, hasToken } from '../../utils/auth'
import { request } from '../../utils/request'

const app = getApp()

Page({
  data: {
      title:app.appName,
      photoSizeList: []
  },


  onShow() {
    this.getTabBar().setData({ selected: 0 });
    this.getSizeList();
  },


  getSizeList() {
    request({
      url: app.url + 'item/itemList',
      data: {
        pageNum: 1,
        pageSize: 10,
        type: 1
      },
      method: 'GET',
      loginOnInvalid: false
    }).then((res) => {
      if (res.code == 200) {
        this.setData({
          photoSizeList: res.data.records
        });
      }
    }).catch(() => {});
  },


  goNextPage(e) {
    wx.navigateTo({
      url: '/pages/preEdit/index?category=1&data=' + encodeURIComponent(JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])),
    });
  },


  navigateTo(e) {
      const url = e.currentTarget.dataset.url;
      if (url === '/pages/home/index' || url === '/pages/sizeList/index' || url === '/pages/explore/index' || url === '/pages/mine/index') {
          wx.switchTab({
              url,
              success: () => {
                  if (e.currentTarget.dataset.category == 1) {
                      const pages = getCurrentPages();
                      const sizePage = pages[pages.length - 1];
                      if (sizePage.data.category != 1) {
                          sizePage.clickTab({detail: {name: '1'}});
                      }
                  }
              }
          });
          return;
      }
      wx.navigateTo({
          url,
      })
  },

  loginJump(e){
    if (!hasToken()) {
      goLogin();
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      });
    }
  },
  
  //分享好友
  onShareAppMessage() {
    return {
      title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
      path: 'pages/home/index',
      imageUrl: '/images/share.jpg'
    };
  },
  //分享朋友圈
  onShareTimeline() {
    return {
      title: '哇塞，这个证件照小程序也太好用了吧！好清晰，还免费',
      path: 'pages/home/index',
      imageUrl: '/images/share.jpg'
    };
  }


  
})
