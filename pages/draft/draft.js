// require('../../lib/MPreviewPPT.js')
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        pptImg:'',
        swiperIndex: 0
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.title || '文稿内容'
        })
        this.geDraftData(options.cateId)
        var that = this
    },
    intervalChange:function(e){
        this.setData({
            swiperIndex: e.detail.current
        })
    },

    geDraftData: function (cateId) {
        var that = this;
        wx.request({
            url: app.globalData.url + 'courseCatelog/getDraftContentInfo',
            data: {
                cateId: 1
            },
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        pptImg: res.data.data.pptImages
                    })
                    require('../../wxParse/wxParse.js').wxParse('article', 'html', res.data.data.draftContent, that, 5);
                }
            }
        })
    },
    open: function () {
        wx.openDocument({
            filePath: 'http://js8.in/nodeppt/',
            fileType: 'ppt',
            success: function (res) {
                debugger
                console.log('打开文档成功')
            },
            fail: function (e) {
                debugger
            }
        })
        // wx.downloadFile({
        // 	url:  'http://js8.in/nodeppt/',
        // 	// url: 'file:///C:/Users/Administrator/Desktop/h.pptx',
        // 	fileType: 'doc, xls, ppt, pdf, docx, xlsx, pptx',
        // 	success: function (res) {
        // 		debugger
        // 		var filePath = res.tempFilePath
        // 		wx.openDocument({
        // 			filePath: filePath,
        // 			success: function (res) {
        // 				debugger
        // 				console.log('打开文档成功')
        // 			},
        // 			fail: function(e){
        // 				debugger
        // 			}
        // 		})
        // 	},
        // 	fail:function(e){
        // 		debugger
        // 	}
        // })
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