const app = getApp();
Page({
  data: {
    items: [
      { name: 'USA', value: 'A、奶奶在父亲很小的时候去世了，外婆在安迪出生不久也去世了' },
      { name: 'CHN', value: 'B、外婆在奶奶去世不久就也去世了' },
      { name: 'BRA', value: 'C、奶奶在外婆去世不久就也去世了' },
      { name: 'JPN', value: 'D、以上都不对' }
    ],
    currentAnswer: [], // 当前页选中的值
    titleType: 1, //题目类型为0是单选题，为1为多选题
    firstTitle: true, //判断是否第一题
    lastTitle: false, //判断是否最后一题
    courseId: '', // 请求测试题列表
    titleNum: 0,  //当前题号
    titleTotal: '', //题目总数
    checked:'',
    answerTotal:{}
  },
  onLoad: function (options) {
    this.setData({
      courseId: options.courseId
    });
    this.getTestList(this.data.courseId,this.data.titleNum)
  },
  // 单选题方法
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e)
    this.setData({
      currentAnswer: e.detail.value
    });
    let testId = e.currentTarget.dataset.testid
    let answer = this.data.currentAnswer
    this.data.answerTotal[testId] = answer
    console.log(this.data.answerTotal)
  },
  // 多选题方法
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e)
    this.setData({
      currentAnswer: e.detail.value
    });
    let testId = e.currentTarget.dataset.testid
    let answer = this.data.currentAnswer.join(',')
    this.data.answerTotal[testId] = answer
    console.log(answer)
    console.log(this.data.answerTotal)
  },
  nextTitle:function() {
    // 所有的checked先赋值为false
    this.setData({
      checked: false
    })
    var that = this;
    // 当点击下一题时候，把本题选中值传到数组中，提交时候提交所有题目选中答案的值
    // console.log(this.data.currentAnswer)
    if(that.data.titleNum < that.data.titleTotal){
      this.setData({
        titleNum: that.data.titleNum + 1 
      })
      this.getTestList(that.data.courseId, that.data.titleNum)
    }
    console.log(that.data.titleTotal)
    console.log(that.data.titleNum)
  
    // 如果是最后一题，设置lastTitle为true
    if (that.data.titleNum + 1 == that.data.titleTotal){
      this.setData({
        lastTitle: true
      })
    }
    // 判断当前题号大于1，设置firstTitle为false
    if (that.data.titleNum+1 > 1){
      this.setData({
        firstTitle: false
      })
    }
  },
  prevTitle: function(){
    // 所有的checked先赋值为false
    this.setData({
      checked: false
    })
    var that = this;
    // 当点击下一题时候，把本题选中值传到数组中，提交时候提交所有题目选中答案的值
    // console.log(this.data.currentAnswer)
    if (that.data.titleNum > 0) {
      this.setData({
        titleNum: that.data.titleNum - 1
      })
      this.getTestList(that.data.courseId, that.data.titleNum)
    }
    console.log(that.data.titleTotal)
    console.log(that.data.titleNum)

    // 如果是第一题，设置firstTitle为true
    if (that.data.titleNum  == 0) {
      this.setData({
        firstTitle: true
      })
    }
    // 判断当前题号小于总题目数，设置lastTitle为false
    if (that.data.titleNum + 1 < that.data.titleTotal) {
      this.setData({
        lastTitle: false
      })
    }
  },
  getTestList:function(courseId,titleNum){
    var that = this;
    wx.request({
      url: app.globalData.url + 'testBank/list',
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
          items: res.data.data[titleNum],
          titleType: res.data.data[titleNum].questionType,
          titleTotal: res.data.data.length
        })
        console.log(JSON.stringify(res))
      }
    })
  },
  btnSubmit:function(){
    var that = this;
    console.log(that.data.courseId)
    console.log(that.data.answerTotal)
    let testList = JSON.stringify(that.data.answerTotal)
    // let courseId = JSON.stringify()
    wx.request({
      url: app.globalData.url + 'testBank/save',
      data: 
      {
        courseId: that.data.courseId,
        answer: testList
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
          authorization: app.globalData.token
      },
      method: 'post',
      success: function (res) {
        console.log(res)
      }
    })
  }
})