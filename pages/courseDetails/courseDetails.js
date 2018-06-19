var formatSecond = require('../../utils/util.js')
const countDown = require('../../utils/util.js')
const app = getApp();
var sliderWidth = 16; // 需要设置slider的宽度，用于计算中间位置(px)

Page({
    data: {
        activeIndex: 0,
        courseDetailData: '',
        courseDirectoryCellList: '',
        countDownArr: '',
        courseId: '',
        isBuy: 0, // 判断用户是否已经购买课程
        loginShow: false, // 是否弹出登陆框
        authorization: false, //是否弹出授权框
        isClickBuy: false, //是否点击购买按钮
        isClickPlay: false, //是否点击去播放
        eventPlay: '', //点击课时时候的event
        shareId: '',    //分销id
        mainTitle: '',   // 课程主标题，传到邀请界面的
        shareMe: '',
        flag: 0
    },

    onLoad: function (options) {
        console.log(options)
        wx.showLoading({
            title: '加载中',
        })
        console.log(options.shareMe)
        var that = this
        that.setData({
            courseId: options.courseId || 2,
            shareId: options.shareId == undefined ? 0 : options.shareId,
            shareMe: options.shareMe == undefined ? 'false' : options.shareMe
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
                that.getcourseDetailData(options.courseId).then(isBuy => {
                    that.getcourseDirectoryList(options.courseId, isBuy)
                })

            }
        })
    },
    deblockCate(courseId) {
        var that = this;
        return new Promise(function (resolve, reject) {
            wx.request({
                url: app.globalData.url + 'courseStudy/updateLastStudyStatus',
                data: {
                    courseId: courseId,
                    cateId: that.data.courseDirectoryCellList[that.data.flag].cateId,
                    isFinish: 0
                },
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: app.globalData.token
                },
                success: function (res) {
                    if (res.data.status == 0) {
                        resolve()
                    }
                }
            })
        })
    },
    toIndex: function () {
        wx.reLaunch({
            url: "/pages/index/index",
        })
    },
    listenFree: function () {
        this.setData({
            activeIndex: 1
        })
    },
    getcourseDetailData: function (courseId) {
        var that = this;
        return new Promise((resolve, reject) => {
            wx.request({
                url: app.globalData.url + 'course/getCourseDetail',
                data: {
                    courseId: courseId
                },
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: app.globalData.token
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.status == 0) {
                        resolve(res.data.data.isBuy)
                        wx.hideLoading()
                        res.data.data.duration = Math.round(res.data.data.duration / 60)
                        that.setData({
                            courseDetailData: res.data.data,
                            isBuy: res.data.data.isBuy,
                        })
                        require('../../wxParse/wxParse.js').wxParse('article', 'html', res.data.data.courseDesc, that, 5);
                        setInterval(function () {
                            that.setData({
                                countDownArr: countDown.countDown(res.data.data.seckillEndTime)
                            })
                        }, 1000)
                    }
                }
            })
        })
    },
    getcourseDirectoryList: function (courseId, isBuy) {
        var that = this;
        wx.request({
            url: app.globalData.url + 'courseCatelog/getClassDirectoryList',
            data: {
                courseId: courseId,
            },
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    for (var value in res.data.data){
                        if (res.data.data(value).isFree==1){
                            this.setData({
                                flag: Number(this.data.flag +1) 
                            })
                        }else{
                            res.data.data(this.data.flag).isLastStudy = 1
                            that.deblockCate(that.data.courseId)
                        }
                    }
                    if (res.data.data != '' && res.data.data[0].isFree == 0 && isBuy == 1) {
                        res.data.data[0].isLastStudy = 1
                        that.deblockCate(that.data.courseId)
                    }
                    for (var v of res.data.data) {
                        v.duration = formatSecond.formatSeconds(v.duration)
                        v.audioPlaying = false
                    }
                    if (app.globalData.playCourseId == courseId) {
                        for (var value in res.data.data) {
                            if (value == app.globalData.currentPlayIndex) {
                                res.data.data[value].audioPlaying = true
                            }
                        }
                    }
                    that.setData({
                        courseDirectoryCellList: res.data.data
                    })
                    console.log(that.data.courseDirectoryCellList)
                }
            }
        })
    },
    toGroupDetail: function () {
        wx.navigateTo({
            url: '../courseGroup/courseGroup?groupId=' + this.data.courseDetailData.joinGroupId,
        })
    },
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id
        });
    },
    toplay: function (e) {
        var that = this
        this.setData({
            isClickPlay: true
        })
        app.checkLogin().then(res => {
            if (res == false) {
                that.setData({
                    loginShow: true,
                    eventPlay: e
                })
            } else {
                if (e.currentTarget.dataset.free == 1) {
                    that.canPlay(e)
                } else if (e.currentTarget.dataset.islaststudy == 1 && that.data.isBuy == 1) {
                    that.canPlay(e)
                } else if (e.currentTarget.dataset.islaststudy == 0 && that.data.isBuy == 1) {
                    wx.showToast({
                        title: '当前课时未解锁',
                        icon: 'none'
                    })
                } else if (e.currentTarget.dataset.free == 0 && that.data.isBuy == 0) {
                    wx.showToast({
                        title: '当前课程未购买',
                        icon: 'none'
                    })
                }
            }
        })
    },
    canPlay: function (e) {
        app.globalData.currentPlayIndex = e.currentTarget.id
        for (var value in this.data.courseDirectoryCellList) {
            var audioPlaying = "courseDirectoryCellList[" + value + "].audioPlaying";
            if (value == e.currentTarget.id) {
                this.setData({
                    [audioPlaying]: true
                })
            } else {
                this.setData({
                    [audioPlaying]: false
                })
            }
        }
        // app.globalData.playStatus = 1
        wx.navigateTo({
            url: '../play/play?courseId=' + this.data.courseId + '&currentIndex=' + e.currentTarget.id + '&isBuy=' + this.data.isBuy + '&coverImg=' + this.data.courseDetailData.bigCover + '&isIndexPlay=0' + '&courseTitle=' + this.data.courseDetailData.mainTitle,
        })
    },
    //课程购买
    courseBuy: function (e) {
        var that = this
        that.setData({
            isClickBuy: true
        })
        app.checkLogin().then(res => {
            if (res == false) {
                that.setData({
                    loginShow: true
                })
            } else {
                that.goBuy(e)
            }
        })
    },
    goBuy: function (e) {
        // type判断活动类型 1=没有活动  2=组团 3=秒杀
        var myType = 100
        var activityId = 100
        var price = 0
        if (e.currentTarget.id == 2) {
            myType = 2
            activityId = this.data.courseDetailData.groupId
            price = this.data.courseDetailData.groupPrice
        } else if (this.data.courseDetailData.isSeckill) {
            myType = 3
            activityId = this.data.courseDetailData.seckillId
            price = this.data.courseDetailData.seckillPrice
        } else {
            myType = 1
            activityId = 0
            price = this.data.courseDetailData.sellPrice
        }
        var courseDetailData = JSON.parse(JSON.stringify(this.data.courseDetailData))
        courseDetailData.bigCover = encodeURIComponent(courseDetailData.bigCover)
        courseDetailData.smallCover = encodeURIComponent(courseDetailData.smallCover)
        courseDetailData.courseDesc = ''
        console.log('11111111--------->' + this.data.shareId)
        wx.navigateTo({
            url: '../paymentDetail/paymentDetail?type=' + myType + '&live=' + 0 + '&activityId=' + activityId + '&price=' + price + '&data=' + JSON.stringify(courseDetailData) + '&shareId=' + this.data.shareId
        })
    },
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
                    that.getcourseDetailData(that.data.courseId).then(isBuy => {
                        that.getcourseDirectoryList(that.data.courseId, isBuy)
                    })
                }
            })
        } else if (e.detail.detail.errMsg == "getUserInfo:fail auth deny") {
            app.openSystemSetting().then(res => {
                app.getUserInfoApi(res).then(result => {
                    if (result.data.status == 0) {
                        that.getcourseDetailData(that.data.courseId).then(isBuy => {
                            that.getcourseDirectoryList(that.data.courseId, isBuy)
                        })
                    }
                })
            })
        }
    },
    getPhoneNumber: function (e) {
        var that = this;
        that.hiddenLogin()
        if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
            app.getPhoneNumberApi(e).then(res => {
                if (res.data.status == 0) {
                    if (that.data.isClickBuy == true) {
                        that.goBuy()
                    }
                    if (that.data.isClickPlay == true) {
                        if (e.currentTarget.dataset.free == 1) {
                            that.canPlay(that.data.eventPlay)
                        } else if (e.currentTarget.dataset.islaststudy == 1 && that.data.isBuy == 1) {
                            that.canPlay(that.data.eventPlay)
                        }
                    }
                }
            })
        } else {
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
    hiddenLogin: function () {
        this.setData({
            loginShow: false
        })
    },
    onReady: function () {

    },
    onShow: function () {
        var that = this
        that.getcourseDetailData(that.data.courseId).then(isBuy => {
            that.getcourseDirectoryList(that.data.courseId, isBuy)
        })
    },
    toShare: function (e) {
        let courseId = e.currentTarget.dataset.courseid
        wx.navigateTo({
            url: '../../pages/inviteCard/inviteCard?courseId=' + courseId + '&mainTitle=' + this.data.courseDetailData.mainTitle,
        })
    },
    onShareAppMessage: function (res) {
        var that = this
        return {
            title: that.data.courseDetailData.mainTitle,
            path: '/pages/courseDetails/courseDetails?courseId=' + that.data.courseId + '&shareMe=true'
        }
    },
})