// pages/punchClock/punchClock.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topData: {
      tuition: '666.6',
      bonus: '33.3',
      punchNum: '33',
      courseId: ''
    },
    pageNum:1,     // 当前页码数
    pageSize: 5,
    lastPage: '',  // 最后页码数
    clockNum: '',  // 已经打卡的次数
    bonusList:[],   //瓜分奖金列表
    hasClick: false,
    finishPunch: false,
    dataArr: [],  // 打卡日历数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseId = options.courseId;
    let todayIsClock = options.todayIsClock
    this.setData({
      courseId: courseId
    })
    console.log('todayIsClock----------->' + todayIsClock)
    // 如果今天已经打过卡、打卡按钮变成灰色不能点击状态
    if(todayIsClock){
      this.setData({
        hasClick: true
      })
    }
    console.log(this.data.courseId)
    this.geteClockBonusPool();
    this.geteClockList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  punchClock:function(e) {
    let type = e.currentTarget.dataset.type
    console.log(e.currentTarget.dataset.type)
    // 点击m马上打卡，如果已经完成全部打卡，则（finishPunch: true）
    // this.geteClockBonusPool();
    var that = this;
    // 点击马上打卡调打卡接口
    wx.request({
      url: app.globalData.url + 'courseClock/createCouStudyClockRecode',
      // url: app.globalData.url + 'courseClock/getCouStudyClockList',
      // url: app.globalData.url + 'courseClock/getCourseClockBonusPool',
      data: {
        courseId: that.data.courseId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log('打卡是否成功-------------》')
        console.log(res)
        // 打卡成功调用获取打卡记录接口
        that.geteClockList()
        that.setData({
          hasClick: true
        })
      }
    })

    // if(type == true){
    //   this.setData({
    //     hasClick: false,
    //   })
    // } 
    // else{
    //   this.setData({
    //     hasClick: true,
    //     finishPunch: true
    //   })
    // }
    
  },
  jj: function (e) {
    console.log(e)
    console.log(666666)
  },
  // 打卡接口奖金接口（进入打卡界面请求头部数据的接口）
  geteClockBonusPool: function(){
    var that = this;
    wx.request({
      // url: app.globalData.url + 'courseClock/createCouStudyClockRecode',
      // url: app.globalData.url + 'courseClock/getCouStudyClockList',
      url: app.globalData.url + 'courseClock/getCourseClockBonusPool',
      data: {
        courseId: that.data.courseId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log('头部信息接口----------》'+JSON.stringify(res))
        that.setData({
          topData: res.data.data
        })
      
      }
    })
  },
  geteClockList: function () {
    var that = this;
    wx.request({
      // url: app.globalData.url + 'courseClock/createCouStudyClockRecode',
      url: app.globalData.url + 'courseClock/getCouStudyClockList',
      // url: app.globalData.url + 'courseClock/getCourseClockBonusPool',
      data: {
        courseId: that.data.courseId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log('列表接口----------》' + JSON.stringify(res))
    
        that.setData({
          clockNum: res.data.data.length
        });
        console.log('clockNum--------------->'+that.data.clockNum)
        console.log('requireNum--------------->' + that.data.topData.requireNum)
        // 如果已打卡次数等于所需打卡次数，说明打卡完成，请求获取奖金列表接口
        if (that.data.clockNum+5 == that.data.topData.requireNum){
          that.setData({
            finishPunch: true
          });
          console.log('pageSize----------------->'+that.data.pageSize)
          console.log('pageNum------------------>'+that.data.pageNum)
          that.getPunchMoneyList(that.data.pageNum, that.data.pageSize)
        }
      }
    })
  },
  // 打卡完成，请求打卡分得奖金列表
  getPunchMoneyList:function(pageNum,pageSize){
    var that = this;
    wx.request({
      url: app.globalData.url + 'bonus/getCourseBonusRecordList',
      data: {
        courseId: that.data.courseId,
        pageNum: pageNum,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
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
        console.log('11111111111111111--------------------->'+that.data.bonusList)
        console.log('22222222222222222--------------------->' + listMessage)
        that.setData({
          bonusList: that.data.bonusList.concat(listMessage),
          lastPage: res.data.data.pages
        })
        
        console.log('奖金列表----------》' + JSON.stringify(res))
      }
    })
  },
  // 上拉加载更多
  bindDownLoad: function(){
    console.log('双击6666666666')
    var that = this;
    console.log(that.data.lastPage)
    if (that.data.pageNum < that.data.lastPage) {
      that.setData({
        pageNum: that.data.pageNum + 1
      })
      this.getPunchMoneyList(that.data.pageNum, that.data.pageSize)
    }
  },
  // 下拉刷新
  refresh: function(){
    console.log('我要刷新')
    this.setData({
      pageNum: 1,
      pageSize: 5,
      bonusList: []
    });
    this.getPunchMoneyList(this.data.pageNum, this.data.pageSize)
  }
})