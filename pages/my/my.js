// pages/.js
// import '../logs/logs.js';
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        myCell: [
            { icon: '../../images/me-hasBuy.png', text: '已购课程', id: 1 },
            { icon: '../../images/me-group.png', text: '我的拼团', id: 0 },
            // { icon: 'iconfont-me_list_icon4', text: '我的账户',id: 1 },
            { icon: '../../images/me_list_icon3.png', text: '我的奖学金', id: 2 },
            { icon: '../../images/me_list_icon4.png', text: '我的优惠券', id: 3 },
            { icon: '../../images/me-hasBuy', text: '我的简历', id: 4 },
            { icon: '../../images/me_list_icon6.png', text: '系统设置', id: 5 },
            { icon: '../../images/me_list_icon7.png', text: '在线客服', id: 6 },
            { icon: '../../images/me_list_icon8.png', text: '邀请好友', id: 7 }
        ],
        personMessage: '',
        inviteMoney: '',
        loginShow: false,
        authorization: false
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        //判断是否授权和登陆
        var that  = this
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
                that.getMessage()
                that.getInviteMoney()
                if (res.data.data.needLogin == true) {
                    that.setData({
                        loginShow: true
                    })
                }
            }
        })
        // this.getMessage()
        // this.getInviteMoney()
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
                    that.getMessage()
                    that.getInviteMoney()
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
                    that.getMessage()
                    that.getInviteMoney()
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
    hiddenLogin: function (e) {
        this.setData({
            loginShow: false,
            authorization: false
        })
    },
    getMessage: function () {
        var that = this;
        wx.request({
            url: app.globalData.url + 'user/getUserInfo',

            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {

            },
            method: 'post',
            success: function (res) {
                console.log(JSON.stringify(res))
                that.setData({
                    personMessage: res.data.data || ''
                })
            }
        })
    },
    getInviteMoney: function () {
        var that = this;
        wx.request({
            url: app.globalData.url + 'user/getInviteMoney',

            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {

            },
            method: 'post',
            success: function (res) {
                console.log('money------>' + JSON.stringify(res))
                that.setData({
                    inviteMoney: res.data.data
                })
            }
        })
    },
    toEditMessage: function () {
        // wx.navigateTo({
        //   url: '../../pages/editMessage/editMessage',
        // })
    },
    myCellClick: function (e) {
        console.log(e.currentTarget.dataset)
        let id = e.currentTarget.dataset.id;
        if (id == 0) {
            wx.navigateTo({
                url: '../../pages/myCollage/myCollage',
            })
        }
        else if (id == 1) {
            // 跳转到已购课程
            wx.navigateTo({
                url: '../hasBuyCourse/hasBuyCourse',
            })
        }
        else if (id == 2) {
            wx.navigateTo({
                url: '../../pages/myScholarship/myScholarship',
            })
        }
        else if (id == 3) {
            wx.navigateTo({
                url: '../../pages/myCoupon/myCoupon',
            })
        }
    },
    toInvite: function () {
        console.log('1111111')
        wx.navigateTo({
            url: '../../pages/myInvite/myInvite',
        })
    }
})