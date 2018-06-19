// pages/myScholarship/myScholarship.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    activeIndex: 0,
    tabs: ["课程邀请卡", "奖学金明细"],
    scholarship: true,
    courseCellList: [],
    // 分页数据
    pageNum: 1,   // 设置加载的第几次，默认是第一次  
    pageSize: 5,      //返回数据的个数  
    lastPage: '' //最后页面数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoneyMessage()
    this.getMessage(1)
  },
  tabClick: function (e) {
    console.log(this.data.activeIndex)
    if(this.data.activeIndex == 0){
      wx.navigateTo({
        url: '../../pages/myScholarshipDetail/myScholarshipDetail',
      })
    }
  },
  getMessage: function (pageNum) {
    
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/getDistributionList',
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
        that.setData({
          // courseCellList: res.data.data.list,
          courseCellList: that.data.courseCellList.concat(res.data.data.list),
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
  getMoneyMessage: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'bonus/getUserBurseSum',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.setData({
          money: res.data.data.burseSum
        })
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
      let type = that.data.type
      this.getMessage(that.data.pageNum)
    }
  },
  // 下拉刷新
  refresh: function () {
    console.log('我要刷新')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      pageNum: 1,
      courseCellList: []
    })
    this.getMessage(this.data.pageNum)
  },
  // 点击分享进入分享界面
  toInviteCard: function(e){
    let courseId = e.currentTarget.dataset.courseid;
    console.log(courseId)
    wx.navigateTo({
      url: '../../pages/inviteCard/inviteCard?courseId='+courseId
    })
  }
})