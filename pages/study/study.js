
//获取应用实例 
const app = getApp()
var util = require('../../utils/util.js');
Page({
  onLaunch: function () {
    // debugger
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  data: {
    studyList: [],
    authorization: false,
    loginShow: false
  },

  //事件处理函数
  onShow: function () {
      //判断是否授权和登陆
      var that = this
      app.getLogin().then(function (res) {
          wx.setStorage({
              key: 'token',
              data: res.data.data.token
          })
          app.globalData.token = res.data.data.token
          console.log(app.globalData.token)
          if (res.data.data.needAuthorization == true) {
              that.setData({
                  authorization: true,
              })
              // wx.showModal({
              //     title: '获取授权提示',
              //     content: '微信登录需获取您的用户信息，请前往设置',
              //     showCancel: false,
              //     confirmText:'去设置',
              //     confirmColor: '#ee7f00'
              // })
          } else {
              that.getRecentStudyList()
              if (res.data.data.needLogin == true) {
                  that.setData({
                      loginShow: true
                  })
              }
          }
      })
   
  },
  hiddenLogin: function (e) {
      this.setData({
          loginShow: false,
          authorization: false
      })
  },
  //获取用户基本信息
  getUserInfo: function (e) {
      this.setData({
          authorization: false,
      })
      var that = this
      if (e.detail.detail.errMsg == "getUserInfo:ok") {
          //用户授权允许
          app.getUserInfoApi(e.detail.detail).then(res => {
              if (res.data.status == 0) {
                  that.getRecentStudyList()
                  that.setData({
                      loginShow: true
                  })
              }
          })
      } else if (e.detail.detail.errMsg == "getUserInfo:fail auth deny") {
          that.openSystemSet()
      }
  },
  openSystemSet: function () {
      var that = this
      app.openSystemSetting().then(res => {
          app.getUserInfoApi(res).then(result => {
              if (result.data.status == 0) {
                  that.getRecentStudyList()
                  that.setData({
                      loginShow: true
                  })
              }
          })
      }).catch(res => {
          wx.showModal({
              title: '用户未授权',
              content: '如需正常使用小程序的功能，请点击确定并在授权管理中选中“用户信息”，然后再重新进入小程序即可正常使用。',
              showCancel: false,
              success: function () {
                  that.noAuthToast()
              }
          })
      })
  },
  noAuthToast: function () {
      this.openSystemSet()
  },
  getPhoneNumber: function (e) {
      var that = this;
      if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
          app.getPhoneNumberApi(e).then(res => {
              that.hiddenLogin()
          })
      } else {
          that.hiddenLogin()
          wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 1000
          })
      }
  },
  phoneVerity: function () {
      wx.navigateTo({
          url: '../login/login',
      })
  },
  hasBuy: function () {
    wx.navigateTo({
      url: '../hasBuyCourse/hasBuyCourse',
    })
  },
  offline: function () {
    wx.navigateTo({
      url: '../offlineVoice/offlineVoice',
    })
  },
  punchClock: function (e) {
    let courseId = e.currentTarget.dataset.courseid
    let todayIsClock = e.currentTarget.dataset.todayisclock
    console.log(e)
    wx.navigateTo({
      url: '../../pages/punchClock/punchClock?courseId=' + courseId + '&todayIsClock=' + todayIsClock
    })
  },
  toTest: function(e) {
    let courseId = e.currentTarget.dataset.courseid
    console.log(e.currentTarget.dataset.courseid)
    wx.navigateTo({
      url: '../../pages/test/test?courseId='+courseId
    })
  },
  getRecentStudyList: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'courseStudy/getRecentStudy',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(JSON.stringify(res))
        console.log(res)
        // copy开始
        let listMessage = res.data.data
        let timeArr = []; // 毫秒数组
        var dataTimeArr = []; // 正确日期格式数组
        for (var i = 0; i < listMessage.length; i++) {
          timeArr.push(listMessage[i].lastStudyTime)
        }
        for (var i = 0; i < timeArr.length; i++) {
          dataTimeArr.push(util.dateTimeOne(timeArr[i]))
        }
        // 把time属性添加到listMessage对象数组中
        for (var i = 0; i < listMessage.length; i++) {
          listMessage[i]['time'] = dataTimeArr[i]
        }
        // copy结束
        that.setData({
          // studyList: res.data.data
          studyList: listMessage
        })
      }
    })
  },
  toCourseDetails: function(e){
    let courseId = e.currentTarget.dataset.courseid
    console.log(courseId)
    wx.navigateTo({
      url: '../../pages/courseDetails/courseDetails?courseId=' + courseId,
    })
  },
  toCollect: function(e){
    console.log(e)
    let courseId = e.currentTarget.dataset.courseid
    // wx.navigateTo({
      // url: '../../pages/courseDetails/courseDetails?courseId=' + courseId,
    // })
  }

})
