// pages/receiveInvite/receiveInvite.js 
var formatSecond = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteId: '',
    authorization: false, //是否弹出授权框
    loginShow: false, // 是否弹出登陆框
    isClickReceive: false, //点击立即领取时候变成true，调用注册领取接口
    inviteMessage: ''   // 发起邀请人的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inviteId = options.inviteId;
    this.setData({
      inviteId: inviteId
      // inviteId: '123456'
    })
    // 1111111111111111新增授权
    var that = this;
    that.getInviteInfo()
    wx.getStorage({
      key: 'token',
      success: function (res) {
        app.globalData.token = res.data
      }
    })
    //授权 返回token
    app.getLogin().then(function (res) {
      wx.setStorage({
        key: 'token',
        data: res.data.data.token
      })
      app.globalData.token = res.data.data.token
      if (res.data.data.needAuthorization == true) {
        // 需要弹出授权框
        that.setData({
          authorization: true,
        })
      } else {
        // 不需要弹出授权框
        if (res.data.data.needMobile == true){
          // 如果该用户还未获取过手机号，让其获取手机号
          that.setData({
            loginShow: true
          })
        }
        
      }
    })
  },
  // 加载页面，调用页面渲染数据信息
  getInviteInfo: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'user/getInviteInfo',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {
        inviteRecordId: that.data.inviteId
      },
      method: 'post',
      success: function (res) {
        that.setData({
          inviteMessage: res.data.data
        })
        console.log('渲染页面信息----》' + JSON.stringify(res))
      }
    })
  },
  // 邀请注册 被邀请人注册登录成功时调用此接口
  receiveMoney: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'user/inviteRegister',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {
        inviteRecordId: that.data.inviteId
      },
      method: 'post',
      success: function (res) {
        console.log('邀请人领取红包成功' + JSON.stringify(res))
      }
    })
  },
  // 点击领取奖学金 调用领取注册红包接口
  receiveSuccess: function () {
    var that = this;
    that.setData({
      isClickReceive: true
    })
    wx.request({
      url: app.globalData.url + 'user/receiveRegisterMoney',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {
        inviteRecordId: that.data.inviteId,
        authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        // 如果领取注册红包成功，提示成功，然后跳转到首页
        if(res.data.status == 0){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function(){
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }
          });
        }
        else if (res.data.status == 1008){
          // 如果已经领取过(status:1008)，失败，然后跳转到首页
          wx.showToast({
            title: '您已领取过奖学金',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)

            }
          });
        }
        else if (res.data.status == 1009){
          // 如果被邀请者拒绝获取手机号（status:1009）
          wx.showToast({
            title: '请获取手机号后重新领取',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function(){
                that.setData({
                  loginShow: true
                })
              },2000)
            }
          });
        }
        else if (res.data.status == 1022) {
          // 如果自己点击进入自己的邀请（status:1022）
          wx.showToast({
            title: '无法领取',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }
          });
        }
        else if (res.data.status == 1023) {
          // 如果被邀请人已经注册，无法领取（status:1023）
          wx.showToast({
            title: '您已注册，无法领取',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 2000)
            }
          });
        }
        console.log('注册领取红包成功' + JSON.stringify(res))
      }
    })
  },


  // 1111111111111111授权新增
  getUserInfo: function (e) {
    this.setData({
      authorization: false,
    })
    var that = this
    if (e.detail.detail.errMsg == "getUserInfo:ok") {
      //用户授权允许
      app.getUserInfoApi(e.detail.detail).then(res => {
        // debugger
        if (res.data.status == 0) {
          // 用户允许授权，然后弹出获取手机号的弹框
          that.setData({
            loginShow: true
          })
        }
      })
    } else if (e.detail.detail.errMsg == "getUserInfo:fail auth deny") {
      app.openSystemSetting().then(res => {
        app.getUserInfoApi(res).then(result => {
          if (result.data.status == 0) {
            // 用户允许授权，然后弹出获取手机号的弹框
            that.setData({
              loginShow: true
            })
          }
        })
      })
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
      app.getPhoneNumberApi(e).then(res => {
        if (res.data.status == 0) {
          // 如果被邀请人获取手机号成功，让发起邀请人获取10块钱奖学金
          console.log('111111111111------>')
          that.setData({
            loginShow: false
          })
          that.receiveMoney()
        }
      })
    }
    else{
      console.log('拒绝获取手机号')
      that.setData({
        loginShow: true
      })
    }
  },
  phoneVerity: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  hiddenLogin: function () {
    this.setData({
      loginShow: false
    })
  },

})