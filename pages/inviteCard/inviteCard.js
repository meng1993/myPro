// pages/inviteCard/inviteCard.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseId: '',
    message: {}, 
    code: '',
    canShow: false,
    mysrc: '',
    qrCard: '',
    mainTitle: '',   // 主标题
    shareHeaderImage: ''  // 头像地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let courseId = options.courseId;
    this.setData({
      courseId: courseId,
      mainTitle: options.mainTitle
    })
    this.getMessage()
    console.log(courseId)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onShareAppMessage: function (options) {
    var that = this;
    console.log(this.data.courseId);
    return {
      title: that.data.mainTitle,
      // desc: '佛山第一生活门户',
      path: '/pages/courseDetails/courseDetails?courseId=' + that.data.courseId + '&shareId=' + that.data.message.idStr
    }

  },
  getMessage: function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/createQRCode',
      data: {
        page: '',
        courseId: that.data.courseId,
        code: that.data.code
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      success: function (res) {
        console.log('是这个接口麽----------->'+JSON.stringify(res))
        that.setData({
          message: res.data.data,
          code: res.data.data.id
        });
        // 先将海报图片保存到本地开始
        console.log('服务器上图片----->' + that.data.message.distPosterUrl)
        wx.downloadFile({
          url: that.data.message.distPosterUrl,
          success: function (sres) {
            console.log('本地图片路径---------》' + sres.tempFilePath);
            that.setData({
              mysrc: sres.tempFilePath
            })
            console.log('看我本地路径对不对' + that.data.mysrc)
          }, fail: function (fres) {

          }
        });
        // 先将图片保存到本地结束
        // 将二维码图片保存到本地
        console.log('服务器上二维码图片----->' + that.data.message.distQrCode)
        wx.downloadFile({
          url: that.data.message.distQrCode,
          success: function (sres) {
            console.log('本地二维码图片路径---------》' + sres.tempFilePath);
            that.setData({
              qrCard: sres.tempFilePath
            })
            console.log('二维码保存到本地' + that.data.mysrc)
          }, fail: function (fres) {

          }
        });
        // 将头像保存到本地开始
        wx.downloadFile({
          url: that.data.message.avatarUrl,
          success: function (sres) {
            console.log('本地推荐人头像图片路径---------》' + sres.tempFilePath);
            that.setData({
              shareHeaderImage: sres.tempFilePath
            })
            console.log('本地推荐人头像保存到本地' + that.data.shareHeaderImage)
          }, fail: function (fres) {

          }
        });
        // 将头像保存到本地结束
      }
    })
  },
  // 生成画布方法
  save: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
   
    
    
    that.setData({
      canShow: true
    })
    console.log('头像地址-------------------->'+that.data.message.avatarUrl)
    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('red')
    ctx.drawImage(that.data.mysrc, 10, 10, 180, 295)          // 海报
    ctx.drawImage(that.data.qrCard, 130, 255, 56, 56)       // 二维码
    ctx.setFontSize(12);
    ctx.setFillStyle('#353535');
    ctx.fillText(that.data.message.nickName, 45, 28, 100, 50);  
    

// 创建头像（画圆形头像）
    ctx.beginPath();
    //画裁剪区域，此处以圆为例  
    ctx.translate(20, 13);
    ctx.arc(10, 10, 10, 0, 2 * Math.PI);
    ctx.clip();//次方法下面的部分为待剪切区域，上面的部分为剪切区域  
    console.log('有头像没有啊---------->' + that.data.shareHeaderImage)
    ctx.drawImage(that.data.shareHeaderImage, 0, 0, 20, 20)       // 头像
    // ctx.drawImage('../../images/1.png', 0, 0, 20, 20)       // 头像
    ctx.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'myCanvas',
        success: function (res) {
          console.log('保存成功' + res.tempFilePath)
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function(){
              wx.hideLoading({
                title: '玩命加载中',
              });
              wx.showModal({
                title: '分享海报已保存到相册',
                content: '从相册选取分享到朋友圈,推荐朋友购买后,即可获得' + that.data.message.distCommission/100+'奖学金（奖学金可提现）',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#EE7F00',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })


            }
          })
        }
      })
    }, 2000))
  },
})