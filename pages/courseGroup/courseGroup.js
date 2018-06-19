const app = getApp()
var formData = require('../../utils/util.js');
const countDown = require('../../utils/util.js')
Page({
    data: {
        groupData: '', //团数据对象
        memberList: [], //团成员数组
        countDownArr: ['00', '00', '00', '00'], //倒计时数组
        iscommander: 0, //是否是团长
        groupId: '', //拼团Id
        loginShow: false, //是否显示登录弹框
        authorization: false, //是否显示获取用户信息 弹框
        isClickJoin: false, //是否点击过参团按钮
        isClickSellPrice: false, //是否点击过原价购买按钮
        isClickGroupPrice: false //是否点击过再次开团购买按钮
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        that.setData({
            groupId: options.groupId
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
                that.getGroupData(options.groupId)
            }
        })
    },
    //获取团信息
    getGroupData: function (groupId) {
        console.log('-----------------------------------------------------------------')
        var that = this
        wx.request({
            url: app.globalData.url + 'user/getBookingGroupDetail',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {
                groupId: groupId
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {
                    debugger
                    wx.hideLoading()
                    console.log('-----------------' + res.data.data.groupStatus)
                    for (var value of res.data.data.list) {
                        value.joinTime = formData.dateTime(value.joinTime)
                    }
                    that.setData({
                        groupData: res.data.data,
                        memberList: res.data.data.list,
                        groupId: res.data.data.groupId
                    })
                    setInterval(function () {
                        that.setData({
                            countDownArr: countDown.countDown(that.data.groupData.finishedTime)
                        })
                    }, 1000)

                } else {
                }
            }
        })
    },
    //参与拼团
    joinGroup: function () {
        var that = this
        // type判断活动类型 1=没有活动  2=组团 3=秒杀 4=参与拼团
        //检查是否登录过
        that.setData({
            isClickJoin: true
        })
        app.checkLogin().then(res => {
            //如果已经登陆过
            if (res == true) {
                that.joinAndNavToPay()
            } else {
                that.setData({
                    loginShow: true
                })
            }
        })
    },
    //点击参团 跳转到付款页面
    joinAndNavToPay: function () {
        var groupData = JSON.parse(JSON.stringify(this.data.groupData))  
        groupData.smallCover = encodeURIComponent(groupData.smallCover)
        var that = this
        wx.navigateTo({
            url: '../paymentDetail/paymentDetail?type=4' + '&isShare=1' + '&live=0' + '&activityId=' + that.data.groupData.activityId + '&groupId=' + that.data.groupData.groupId + '&price=' + that.data.groupData.groupPrice + '&data=' + JSON.stringify(groupData),
        })
    },
    //原价购买
    sellPriceClick: function () {
        var that = this
        // type判断活动类型 1=没有活动  2=组团 3=秒杀 4=参与拼团
        //检查是否登录过
        that.setData({
            isClickSellPrice: true,
            isClickGroupPrice: false
        })
        app.checkLogin().then(res => {
            //如果已经登陆过
            if (res == true) {
                that.sellPriceBuy()
            } else {
                that.setData({
                    loginShow: true
                })
            }
        })
    },
    sellPriceBuy: function () {
        var groupData = JSON.parse(JSON.stringify(this.data.groupData))  
        groupData.smallCover = encodeURIComponent(groupData.smallCover)
        var that = this
        // type判断活动类型 1=没有活动  2=组团 3=秒杀
        wx.navigateTo({
            url: '../paymentDetail/paymentDetail?type=1' + '&isShare=0' + '&live=0' + '&activityId=' + that.data.groupData.activityId + '&groupId=0' + '&price=' + that.data.groupData.sellPrice + '&my=1' + '&data=' + JSON.stringify(groupData),
        })
    },
    groupClick: function () {
        var that = this
        // type判断活动类型 1=没有活动  2=组团 3=秒杀 4=参与拼团
        //检查是否登录过
        that.setData({
            isClickGroupPrice: true,
            isClickSellPrice: false
        })
        app.checkLogin().then(res => {
            //如果已经登陆过
            if (res == true) {
                that.groupBuy()
            } else {
                that.setData({
                    loginShow: true
                })
            }
        })
    },
    groupBuy: function () {
        var groupData = JSON.parse(JSON.stringify(this.data.groupData))  
        groupData.smallCover = encodeURIComponent(groupData.smallCover)
        var that = this
        // type判断活动类型 1=没有活动  2=组团 3=秒杀
        wx.navigateTo({
            url: '../paymentDetail/paymentDetail?type=2' + '&isShare=1' + '&live=0' + '&activityId=' + that.data.groupData.activityId + '&groupId=0' + '&price=' + that.data.groupData.groupPrice + '&data=' + JSON.stringify(groupData),
        })
    },
    toStudy: function () {
        wx.navigateTo({
            url: '../courseDetails/courseDetails?courseId=' + this.data.groupData.courseId,
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
                    that.getGroupData(that.data.groupId)
                }
            })
        } else if (e.detail.detail.errMsg == "getUserInfo:fail auth deny") {
            app.openSystemSetting().then(res => {
                app.getUserInfoApi(res).then(result => {
                    if (result.data.status == 0) {
                        that.getGroupData(that.data.groupId)
                    }
                })
            })
        }
    },
    //获取电话号码
    getPhoneNumber: function (e) {
        var that = this;
        that.hiddenLogin()
        if (e.detail.detail.errMsg == "getPhoneNumber:ok") {
            app.getPhoneNumberApi(e).then(res => {
                if (res.data.status == 0) {
                    if (that.data.isClickJoin == true) {
                        that.joinAndNavToPay()
                    } else if (that.data.isClickGroupPrice == true) {
                        that.groupBuy()
                    } else if (that.data.isClickSellPrice == true) {
                        that.sellPriceBuy()
                    }
                }
            })
        }else{
            wx.showToast({
                title: '登录失败',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //跳转输入手机号登录页面
    phoneVerity: function () {
        wx.navigateTo({
            url: '../../login/login',
        })
    },
    //隐藏登录框
    hiddenLogin: function () {
        this.setData({
            loginShow: false
        })
    },
    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function (res) {
        var that = this
        console.log('分享给别人的团ID...' + that.data.groupId)
        return {
            title: '我报名了『' + that.groupData.mainTitle+ '』的学习，邀请你来一起组团学习',
            path: '/pages/courseGroup/courseGroup?groupId=' + that.data.groupId +'&shareMe=true'
        }
    },
    toIndex: function () {
        console.log('-----------')
        wx.reLaunch({
            url: "/pages/index/index",
        })
    },
    groupNotice: function () {
        wx.navigateTo({
            url: '../groupNotice/groupNotice',
        })
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

})