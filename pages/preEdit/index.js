import { ensureLogin, getToken } from '../../utils/auth'
import { chooseAlbumImage } from '../../utils/media'
import { request, uploadFile } from '../../utils/request'

const app = getApp()

Page({
  data: {
    detail: {},
    isBeautyOn: 0,
    beautySwitch: 0,
  },


  onLoad(options) {
    const sizeDetail = JSON.parse(decodeURIComponent(options.data))
    this.setData({
      detail: sizeDetail,
      "detail.category":decodeURIComponent(options.category)
    })
  },

  onShow() {
    this.getBeautySwitch();
  },

  //温馨提示
  warm() {
    wx.showToast({
      title: "请点击底部相册选择或相机拍照",
      icon: 'none',
      duration: 1500
    });
  },

  noop() {},

  // 美颜开关切换
  onBeautySwitch(e) {
    this.setData({
      isBeautyOn: e.detail.value ? 1 : 0
    })
  },

  //获取管理员是否开启美颜
  getBeautySwitch() {
    request({
      url: app.url + 'api/getBeautySwitch',
      method: 'POST',
      loginOnInvalid: false
    }).then((res) => {
      if (res.code === 200) {
        this.setData({
          beautySwitch: res.data
        });
      }
    }).catch(() => {});
  },

  // 相册选择
  chooseImage() {
    if (!ensureLogin()) {
      return;
    }

    chooseAlbumImage(15)
      .then((file) => this.imgUpload(file.tempFilePath))
      .catch(() => {});
  },

  // 相机拍照
  chooseCamera() {
    if (!ensureLogin()) {
      return;
    }
    const {
      category,
      heightMm,
      heightPx,
      id,
      name,
      widthMm,
      widthPx
    } = this.data.detail
    const isBeautyOn = this.data.isBeautyOn
    const openCamera = () => {
      wx.navigateTo({
        url: '/pages/camera/index',
        success(res) {
          res.eventChannel.emit('chooseCamera', {
            category,
            heightMm,
            heightPx,
            id,
            name,
            widthMm,
            widthPx,
            isBeautyOn
          })
        }
      })
    }

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.camera']) {
          openCamera()
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              openCamera()
            },
            fail() {
              wx.showModal({
                content: '检测到您没打开访问摄像头权限，是否打开？',
                confirmText: '确认',
                cancelText: '取消',
                success(modalRes) {
                  if (modalRes.confirm) {
                    wx.openSetting({
                      success(settingRes) {
                        if (settingRes.authSetting['scope.camera']) {
                          openCamera()
                        } else {
                          wx.showToast({
                            title: '未开启相机权限，可使用相册选择照片',
                            icon: 'none'
                          })
                        }
                      },
                      fail() {
                        wx.showToast({
                          title: '无法打开权限设置，请稍后重试',
                          icon: 'none'
                        })
                      }
                    });
                  }
                }
              });
            }
          })
        }
      },
      fail() {}
    })
  },

  // 上传原图
  imgUpload(filePath) {
    uploadFile({
      url: app.url + 'upload',
      filePath: filePath,
      auth: true,
      loadingText: '图片检测中'
    }).then((data) => {
        if (data.code == 200) {
          this.imageDivision(data.data);
        } else if (data.code == 404) {
          wx.showToast({
            title: data.data,
            icon: "none",
          });
        }
    }).catch(() => {});

  },

  imageDivision(photoId) {
    request({
      url: app.url + 'api/createIdPhoto',
      data: {
        "photoId": photoId,
        "type": this.data.detail.category == 4 ? 2 : 1,
        "itemId": this.data.detail.id,
        "isBeautyOn": this.data.isBeautyOn
      },
      header: {
        "token": getToken()
      },
      method: "POST",
      loadingText: '制作中...'
    }).then((res) => {
        if (res.code == 200) {
          wx.navigateTo({
            url: '/pages/edit/index',
            success: (navigateRes) => {
              navigateRes.eventChannel.emit('photoEditData', {
                ...res.data,
                widthPx: this.data.detail.widthPx,
                heightPx: this.data.detail.heightPx
              });
            }
          });
        } else if (res.code == 404) {
          wx.showToast({
            title: res.data,
            icon: 'none'
          });
        }
    }).catch(() => {});
  },

})
