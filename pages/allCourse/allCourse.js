const app = getApp()
Page({

    data: {
        list: ['全部课程', '限免公开', '专项能力', '系列进阶'],
        courseCellList: 'loading',
        activeIndex: 0,
        loadMore: false,
        currentArray: [],
        currentPage: 1,
        hasNextPage: false,
        noMore: 100,
        refresh: false  //是否刷新
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })

        this.setData({
            activeIndex: Number(options.id) + 1
        })
        this.getList(Number(options.id) + 1, 1)
    },
    getList: function (type, pageNum) {
        var that = this
        wx.request({
            url: app.globalData.url + 'course/getCourseList',
            data: {
                type: type,
                pageNum: pageNum,
                pageSize: 10
            },
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    wx.hideLoading()
                    for (var v of res.data.data.list) {
                        v.duration = Math.ceil(v.duration / 60)
                    }
                    that.data.currentArray.push(...res.data.data.list)
                    that.setData({
                        courseCellList: that.data.currentArray,
                        loadMore: false,
                        hasNextPage: res.data.data.hasNextPage,
                        refresh: false
                    })
                    
                    // wx.hideNavigationBarLoading()
                }
            }
        })
    },
    chooseCourse: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id,
            currentPage: 1,
            currentArray: [],
            noMore: false,
        })
        this.getList(Number(e.currentTarget.id), 1)
    },
    toCourseDetails: function (e) {
        wx.navigateTo({
            url: '../courseDetails/courseDetails?courseId=' + this.data.courseCellList[e.currentTarget.id].courseId,
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        // wx.showNavigationBarLoading()
        wx.stopPullDownRefresh()
        this.setData({
            refresh: true,
            currentArray: []
        })
        this.getList(this.data.activeIndex, 1)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.hasNextPage == false) {
            this.setData({
                noMore: true,
                loadMore: false
            })
        } else {
            this.setData({
                currentPage: this.data.currentPage + 1,
                loadMore: true,
                noMore: false,
            })
            this.getList(this.data.activeIndex, this.data.currentPage)
        }

    },
    onShow: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})