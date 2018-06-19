// pages/myCoupon/myCoupon.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    tabs: ['未使用','已使用','已过期'],

    discountList: [],
    canUse: true,
    activeIndex: 0,
    noUse: '',
    hasUse: '',
    overUse: ''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage(0)
    // this.getMessage(1)
    // this.getMessage(2)
    
  },
  onShareAppMessage: function () {
  
  },
  tabClick: function (e) {
    let type = e.currentTarget.id;
    console.log(e.currentTarget.id);
    if(type == 0){
      // 未使用
      this.setData({
        canUse: true
      });
      
      this.getMessage(0)
    }
    else if (type == 1) {
      // 已使用
      this.setData({
        canUse: false
      });
    
      this.getMessage(1)
    }
    else{
      // 已过期
      this.setData({
        canUse: false
      });
      
      this.getMessage(2)
    }
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  getMessage: function (type) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'user/getCouponList',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      data: {
        type: type
      },
      method: 'post',
      success: function (res) {
        console.log(JSON.stringify(res))
        // copy开始
        let listMessage = res.data.data
        let timeArr = []; // 毫秒数组
        var dataTimeArr = []; // 正确日期格式数组
        for (var i = 0; i < listMessage.length; i++) {
          timeArr.push(listMessage[i].validEndTime)
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
          discountList: listMessage
        })
        if(type == 0){
          that.setData({
            noUse: listMessage.length
          })
        }
        else if(type == 1){
          hasUse: listMessage.length
        }
        else{
          overUse: listMessage.length
        }
      }
    })
  },
  toMyCounRule: function(){
    wx.navigateTo({
      url: '../../pages/myCouponRule/myCouponRule',
    })
  }
})