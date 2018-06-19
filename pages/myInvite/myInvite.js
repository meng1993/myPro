// pages/myInvite/myInvite.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteMessage: '',
    inviteId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInviteMessage()
    this.getInviteId()
  },
  onShareAppMessage: function (options) {
    var that = this;
    return {
      title: '邀请你一起来领取奖学金',
      path: '/pages/receiveInvite/receiveInvite?inviteId=' + that.data.inviteId
    }

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
  getInviteMessage: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'user/getUserInviteInfo',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {

      },
      method: 'post',
      success: function (res) {
        console.log('money------>' + JSON.stringify(res))
        that.setData({
          inviteMessage: res.data.data
        })
      }
    })
  },
  getInviteId: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'user/createInviteRecord',

      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {

      },
      method: 'post',
      success: function (res) {
        console.log('6666666------>' + JSON.stringify(res))
        that.setData({
          inviteId: res.data.data
        })
      }
    })
  }

})