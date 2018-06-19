// pages/liveRoomPlay/liveRoomPlay.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pulling: false,
        livePlayerContext: {},
        src: 'rtmp://va4df635e.live.126.net/live/3097650238884b18ab36a173a5b8b053', //	音视频地址。目前仅支持 flv, rtmp 格式
        mode: 'live', // live（直播），RTC（实时通话）
        autoplay: false,
        muted: false,
        orientation: 'vertical', // 画面方向，可选值有 vertical，horizontal
        objectFit: 'fillCrop', // 填充模式，可选值有 contain，fillCrop
        isFull: false  //是否是全屏
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.createContext();
        wx.setKeepScreenOn({
            keepScreenOn: true,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.setKeepScreenOn({
            keepScreenOn: true
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
    createContext: function () {
        this.setData({
            livePlayerContext: wx.createLivePlayerContext('livePlayer')
        })
    },
    checkUrl: function (str) {
        if (/^(rtmp|RTMP):\/\/[\w\/\.?&_=-]+$/.test(str) || /^(http|HTTP|https|HTTPS):\/\/[\w\/\.&_=-]+\.flv[\w\/\.=?&_-]*$/.test(str)) {
            return true
        }
        wx.showToast({
            image: '/res/img/err_icon.png',
            title: '不可用的地址'
        })
        return false
    },
    play: function () {
        if (!this.checkUrl(this.data.src)) {
            return
        }
        var that = this
        this.data.livePlayerContext.play({
            success: function (res) {
                that.setData({
                    pulling: true
                })
            },
            fail: function (res) {
                wx.showToast({
                    image: '/res/img/err_icon.png',
                    title: '播放失败'
                })
            }
        })
        that.setData({
            pulling: true
        })
    },
    stop: function () {
        var that = this
        this.data.livePlayerContext.stop({
            success: function (res) {
                that.setData({
                    pulling: false
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
    pause: function () {
        var that = this
        this.data.livePlayerContext.pause({
            success: function (res) {
                that.setData({
                    pulling: false
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
    resume: function () {
        var that = this
        this.data.livePlayerContext.resume({
            success: function (res) {
                that.setData({
                    pulling: true
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
    statechange(e) {
        if ([2006, 3005].indexOf(+e.detail.code) !== -1) {
            this.stop()
            setTimeout(function () {
                wx.showToast({
                    image: '/res/img/err_icon.png',
                    title: '主播停止推流' + e.detail.code
                })
            }, 800)
        }
        if ([-2301, 3001, 3002, 3003].indexOf(+e.detail.code) !== -1) {
            this.stop()
            setTimeout(function () {
                wx.showToast({
                    image: '/res/img/err_icon.png',
                    title: '播放失败' + e.detail.code
                })
            }, 800)
        }
    },
    fullscreen(e) {

        // this.setData({
        //     orientation: this.data.isFull == true ? 'horizontal' : 'vertical',
        // })
        var that = this
        if(that.data.isFull == false){
            that.data.livePlayerContext.requestFullScreen({
                success: function (res) {
                    // that.setData({
                    //     orientation: 'horizontal'
                    // })
                    that.setData({
                        isFull: !that.data.isFull
                    })
                },
                fail: function (res) {
                  
                }
            })
        }else{
            that.data.livePlayerContext.exitFullScreen({
                success: function (res) {
                    that.setData({
                        isFull: !that.data.isFull
                    })
                },
                fail: function (res) {

                }
            })
            
        }
       
        console.log('fullscreenchange: ', e.detail)
    },
    netstatus(e) {
        console.log('live-player info:', e.detail.info)
    },
    error(e) {
        console.error('live-player error:', e.detail.errMsg)
        wx.showToast({
            image: '/res/img/err_icon.png',
            title: '播放失败'
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})