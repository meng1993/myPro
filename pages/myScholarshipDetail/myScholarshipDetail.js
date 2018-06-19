// pages/myScholarshipDetail/myScholarshipDetail.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 1,
    tabs: ["课程邀请卡", "奖学金明细"],
    messageList: [],
    pageNum: 1,   // 设置加载的第几次，默认是第一次  
    pageSize: 10,      //返回数据的个数  
    lastPage: '' //最后页面数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  tabClick:function(){
    // console.log(this.getCurrentPages)
    console.log(getCurrentPages().length);
    let currentNum = getCurrentPages().length;
    if (currentNum == 3){
      // 值为3，是直接课程邀请卡、奖学金明细切换
      wx.navigateBack({
        delta:1
      });
    }
    else{
      // 为4，先提现、从提现里查看提现记录
      wx.navigateBack({
        delta: 2
      });
    }
  },
  getMessage: function (pageNum){
    
    var that = this;
    wx.request({
      url: app.globalData.url + 'bonus/getBonusRecordList',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      data: {
        pageNum: pageNum,
        pageSize: that.data.pageSize
      },
      method: 'post',
      success: function (res) {
        if(res.data.data !== null){
          // 显示加载图标
          wx.showLoading({
            title: '玩命加载中',
          })
        }
        console.log(JSON.stringify(res))
        // copy开始
        let listMessage = res.data.data.list
        let timeArr = []; // 毫秒数组
        var dataTimeArr = []; // 正确日期格式数组
        for (var i = 0; i < listMessage.length; i++) {
          timeArr.push(listMessage[i].createTime)
        }
        for (var i = 0; i < timeArr.length; i++) {
          dataTimeArr.push(util.dateTime(timeArr[i]))
        }
        // 把time属性添加到listMessage对象数组中
        for (var i = 0; i < listMessage.length; i++) {
          listMessage[i]['time'] = dataTimeArr[i]
        }
        // copy结束
        that.setData({
          // messageList: listMessage
          messageList: that.data.messageList.concat(listMessage),
          lastPage: res.data.data.pages
        });
        // 请求成功、关闭下拉刷新
        wx.stopPullDownRefresh()
        //停止下拉刷新的加载动画
        wx.hideNavigationBarLoading()
        // 请求成功关闭玩命加载弹框
        wx.hideLoading({
          title: '玩命加载中',
        });
      }
    })
  },
  // 上拉加载更多
  bindDownLoad: function () {
    console.log('我要加载更多')

    var that = this;
    console.log(that.data.lastPage)
    if (that.data.pageNum < that.data.lastPage) {
      that.setData({
        pageNum: that.data.pageNum + 1
      })
      this.getMessage(that.data.pageNum)
    }
  },
  // 下拉刷新
  refresh: function () {
    console.log('我要刷新')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      pageNum: 1,
      messageList: []
    })
    this.getMessage(this.data.pageNum)
  },
  toShareCourse: function(){
    wx.navigateBack({})
  }
})