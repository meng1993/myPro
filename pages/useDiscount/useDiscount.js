// pages/useDiscount/useDiscount.js
var formData = require('../../utils/util.js');
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        discountList: 'loading',
        list: 'loading',  //可用优惠券列表
        unableList: 'loading', //不可用优惠券列表
        canUse: true,
        tabs: ["可使用", "不可使用"],
        activeIndex: 0,
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        wx.request({
            url: app.globalData.url + 'buy/getDeductibleCouponList',
            data: {
                courseId: options.courseId,
                price: options.sellPrice,
                type: options.activeType,
                activityId: options.activityId == 'undefined' ? 0 : options.activityId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {

                    for (var v of res.data.data.avaliableList) {
                        v.validEndTime = formData.dateTime(v.validEndTime)
                    }
                    for (var v of res.data.data.unavailableList) {
                        v.validEndTime = formData.dateTime(v.validEndTime)
                    }
                    wx.hideLoading()
                    that.setData({
                        discountList: res.data.data.avaliableList,
                        list: res.data.data.avaliableList,
                        unableList: res.data.data.unavailableList
                    })
                }
            }
        })
    },
    tabClick: function (e) {
        this.setData({
            activeIndex: e.currentTarget.id,
            canUse: e.currentTarget.id == '1' ? false : true,
            discountList: e.currentTarget.id == '1' ? this.data.unableList : this.data.list
        })
    },
    chooseDiscount: function (e) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        if (this.data.canUse) {
            // (prevPage.data.showPrice / 100) - prevPage.data.discount)
            if ((this.data.discountList[e.currentTarget.id].couponMoney) / 100 > prevPage.data.showPrice / 100 - prevPage.data.scholarship) {
                wx.showToast({
                    title: '优惠券金额不可大于实付金额',
                    icon: 'none'
                })
            } else {
                prevPage.setData({//直接给上移页面赋值
                    discount: (this.data.discountList[e.currentTarget.id].couponMoney) / 100,
                    useDiscount: true,
                    discountId: this.data.discountList[e.currentTarget.id].cpUsrId
                });
                wx.navigateBack({})
            }
        } else {
            wx.showToast({
                title: '此优惠券不可使用',
                icon: 'none'
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

    }
})