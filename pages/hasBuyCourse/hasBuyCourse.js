// pages/hasBuyCourse/hasBuyCourse.js 
const app = getApp();
var util = require('../../utils/util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		btnGroup: [
			{ text: '全部课程', current: '0', img: '../../images/btn_normal.png', active: true },
			{ text: '系列课', current: '1', img: '../../images/btn_normal.png', active: false },
			{ text: '单次课', current: '2', img: '../../images/btn_normal.png', active: false }
		],
		currentTap: 0,
		hasBuyList: [],
		hasBuy: true,
		img: '../../images/study/btn_normal.png',
		type: 0,      //点击的是全部课程、系列课、单次课
		pageNum: 1,   // 设置加载的第几次，默认是第一次  
		pageSize: 5,      //返回数据的个数  
		lastPage: '' //最后页面数
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) { 
		this.getMessage(0, 1)
	},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
    
		wx.showNavigationBarLoading() //在标题栏中显示加载
    
		let type = this.data.type
		this.setData({
			pageNum: 1,
			hasBuyList: []
		})
		this.getMessage(type, 1)
	},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log(111)
    
    var that = this;
    console.log(that.data.lastPage)
    if(that.data.pageNum<that.data.lastPage){
      that.setData({
        pageNum: that.data.pageNum + 1
      })
      let type = that.data.type
      // console.log(that.data.type)
      this.getMessage(type, that.data.pageNum)
    }
  },

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	click: function (e) {
		console.log(e.currentTarget.dataset.current)
		let current = e.currentTarget.dataset.current
		var that = this;
		var up = "btnGroup[" + current + "].img";//先用一个变量，把(info[0].gMoney)用字符串拼接起来
		var active = "btnGroup[" + current + "].active";//先用一个变量，把(info[0].gMoney)用字符串拼接起来

		this.setData({
			btnGroup: [
				{ text: '全部课程', current: '0', img: '../../images/btn_normal.png', active: false },
				{ text: '系列课', current: '1', img: '../../images/btn_normal.png', active: false },
				{ text: '单次课', current: '2', img: '../../images/btn_normal.png', active: false }
			],
			[up]: '../../images/btn_active.png',
			[active]: true,
			type: current,
			pageNum: 1,
			hasBuyList: []
		});
		if (current === '0') {
			// 请求全部课程的接口
			// console.log(current)
			this.getMessage(0, 1)
		}
		else if (current === '1') {
			// 请求系列课的接口
			// console.log(current)
			this.getMessage(1, 1)
		}
		else {
			// 请求单次课的接口
			// console.log(current)
			this.getMessage(2, 1)
		}
	},
	getMessage: function (type, pageNum) {
		// 显示加载图标  
		wx.showLoading({
			title: '玩命加载中',
		})
		var that = this;
		wx.request({
			url: app.globalData.url + 'course/boughtList',
			data: {
				type: type,
				"pageNum": pageNum,
				"pageSize": that.data.pageSize
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
			},
			method: 'post',
			success: function (res) {
				console.log(res)
				let listMessage = res.data.data.list
				let timeArr = []; // 毫秒数组
				var dataTimeArr = []; // 正确日期格式数组
				for (var i = 0; i < listMessage.length; i++) {
					timeArr.push(listMessage[i].payTime)
				}
				for (var i = 0; i < timeArr.length; i++) {
					dataTimeArr.push(util.dateTime(timeArr[i]))
				}
				// 把time属性添加到listMessage对象数组中
				for (var i = 0; i < listMessage.length; i++) {
					listMessage[i]['time'] = dataTimeArr[i]
				}

				that.setData({
					hasBuyList: that.data.hasBuyList.concat(listMessage),
					lastPage: res.data.data.lastPage
				});
				// 请求成功、关闭下拉刷新
        setTimeout(function(){
          wx.stopPullDownRefresh()
        },200)
				
				//停止下拉刷新的加载动画
				wx.hideNavigationBarLoading()
				// 请求成功关闭玩命加载弹框
				wx.hideLoading({
					title: '玩命加载中',
				});
			}
		})
	},
	toCourseDetails: function (e) {
		let courseId = e.currentTarget.id
		console.log(courseId)
		wx.navigateTo({
			url: '../../pages/courseDetails/courseDetails?courseId=' + courseId,
		})
	},
  toCourseList: function(){
    wx.navigateTo({
      url: '../../pages/allCourse/allCourse?id=-1'
    })
  }
})