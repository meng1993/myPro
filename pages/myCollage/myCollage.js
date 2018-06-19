// pages/myCollage/myCollage.js 
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeIndex: 0,
        tabs: ['全部', '拼团中', '成功', '失败'],
        myCollage: true,
        courseCellList: [], // status:0拼团成功、1拼团失败、2拼团中
        type: 0,      //点击的是全部课程、系列课、单次课
        pageNum: 1,   // 设置加载的第几次，默认是第一次  
        pageSize: 5,      //返回数据的个数  
        lastPage: '' //最后页面数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMessage(0, 0)
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
    tabClick: function (e) {
        let type = e.currentTarget.id;
        console.log(e.currentTarget.id);
        this.setData({
            activeIndex: e.currentTarget.id
        });
        if (type == 0) {
            console.log('全部拼团');
            this.setData({
                courseCellList: []
            })
            this.getMessage(0, 1)
        }
        else if (type == 1) {
            console.log('拼团中');
            this.setData({
                courseCellList: []
            })
            this.getMessage(1, 1)
        }
        else if (type == 2) {
            console.log('拼团成功');
            this.setData({
                courseCellList: []
            })
            this.getMessage(2, 1)
        }
        else if (type == 3) {
            console.log('拼团失败');
            this.setData({
                courseCellList: []
            })
            this.getMessage(3, 1)
        }

    },
    getMessage: function (type, pageNum) {
        // 显示加载图标  
        wx.showLoading({
            title: '玩命加载中',
        })
        var that = this;
        wx.request({
            // url: 'http://192.168.1.137:8080/onlineStudy/user/getBookingGroup',
            url: app.globalData.url + 'user/getBookingGroup',

            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            data: {
                type: type,
                pageNum: pageNum,
                pageSize: 5
            },
            method: 'post',
            success: function (res) {
                console.log(JSON.stringify(res))

                // copy开始
                let listMessage = res.data.data.list
                let timeArr = []; // 毫秒数组
                var dataTimeArr = []; // 正确日期格式数组
                for (var i = 0; i < listMessage.length; i++) {
                    timeArr.push(listMessage[i].joinTime)
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
                    // courseCellList: res.data.data.list,
                    courseCellList: that.data.courseCellList.concat(listMessage),
                    lastPage: res.data.data.lastPage
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
            let type = that.data.type
            this.getMessage(that.data.activeIndex, that.data.pageNum)
        }

    },
    // 下拉刷新
    refresh: function () {
        console.log('我要刷新')
        wx.showNavigationBarLoading() //在标题栏中显示加载
        let type = this.data.type
        this.setData({
            pageNum: 1,
            courseCellList: []
        })
        this.getMessage(this.data.activeIndex, this.data.pageNum)
    },
    toCourseGroup: function (e) {
        let groupId = e.currentTarget.dataset.groupid
        console.log(groupId)
        wx.navigateTo({
            url: '../../pages/courseGroup/courseGroup?groupId=' + groupId
        })
    }
})