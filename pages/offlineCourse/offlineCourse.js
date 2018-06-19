// pages/offlineCourse/offlineCourse.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        list: 'loading'
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
            url: app.globalData.url + 'train/list',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    // debugger
                    wx.hideLoading()
                    that.setData({
                        list: res.data.data
                    })
                }
            }
        })
    },
    courseRecommend: function (e) {
        wx.navigateTo({
            url: '../courseRecommend/courseRecommend?index=' +e.currentTarget.id,
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