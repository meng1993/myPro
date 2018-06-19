// pages/offlineVoice/offlineVoice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnGroup: [
      { text: '已离线', current: '0', active: true },
      { text: '离线中', current: '1', active: false }
    ],
    offlineList: [{
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      size: '1', classHour:'32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      size: '2', classHour: '32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      size: '3', classHour: '32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      size: '4', classHour: '32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      size: '5', classHour: '32'
    }],
    offlineIngList: [{
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      time: '10:16', classHour: '32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      time: '10:16', classHour: '32'
    },
    {
      title: '社群构建的18个核心秘密', content: '从搭建到运效高活力哈哈哈',
      time: '10:16', classHour: '32'
    }],
    offline: true,
    offline_ing: false,
    fileSize: '11'   // 下载文件的大小
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage()
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
  click: function(e) {
    // console.log(e.currentTarget.dataset.current)
    let current = e.currentTarget.dataset.current
    var that = this;
    var active = "btnGroup[" + current + "].active";//先用一个变量，把(info[0].gMoney)用字符串拼接起来

    this.setData({
      btnGroup: [
        { text: '已离线', current: '0', active: false },
        { text: '离线中', current: '1', active: false }
      ],
      // [up]: '../../images/1.png',
      [active]: true
    });
    if (current === '0') {
      // 请求已离线音频接口
      // console.log(current);
      this.setData({
        offline: true,
        offline_ing: false
      })
    }
    else if (current === '1') {
      // 请求离线中音频接口
      // console.log(current);
      this.setData({
        offline: false,
        offline_ing: true
      })
    }
  },
  // 删除课程（删除课程下的所有课时）
  deleteCourse: function (e) {
    let courseId = e.currentTarget.dataset.courseid
    console.log(courseId);
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/deleteDownloadCourse',
      data: {
        courseId: courseId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        that.getMessage()
      }
    })
  },
  getMessage: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/downList',
      data: {
        // type: type,
        // "pageNum": pageNum,
        // "pageSize": that.data.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(JSON.stringify(res))
        let listMessage = res.data.data
        that.setData({
          offlineList: listMessage
        })
      }
    })
  },
  toCourseDetails: function(e){
    let courseId = e.currentTarget.id;
    wx.navigateTo({
      url: '../../pages/voiceDownList/voiceDownList?courseId='+courseId,
    })
  },
  downLoad: function(){
    const downloadTask = wx.downloadFile({
      url: 'http://dl.stream.qqmusic.qq.com/C1000018jCvj3i0f3E.m4a?vkey=734C6EF27F122751D9D098AC84F2465F8BA2658A4D4EC9C6A084FCDC10C68718A5C72869CF3B424EC4EE8CCF96FEFDD4E2B2F7F9E6790E73&fromtag=66', //仅为示例，并非真实的资源
      success: function (res) {
        
        
        let tempFilePath = res.tempFilePath;
        if (res.statusCode === 200) {
          console.log('临时路径----->' + tempFilePath)
          // wx.playVoice({
          //   filePath: res.tempFilePath,
          //   success:function(){
          //     console.log('为啥播放不了呢')
          //   }
          // })
          var bgAudio = wx.getBackgroundAudioManager()
          console.log(res.tempFilePath)
          bgAudio.src = res.tempFilePath
          bgAudio.title = '666'
          bgAudio.play();
          // wx.saveFile({
          //   tempFilePath: tempFilePath,
          //   success: function (res) {
          //     var savedFilePath = res.savedFilePath
          //     console.log('永久路径----->' + savedFilePath)
          //     // wx.playVoice({
          //     //   filePath: savedFilePath,
          //     //   success:function(){
          //     //     console.log('为啥播放不了呢')
          //     //   }
          //     // })
          //     var bgAudio = wx.getBackgroundAudioManager()
          //     console.log(savedFilePath)
          //     bgAudio.src = savedFilePath
          //     bgAudio.title = '666'
          //     bgAudio.play();
          //   },
          //   fail:function(err){
          //     console.log(111)
          //     console.log(err)
          //   }
          // })
        }
        // 下载完成请求服务器接口
        // var that = this;
        // console.log(that.data.fileSize)
        // 下载成功调用保存到本地接口
      
        //666666666666666666666666调用后台已离线列表接口
        // wx.request({
        //   url: app.globalData.url + 'course/download',
        //   data: {
        //     cateId: 2,
        //     courseId: 1,
        //     fileSize: 666
        //   },
        //   header: {
        //     // 'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   method: 'post',
        //   success: function (res) {
        //     console.log(1111111111)
        //     console.log(res)
          
        //   }
        // })


      },
      fail: function (err) {
        console.log(err)
      }
    });
    downloadTask.onProgressUpdate((res) => {
      // var that = this;
      // console.log('下载进度', res.progress)
      // console.log('已经下载的数据长度', res.totalBytesWritten)
      // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      
      // this.setData({
      //   fileSize: 666
      // })
      // this.data.fileSize = res.totalBytesExpectedToWrite
      // console.log(this.data.fileSize)
    })

  }
})