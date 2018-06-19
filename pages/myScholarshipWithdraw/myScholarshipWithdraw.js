// pages/myScholarshipWithdraw/myScholarshipWithdraw.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',      // 可提现金额
    withDrawMoney: '',   // 输入框中输入提现的金额
    formId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      money: options.money
    })
  },
  moneyInput: function(e) {
    this.setData({
      withDrawMoney: e.detail.value
    })
  },
  toWithdrawal: function(e){
    console.log('formId------------->'+e.detail.formId)
    
    var that = this;
    that.setData({
      formId: e.detail.formId
    })
    console.log(that.data.withDrawMoney)
    wx.request({
      url: app.globalData.url + 'buy/extractMoney',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        authorization: app.globalData.token
      },
      data: {
        amount: that.data.withDrawMoney * 100,
        formId: that.data.formId
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        if(res.data.status == 0){
          wx.showToast({
            title: '提取成功',
            icon: 'success',
            duration: 2000,
            success: function(){
              setTimeout(function(){
                // wx.navigateBack({
                //   delta: 2
                // })
                wx.navigateTo({
                  url: '../../pages/myScholarshipDetail/myScholarshipDetail',
                })
              },2000)
            }
          });
          
        }
        else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  toScholarshipDetail: function(){
    wx.navigateTo({
      url: '../../pages/myScholarshipDetail/myScholarshipDetail',
    })
  }
})