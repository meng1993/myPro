//倒计时
const app = getApp()

Page({
    qushibo: function () {
        wx.navigateTo({
            url: '../liveRoomPush/liveRoomPush',
        })
    },
    guankan: function () {
        wx.navigateTo({
            url: '../liveRoomPlay/liveRoomPlay',
        })
    },
    data: {
        iconItems: [
            { name: '限免公开', src: '../../images/1.png' },
            { name: '专项能力', src: '../../images/2.png' },
            { name: '系列进阶', src: '../../images/4.png' },
            { name: '企业内训', src: '../../images/3.png' }
        ],
        swiperIndex: 0,
        playImg: '',
        liveData: {}, //直播数据
        courseCellList: 'loading', //推荐课程列表
        Index: true, //是否是首页（为了区分首页courseCell模板的css）
        playStatus: 2, //播放状态
        bannerList: [], //轮播图
        countDownArr: [], //倒计时数组
        loginShow: false, //是否显示登录弹框
        authorization: false, //是否显示获取用户信息 弹框
        move: false
    },
    intervalChange: function (e) {
        this.setData({
            swiperIndex: e.detail.current
        })
    },
    //事件处理函数
    onLoad: function () {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        wx.getStorage({
            key: 'token',
            success: function (res) {
                app.globalData.token = res.data
            }
        })
        //判断是否授权和登陆
        app.getLogin().then(function (res) {
            wx.setStorage({
                key: 'token',
                data: res.data.data.token
            })
            app.globalData.token = res.data.data.token
            console.log(app.globalData.token)
            if (res.data.data.needAuthorization == true) {
                wx.hideLoading()
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
                
                that.getIndexData()
                if (res.data.data.needLogin == true) {
                    that.setData({
                        loginShow: true
                    })
                }
            }
        })
    },
    //首页轮播图点击
    clickBanner: function (e) {
        wx.navigateTo({
            url: e.target.dataset.ishomeurl == 1 ? '../courseDetails/courseDetails?courseId=' + e.target.dataset.adclickurl : '../webView/webView?url=' + e.target.dataset.adclickurl,
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
                    that.getIndexData()
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
                    that.getIndexData()
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
        that.hiddenLogin()
        if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
            app.getPhoneNumberApi(e).then(res=>{
            })
        } else {
            wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 1000
            })
        }
    },
    getIndexData: function () {
        this.getBannerData()
        // this.getLiveData()
        this.getRecommend()
    },
    phoneVerity: function () {
        wx.navigateTo({
            url: '../login/login',
        })
    },
    hiddenLogin: function (e) {
        this.setData({
            loginShow: false,
            authorization: false
        })
    },
    //获取首页轮播图
    getBannerData: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'banner/list',
            method: 'post',
            header: {
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        bannerList: res.data.data
                    })
                }
            }
        })
    },
    //获取首页直播数据
    getLiveData: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'course/getLiveCourseInfo',
            method: 'post',
            header: {
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        liveData: res.data.data,
                    })
                    setInterval(function () {
                        that.setData({
                            countDownArr: app.globalData.utils.countDown(res.data.data.liveStartTime)
                        })
                    }, 1000)
                }
            }
        })
    },
    //获取首页推荐列表
    getRecommend: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'course/getHomeRecommend',
            method: 'post',
            header: {
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    wx.hideLoading()
                    for(var value of res.data.data){
                        value.duration = Math.round(value.duration / 60)
                    }
                    that.setData({
                        courseCellList: res.data.data
                    })
                }
            }
        })
    },
    //跳转到课程类型页面
    toTapIcon: function (e) {
        wx.navigateTo({
            url: e.currentTarget.id == 3 ? '../offlineCourse/offlineCourse?id=' + e.currentTarget.id : '../allCourse/allCourse?id=' + e.currentTarget.id
        })
    },
    //跳转到直播课程
    toLiveCourses: function () {
        wx.navigateTo({
            url: '../liveCourses/liveCourses?courseId=' + this.data.liveData.courseId + '&isStart=' + this.data.liveData.isStart
        })
    },
    //跳转到课程详情页面
    toCourseDetails: function (e) {
        wx.navigateTo({
            url: '../courseDetails/courseDetails?courseId=' + this.data.courseCellList[e.currentTarget.id].courseId,
        })
    },
    //播放的 悬浮按钮
    toplay: function () {
        wx.navigateTo({
            url: '../play/play?courseId=' + app.globalData.playCourseId + '&currentIndex=' + app.globalData.currentPlayIndex + '&isBuy=' + app.globalData.playIsBuy + '&coverImg=' + app.globalData.playCoverImg + '&isIndexPlay=1' + '&courseTitle=' + app.globalData.playCourseTitle,
        })
    },
    onShow: function () {
        // this.setData({
        //     playImg: app.globalData.playCoverImg
        // })
        var that = this
        wx.getBackgroundAudioPlayerState({
            success: function (res) {
                that.setData({
                    playStatus: res.status,
                    playImg: app.globalData.playCoverImg
                    // playImg: res.status == 1 ? app.globalData.playCoverImg + '?x-oss-process=image/resize,m_fill,h_100,w_100' : ''
                })
                app.globalData.playStatus = res.status
                if (res.status == 2) {
                    app.globalData.currentPlayIndex = -1
                }
            },
            fail: function (res) {
            },
            complete: function () {
            }
        })
    },
})
