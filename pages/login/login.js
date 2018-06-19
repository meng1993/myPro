// pages/login/login.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        codeText: '获取验证码',
        codeTime: 60,
        noCode: true, //是否没有发送验证码
        vcode: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    getCode: function () {
        if (app.globalData.utils.checkPhone(this.data.phone) == false){
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'none',
                duration: 1000
            })
            return
        }
        var that = this
        wx.request({
            url: app.globalData.url + 'getCodeBylogin',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {
                mobilePhone: that.data.phone
            },
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        codeTime: 60,
                        noCode: false
                    })
                    setInterval(function () {
                        that.setData({
                            codeTime: that.data.codeTime - 1
                        })
                        if (that.data.codeTime == 0) {
                            that.setData({
                                noCode: true
                            })
                        }
                    }, 1000)
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    },
    inputPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    inputCode: function (e) {
        this.setData({
            vcode: e.detail.value
        })
    },
    login: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'loginByPhone',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {
                mobilePhone: that.data.phone,
                vcode: that.data.vcode
            },
            success: function (res) {
                if (res.data.status == 0) {
                    wx.setStorage({
                        key: 'token',
                        data: res.data.data
                    })
                    app.globalData.token = res.data.data
                    const pages = getCurrentPages();
                    const indexPage = pages[pages.length - 2];
                    indexPage.hiddenLogin()
                    wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000
                    })
                    setTimeout(function(){
                        wx.navigateBack({
                        })
                    },1000)
                    
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                }
            },
            fail: function (err) {
                reject(err)
            }
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

    }
})