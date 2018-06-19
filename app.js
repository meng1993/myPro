const utils = require('./utils/util.js')
App({
    onLaunch: function () {
        // 登录
        // this.getLogin()
    },
    getLogin: function () {
        var that = this
        return new Promise(function (resolve, reject) {
            wx.login({
                success: function (res) {
                    if (res.code) {
                        wx.request({
                            url: that.globalData.url + 'getOpenIdByCode',
                            method: 'post',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                authorization: that.globalData.token
                            },
                            data: {
                                code: res.code
                            },
                            success: function (res) {
                                if (res.data.status == 0) {
                                    resolve(res)
                                }
                            },
                            fail: function (err) {
                                reject(err)
                            }
                        })
                    } else {
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        })
    },
    checkLogin() {
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.globalData.url + 'checkLogin',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: that.globalData.token
                },
                method: 'post',
                success: function (res) {
                    if (res.data.status == 0) {
                        resolve(res.data.data)
                    }
                }
            })
        })
    },
    getUserInfoApi: function (loginData) {
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.globalData.url + 'getUserInfo',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: that.globalData.token
                },
                data: {
                    encryptedData: loginData.encryptedData,
                    iv: loginData.iv,
                    code: loginData.signature
                },
                success: function (res) {
                    if (res.data.status == 0) {
                        resolve(res)
                    }
                },
                fail: function (err) {
                    reject(err)
                }
            })
        })
    },
    getPhoneNumberApi: function (e) {
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.globalData.url + 'loginByWeixin',
                data: {
                    encryptedData: e.detail.detail.encryptedData,
                    iv: e.detail.detail.iv
                },
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    authorization: that.globalData.token
                },
                success: function (res) {
                    if (res.data.status == 0) {
                        wx.showToast({
                            title: '登录成功',
                            icon: 'success',
                            duration: 1000
                        })
                        wx.setStorage({
                            key: 'token',
                            data: res.data.data
                        })
                        that.globalData.token = res.data.data
                        resolve(res)
                    } else {
                        wx.showToast({
                            title: '登录失败',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                }
            })
        })
    },
    openSystemSetting: function(){
        return new Promise((resolve, reject)=>{
            wx.openSetting({
                success: function (res) {
                    if (res.authSetting["scope.userInfo"]) {
                        wx.getUserInfo({
                            success: function (res) {
                                if (res.errMsg == "getUserInfo:ok") {
                                    resolve(res)
                                    // wx.showModal({
                                    //     title: '授权成功',
                                    // })
                                }
                            }
                        })
                    } else {
                        reject(res)
                        wx.showModal({
                            title: '授权失败',
                        })
                    }
                }
            })
        })
    },
    globalData: {
        userInfo: null,
        url: 'https://api.dixinyinli.cn/onlineStudy/',
        utils: utils,
        // url: 'http://116.62.138.222:8089/onlineStudy/',
        // url: 'http://192.168.1.137:8080/onlineStudy/',
        // url: 'http://hujia.tunnel.echomod.cn/onlineStudy/',
        currentPlayIndex: -1, //当前播放的Index
        token: '',
        playCourseId:'',
        playIsBuy: '',
        playCoverImg:'',
        playCourseTitle:'',
        playStatus: 10, //播放改状态 1=播放中 0=暂停  2=没有音频播放
    }
})