var formatSecond = require('../../utils/util.js')
const bgAudio = wx.getBackgroundAudioManager()
const app = getApp()
// pages/play/play.js
Page({
    data: {
        courseDirectoryCellList: [],
        playData: '',
        playStatus: false, //播放状态，默认未播放
        currentTime: '00:00', //当前播放时长
        // duration: '', //音频总时长
        sliderValue: '0', //当前 slider的value
        sliderMax: '', //sliderd的总长度
        showList: false,  //是否显示 播放列表
        currentIndex: '', // 当前播放的index（）
        notLeft: false,   //是否可以 切换上一首
        notRight: false, //是否可以 切换下一首
        isBuy: 0, //用户是否购买课程
        courseId: '',
        coverImg: '',
    },
    onLoad: function (options) {
        // wx.showLoading({
        //     title: '加载中',
        // })
        var that = this
        this.getcourseDirectoryList(options.courseId).then(function (res) {
            that.setData({
                isBuy: options.isBuy,
                currentIndex: options.currentIndex,
                playData: that.data.courseDirectoryCellList[options.currentIndex],
                courseId: options.courseId,
                coverImg: options.coverImg,
            })

            app.globalData.playCourseId = options.courseId
            app.globalData.playIsBuy = options.isBuy
            app.globalData.playCoverImg = options.coverImg
            app.globalData.playCourseTitle = options.courseTitle
            app.globalData.currentPlayIndex = options.currentIndex
            that.bgAudioOnload(options)
            for (var value in that.data.courseDirectoryCellList) {
                var audioPlaying = "courseDirectoryCellList[" + value + "].audioPlaying";
                if (value == options.currentIndex) {
                    that.setData({
                        [audioPlaying]: true
                    })
                } else {
                    that.setData({
                        [audioPlaying]: false
                    })
                }
            }
        })
    },
    bgAudioOnload: function (options) {
        var that = this
        if (options.isIndexPlay != 0 && app.globalData.playStatus == 0) {
            that.setData({
                playStatus: false,
                sliderValue: parseInt(bgAudio.currentTime),
                currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
            });
            return
        } else if (options.isIndexPlay != 0 && app.globalData.playStatus == 1) {
            that.setData({
                playStatus: true
            })
            bgAudio.onTimeUpdate(() => {
                that.setData({
                    sliderValue: parseInt(bgAudio.currentTime),
                    currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
                })
            })
            return
        }
        // bgAudio.src = "https://oss.dixinyinli.cn/headimg/fe9be40abaef45a899f834c5c5290789.mp3"
        bgAudio.src = that.data.courseDirectoryCellList[Number(options.currentIndex)].cateFileUrl
        bgAudio.title = that.data.courseDirectoryCellList[Number(options.currentIndex)].cateName
        bgAudio.play();
        that.setData({
            playStatus: true
        })
        bgAudio.onPlay(() => {
            that.updateRecenty()
        })
        // setInterval( this.updateTime , 1000);
        bgAudio.onTimeUpdate(() => {
            that.setData({
                sliderValue: parseInt(bgAudio.currentTime),
                currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
            })
        })

        bgAudio.onError((res) => {
            console.log('--------------------------err' + res.errCode)
            console.log('--------------------------err' + res.errMsg)
        })

        bgAudio.onEnded(() => {
            console.log('---------onloadend')
            that.setData({
                playStatus: false
            })
            if (app.globalData.currentPlayIndex != that.data.courseDirectoryCellList.length-1 ){
                if (that.data.courseDirectoryCellList[Number(app.globalData.currentPlayIndex) + 1].isLastStudy == 0) {
                    that.deblockCate(that.data.courseId).then(res => {
                        that.getcourseDirectoryList(that.data.courseId).then(res => {
                        })
                    })
                }
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
                    cateId: Number(that.data.currentIndex) == that.data.courseDirectoryCellList.length - 1 ? that.data.courseDirectoryCellList[Number(that.data.currentIndex)].cateId : that.data.courseDirectoryCellList[Number(that.data.currentIndex) + 1].cateId,
                    isFinish: Number(that.data.currentIndex) == that.data.courseDirectoryCellList.length - 1 ? 1: 0
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
    getcourseDirectoryList: function (courseId) {
        var that = this;
        var p = new Promise(function (resolve, reject) {
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
                        that.setData({
                            sliderMax: res.data.data[app.globalData.currentPlayIndex].duration
                        })
                        resolve(res)
                        for (var v of res.data.data) {
                            v.duration2 = formatSecond.formatSeconds(v.duration)
                            v.audioPlaying = false
                        }
                        that.setData({
                            courseDirectoryCellList: res.data.data
                        })
                    }
                }
            })
        })
        return p
    },
    updateTime: function () {
        bgAudio.onTimeUpdate(() => {
            this.setData({
                sliderValue: parseInt(bgAudio.currentTime),
                currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
            })
        })
    },
    playAudio: function () {
        this.setData({
            playStatus: true
        });
        bgAudio.play()
        bgAudio.onPlay(() => {

        })
        var that = this
        bgAudio.onTimeUpdate(() => {
            that.setData({
                sliderValue: parseInt(bgAudio.currentTime),
                currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
            })
        })
        bgAudio.onEnded(() => {
            console.log('---------onloadend')
            that.setData({
                playStatus: false
            })
            if (app.globalData.currentPlayIndex != that.data.courseDirectoryCellList.length - 1) {
                if (that.data.courseDirectoryCellList[Number(app.globalData.currentPlayIndex) + 1].isLastStudy == 0) {
                    that.deblockCate(that.data.courseId).then(res => {
                        that.getcourseDirectoryList(that.data.courseId).then(res => {
                        })
                    })
                }
            }
        })
     
    },
    pauseAudio: function () {
        this.setData({
            playStatus: false
        });
        bgAudio.pause()
    },
    updateRecenty: function(){
        var that = this
        debugger
        console.log(bgAudio.currentTime)
        return new Promise((resolve, reject)=>{
            wx.request({
                url: app.globalData.url + 'courseStudy/updateRecentStudy',
                data: {
                    courseId: that.data.courseId,
                    cateId: that.data.courseDirectoryCellList[that.data.currentIndex].cateId,
                    studyTime: Number(Math.round(bgAudio.currentTime))
                },
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: app.globalData.token
                },
                success: function (res) {
                    console.log(Number(Math.round(bgAudio.currentTime)))
                    debugger
                   if(res.data.status == 0){
                       debugger
                        resolve(res)
                   }
                }
            })
        })
    },
    timeSliderChanged: function (e) {
        this.setData({
            sliderValue: e.detail.value
        })
        var time = formatSecond.formatSeconds(e.detail.value)
        this.setData({
            currentTime: time
        });
        bgAudio.seek(e.detail.value)
    },
    toplay: function (e) {
        if (e.currentTarget.dataset.free == 1 || (e.currentTarget.dataset.islaststudy == 1 && this.data.isBuy == 1)) {
            this.canPlay(e)
        } else if (e.currentTarget.dataset.islaststudy == 0 && this.data.isBuy == 1) {
            wx.showToast({
                title: '当前课时未解锁',
                icon: 'none'
            })
        } else if (e.currentTarget.dataset.free == 0 && this.data.isBuy == 0) {
            wx.showToast({
                title: '当前课程未购买',
                icon: 'none'
            })
        }
    },
    canPlay: function (e) {
        app.globalData.currentPlayIndex = Number(e.currentTarget.id)
        this.setData({
            currentIndex: Number(e.currentTarget.id)
        })
        for (var value in this.data.courseDirectoryCellList) {
            var audioPlaying = "courseDirectoryCellList[" + value + "].audioPlaying";
            if (value == e.currentTarget.id) {
                this.setData({
                    [audioPlaying]: true,
                })
            } else {
                this.setData({
                    [audioPlaying]: false
                })
            }
        }
        const pages = getCurrentPages();
        const detailPage = pages[pages.length - 2];
        if (detailPage.getcourseDirectoryList != undefined && detailPage.getcourseDirectoryList != 'undefined') {
            detailPage.getcourseDirectoryList(this.data.courseId)
        }
        this.setData({
            playData: this.data.courseDirectoryCellList[e.currentTarget.id],
            playStatus: true,
            sliderMax: this.data.courseDirectoryCellList[e.currentTarget.id].duration
        })
        bgAudio.src = this.data.courseDirectoryCellList[e.currentTarget.id].cateFileUrl
        bgAudio.title = this.data.courseDirectoryCellList[e.currentTarget.id].cateName
        // bgAudio.play();
        // bgAudio.onPlay(() => {
        // })
    },
    playList: function () {
        this.setData({
            showList: true
        })
    },
    hiddenList: function () {
        console.log('hidden...')
        this.setData({
            showList: false
        })
    },

    audioText: function () {
        wx.navigateTo({
            url: '../draft/draft?cateId=' + this.data.courseDirectoryCellList[Number(this.data.currentIndex)].cateId + '&title=' + this.data.courseDirectoryCellList[Number(this.data.currentIndex)].cateName,
        })
    },
    playLeft: function () {
        if (this.data.currentIndex == 0) {
            return
        } else {
            this.setData({
                currentIndex: this.data.currentIndex - 1
            })
            app.globalData.currentPlayIndex = this.data.currentIndex
            for (var value in this.data.courseDirectoryCellList) {
                var audioPlaying = "courseDirectoryCellList[" + value + "].audioPlaying";
                if (value == this.data.currentIndex) {
                    this.setData({
                        [audioPlaying]: true
                    })
                } else {
                    this.setData({
                        [audioPlaying]: false
                    })
                }
            }
            const pages = getCurrentPages();
            const detailPage = pages[pages.length - 2];
            if (detailPage.getcourseDirectoryList != undefined && detailPage.getcourseDirectoryList != 'undefined') {
                detailPage.getcourseDirectoryList(this.data.courseId)
            }
            this.setData({
                playData: this.data.courseDirectoryCellList[this.data.currentIndex],
                playStatus: true,
                sliderMax: this.data.courseDirectoryCellList[this.data.currentIndex].duration,
            })
            bgAudio.src = this.data.courseDirectoryCellList[this.data.currentIndex].cateFileUrl
            bgAudio.title = this.data.courseDirectoryCellList[this.data.currentIndex].cateName
            // bgAudio.play();
        }
    },
    playRight: function () {
        if (Number(this.data.currentIndex) == this.data.courseDirectoryCellList.length - 1) {
            wx.showToast({
                title: '已是最后一课时',
                icon: 'none',
            })
            return
        } else if (this.data.courseDirectoryCellList[Number(this.data.currentIndex) + 1].isFree != 1 && this.data.isBuy == 0) {
            wx.showToast({
                title: '当前课程未购买',
                icon: 'none',
                duration: 1000
            })
            return
        } else if (this.data.courseDirectoryCellList[Number(this.data.currentIndex) + 1].isFree == 1 || (this.data.isBuy == 1 && this.data.courseDirectoryCellList[Number(this.data.currentIndex) + 1].isLastStudy == 1)) {
            this.setData({
                currentIndex: Number(this.data.currentIndex) + 1
            })
            app.globalData.currentPlayIndex = this.data.currentIndex
            for (var value in this.data.courseDirectoryCellList) {
                var audioPlaying = "courseDirectoryCellList[" + value + "].audioPlaying";
                if (value == this.data.currentIndex) {
                    this.setData({
                        [audioPlaying]: true
                    })
                } else {
                    this.setData({
                        [audioPlaying]: false
                    })
                }
            }
            const pages = getCurrentPages();
            const detailPage = pages[pages.length - 2];
            if (detailPage.getcourseDirectoryList != undefined && detailPage.getcourseDirectoryList != 'undefined') {
                detailPage.getcourseDirectoryList(this.data.courseId)
            }
            this.setData({
                playData: this.data.courseDirectoryCellList[this.data.currentIndex],
                sliderMax: this.data.courseDirectoryCellList[this.data.currentIndex].duration
            })
            bgAudio.src = this.data.courseDirectoryCellList[this.data.currentIndex].cateFileUrl
            bgAudio.title = this.data.courseDirectoryCellList[this.data.currentIndex].cateName
            this.setData({
                playStatus: true,
            })
            bgAudio.play();
            bgAudio.onPlay(() => {
                this.updateRecenty()
            })
            var that = this
            bgAudio.onTimeUpdate(() => {
                that.setData({
                    sliderValue: parseInt(bgAudio.currentTime),
                    currentTime: formatSecond.formatSeconds(bgAudio.currentTime)
                })
            })
        } else {
            wx.showToast({
                title: '当前课时未解锁',
                icon: 'none',
            })
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
            title: app.globalData.playCourseTitle,
            path: '/pages/courseDetails/courseDetails?courseId=' + that.data.courseId
        }
    }
})