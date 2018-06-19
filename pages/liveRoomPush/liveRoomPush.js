// pages/liveRoomPush/liveRoomPush.js
import MD5 from '../../vendors/md5.js'
const SDK = require('../../vendors/NIM_Web_SDK_v5.1.0.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pushing: false,
    livePusherContext: {},
    url: 'rtmp://pa4df635e.live.126.net/live/3097650238884b18ab36a173a5b8b053?wsSecret=d9b10721b6119661d12eb4d3b791ea16&wsTime=1527745695', // 目前仅支持 flv, rtmp 格式
    enableCamera: true, // 摄像头开关
    beauty: 1,
    whiteness: 1,
    mode: 'RTC', //清晰度 SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
    orientation: 'vertical', // 竖屏	vertical，horizontal
    muted: false,  
    hlsUrl:'',
    rtmpUrl:'',
    isPause: false, //是否暫停
    isFullScreen: false // 是否全屏
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getPushUrl();
      this.getUserLimits()
      this.createContext();
      wx.setKeepScreenOn({
          keepScreenOn: true,
      });
      
      var chatroom = SDK.Chatroom.getInstance({
        // 初始化SDk
        appKey: '5cf66e533d5f8d5babbb7f9e1fa0ee3e',
        token: '1bb2b3d271ce8926531390d6f621405e',
        account: '13064702163hujia',
        chatroomId: '25208875',
        chatroomAddresses: [
          "weblink04.netease.im:443"
        ],
        onconnect: onChatroomConnect,
      })
      
      function onChatroomConnect(obj) {
        console.log('进入聊天室', obj);
        var msg = chatroom.sendText({
          text: '你在说什么呢',
          custom: '{}',
          done: function (error, msg) {
            console.log('发送聊天室' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient, error, msg);
          }
        });
        console.log('正在发送聊天室text消息, id=' + msg.idClient);

        // 聊天室历史消息开始
        chatroom.getHistoryMsgs({
          timetag: new Date().getTime(),
          limit: 30,
          msgTypes: ['text', 'image'],
          done: getHistoryMsgsDone
        })
        function getHistoryMsgsDone(error, obj) {
          console.log('获取聊天室历史' + (!error ? '成功' : '失败'), error, obj);
          console.log(obj)
        }
        // 聊天室历史消息结束

        //聊天室成员列表开始
        chatroom.getChatroomMembers({
          guest: false,
          limit: 100,
          done: getChatroomMembersDone
        });
        function getChatroomMembersDone(error, obj) {
          console.log('获取聊天室成员' + (!error ? '成功' : '失败'), error, obj.members);
          console.log(obj)
        }
        //聊天室成员列表结束
      }
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (that.data.pushing == true) {
      that.data.livePusherContext.stop()
      setTimeout(function () {
        that.data.livePusherContext.start()
      }, 100)
    }
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

  },
  createContext: function () {
    this.setData({
      livePusherContext: wx.createLivePusherContext('videoPush')
    })
  },
  getPushUrl: function () {
    var that = this
    wx.showLoading({ title: '请求中', mask: true })
    wx.request({
      method: 'POST',
      url: 'https://app.netease.im/appdemo/weApp/popLive',
      success: function (res) {
        wx.hideLoading()
        if (res.data && res.data.code === 200) {
          that.setData({
            url: res.data.data.pushUrl,
            hlsUrl: res.data.data.hlsPullUrl,
            rtmpUrl: res.data.data.rtmpPullUrl,
          })
          wx.showToast({
            title: '获取地址成功'
          })
        } else {
          wx.showToast({
            image: '/res/img/err_icon.png',
            title: '无可用的地址'
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '获取地址失败'
        })
      }
    })
  },
  // 获取用户授权
  getUserLimits: function () {
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success: function () { },
            fail: function () {
              wx.showToast({
                image: '/res/img/err_icon.png',
                title: '相机授权失败'
              })
            }
          })
        }
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: function () { },
            fail: function () {
              wx.showToast({
                image: '/res/img/err_icon.png',
                title: '录音授权失败'
              })
            }
          })
        }
      },
      fail: function () {
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '授权失败'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.stop()
    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },
  checkUrl: function (str) {
    if (/^(rtmp|RTMP):\/\/[\w\/\.=?&_=-]+$/.test(str)) {
      return true
    }
    wx.showToast({
      image: '/res/img/err_icon.png',
      title: '地址不可用'
    })
    return false
  },
  // 播放推流
  play: function () {
      if (!this.checkUrl(this.data.url)) {
          return
      } else  if (this.data.isPause == true){
          this.resume()
          console.log('resume......................')
          return
      }
      console.log('play......................')
    
    var that = this
    this.data.livePusherContext.start({
      success: function (res) {
        // debugger
        that.setData({
          pushing: true
        })
      },
      fail: function (res) {
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '推流失败'
        })
      }
    })
  },
  stop: function () {
      console.log('stop......................')
    var that = this
    that.setData({
      pushing: false,
      url: '',
      isServerAutoUrl: false,
      enableCamera: true
    })
    that.data.livePusherContext.stop()
  },
  // 暂停推流
  pause: function () {
      this.setData({
          isPause: true
      })
      console.log('pause......................')
    var that = this
    this.data.livePusherContext.pause({
      success: function (res) {
        that.setData({
          pushing: false
        })
      },
      fail: function (res) {
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '操作失败'
        })
      }
    })
  },
  // 恢复推流
  resume: function () {
      console.log('resume......................')
    var that = this
    this.data.livePusherContext.resume({
      success: function (res) {
        that.setData({
          pushing: true
        })
      },
      fail: function (res) {
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '操作失败'
        })
      }
    })
  },
  fullScreen: function(){
    this.setData({
        isFullScreen: !this.data.isFullScreen
    })
  },
  statechange: function (e) {
    if ([-1307, -1308, -1309, -1310, 3001, 3002, 3003, 3004, 3005].indexOf(+e.detail.code) !== -1) {
      this.stop()
      setTimeout(function () {
        wx.showToast({
          image: '/res/img/err_icon.png',
          title: '推流失败' + e.detail.code
        })
      }, 500)
    }
  },
  error: function (e) {
    console.log('live-pusher errMsg:', e.detail.errMsg, ', errCode:', e.errCode)
    this.stop()
    setTimeout(function () {
      wx.showToast({
        image: '/res/img/err_icon.png',
        title: '推流失败'
      })
    }, 800)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onHide: function(){
      this.stop()
  } 
})