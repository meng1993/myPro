const countDown = require('../../utils/util.js')
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isSignUp: false, // 是否预约报名
        liveStart: false, //直播是否开始
        liveData: '',
        countDownArr: [],
        loginShow: false,
        authorization: false,
        courseId: '',
        isClickSignUp: false //是否点击过预约报名
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        this.setData({
            liveStart: options.isStart,
            courseId: options.courseId
        })
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
                that.setData({
                    authorization: true,
                })
            } else {
                //如果授权过 则请求数据
                that.getLiveCourseData(options.courseId)
            }
        })
    },
    //获取用户信息
    getUserInfo: function (e) {
        this.setData({
            authorization: false,
        })
        var that = this
        if (e.detail.detail.errMsg == "getUserInfo:ok") {
            //用户授权允许
            app.getUserInfoApi(e.detail.detail).then(res => {
                if (res.data.status == 0) {
                    that.getLiveCourseData(that.data.courseId)
                }
            })
        } else if (e.detail.detail.errMsg == "getUserInfo:fail auth deny") {
            app.openSystemSetting().then(res => {
                app.getUserInfoApi(res).then(result => {
                    if (result.data.status == 0) {
                        that.getLiveCourseData(that.data.courseId)
                    }
                })
            })
        }
    },
    //获取电话号码
    getPhoneNumber: function (e) {
        // debugger
        var that = this;
        if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
            app.getPhoneNumberApi(e).then(res => {
                that.hiddenLogin()
                if (res.data.status == 0) {
                    if (that.data.isClickSignUp == true) {
                        that.signUpToNav()
                    }
                }
            })
        }else{
            that.hiddenLogin()
            wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 1000
            })
        }
    },
    getLiveCourseData: function (courseId) {
        var that = this
        wx.request({
            url: app.globalData.url + 'course/getLiveCourseDetail',
            data: {
                courseId: courseId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {
                    wx.hideLoading()
                    that.setData({
                        liveData: res.data.data
                    })
                    setInterval(function () {
                        that.setData({
                            countDownArr: countDown.countDown(res.data.data.liveStartTime)
                        })
                    }, 1000)
                    require('../../wxParse/wxParse.js').wxParse('article', 'html', res.data.data.courseDesc, that, 5);
                }
            }
        })
    },
    signUp: function () {
        var that = this
        that.setData({
            isClickSignUp: true
        })
        // type判断活动类型 1=没有活动  2=组团 3=秒杀
        app.checkLogin().then(res => {
            if (res == false) {
                that.setData({
                    loginShow: true
                })
            } else {
                that.signUpToNav()
            }
        })
    },
    signUpToNav: function () {
        var liveData = this.data.liveData
        liveData.bigCover = encodeURIComponent(liveData.bigCover)
        liveData.fileUrl = encodeURIComponent(liveData.fileUrl)
        // liveData.smallCover = encodeURIComponent(liveData.smallCover)
        wx.navigateTo({
            url: '../paymentDetail/paymentDetail?type=' + 1 + '&live=' + 1 + '&activityId=' + 1 + '&price=' + this.data.liveData.sellPrice + '&data=' + JSON.stringify(liveData),
        })
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
    enterLive: function () {
        wx.navigateTo({
            url: '../liveRoomPlay/liveRoomPlay'
        })
    },
    live: function () {
        wx.navigateTo({
            url: '../liveRoomPush/liveRoomPush'
        })
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var that = this
        return {
            title: '直播课程',
            path: '/pages/liveCourses/liveCourses?courseId=' + that.data.courseId
        }
    }
})
