// pages/voiceDownList/voiceDownList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // courseDirectoryCellList: [
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'},
    //   { duration: '10:26', playNum: '666', sort: '1',cateName: '说好的幸福嗯'}
    // ],
    courseDirectoryCellList: '',
    downList:true,
    courseId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let courseId = options.courseId;
    console.log(options.courseId)
    this.setData({
      courseId: options.courseId
    })
    this.getDownListMessage(options.courseId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },
  getDownListMessage:function(courseId){
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/downDetail',
      data: {
        courseId: courseId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        that.setData({
          courseDirectoryCellList:res.data.data
        })
        console.log(JSON.stringify(res))
      }
    })
  },
  toplay:function(e){
    let playVoiceData = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../../pages/play/play?courseId=' + playVoiceData.courseId + '&sort=' + playVoiceData.sort + '&list=' + JSON.stringify(playVoiceData.list),
    })
    // console.log(e.currentTarget.dataset)
  },
  // 删除课时（接口已调通、删除成功后的逻辑还没处理）
  deleteCate: function(e){
    let cateId = e.currentTarget.dataset.cateid
    console.log(cateId)
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/deleteDownload',
      data: {
        cateId: cateId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.getDownListMessage(that.data.courseId)
      }
    })
  }
})