// pages/appoint/appoint.js
const checkPhone = require('../../utils/util.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        trainApplyVO: {
            companyDuty: "",
            companyName: "",
            linkMan: "",
            linkMobile: "",
            linkWchat: "",
            trainId: 1,
            userId: 1
        }

    },
    onLoad: function (options) {
        this.setData({
            ["trainApplyVO.trainId"]: 1,
        })
    },
    getlinkMan: function (e) {
        this.setData({
            ["trainApplyVO.linkMan"]: e.detail.value
        })
    },

    getlinkMobile: function (e) {
        this.setData({
            ["trainApplyVO.linkMobile"]: e.detail.value
        })
    },

    getlinkWchat: function (e) {
        this.setData({
            ["trainApplyVO.linkWchat"]: e.detail.value
        })
    },

    getcompanyName: function (e) {
        this.setData({
            ["trainApplyVO.companyName"]: e.detail.value
        })
    },

    getcompanyDuty: function (e) {
        this.setData({
            ["trainApplyVO.companyDuty"]: e.detail.value
        })
    },
    submit: function () {
        if (this.data.trainApplyVO.linkMan == '') {
            wx.showToast({
                title: '联系人不能为空',
                icon: 'none',
                duration: 1000
            })
            return
        } else if (this.data.trainApplyVO.linkMobile == '') {
            wx.showToast({
                title: '手机号码不能为空',
                icon: 'none',
                duration: 1000
            })
            return
        } else if (this.data.trainApplyVO.companyName == '') {
            wx.showToast({
                title: '公司名称不能为空',
                icon: 'none',
                duration: 1000
            })
            return
        } else if (app.globalData.utils.checkPhone(this.data.trainApplyVO.linkMobile) == false) {
            wx.showToast({
                title: '电话号码格式错误',
                icon: 'none',
                duration: 1000
            })
            return
        }
        //   if (this.data.trainApplyVO.linkMan == '' || this.data.trainApplyVO.linkMobile == '' || this.data.trainApplyVO.companyName == ''){
        // 	  wx.showToast({
        // 		  title: '请将信息填写完整',
        // 		  icon: 'none',
        // 	  })
        // 	  return
        //   }
        console.log(this.data.trainApplyVO)
        var that = this;
        wx.request({
            url: app.globalData.url + 'train/apply',
            data: this.data.trainApplyVO,
            method: 'post',
            header: {
                authorization: app.globalData.token
            },
            success: function (res) {
                debugger
                if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '预约报名成功，客服人员会尽快与您联系',
                        showCancel: false,
                        confirmColor: '#EE7F00',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.navigateBack({

                                })
                            }
                        }
                    })
                }else{
                    wx.showToast({
                        title: '报名失败',
                        icon: 'none'
                    })
                }
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