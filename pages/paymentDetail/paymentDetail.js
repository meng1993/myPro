// pages/paymentDetail/paymentDetail.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
    data: {
        discount: 0, //优惠券金额
        discountId: '', // 优惠券id
        scholarship: 0, //奖学金金额
        useDiscount: false, // 是否使用优惠券
        useScholar: false, // 是否使用奖学金
        payData: '',
        activeType: 1, // 判断活动类型 1=没有活动  2=组团 3=秒杀
        payPrice: 0, // 实付金额
        isLive: 0, // 是否是直播课程
        // loginShow: false,
        activityId: 0, //活动Id  
        showPrice: 0, //付款详情展示的价格
        isShare: 0, //是否是点击好友分享链接进入
        groupId: '',
        isMy: 0,
        clientType: '',
        orderNumber: '',   //订单号
        hasOrder: false,  //是否下过订单
        shareId: '0',        // 分销id，不是分销为0
        formId: '',
        allScholarship: '', //奖学金总额
        canUseDiscount: ''
    },

	/**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var myData = JSON.parse(options.data)
        if (myData.smallCover) {
            myData.smallCover = decodeURIComponent(myData.smallCover)
        }
        if (myData.bigCover) {
            myData.bigCover = decodeURIComponent(myData.bigCover)
        }
        wx.hideLoading()
        this.setData({
            payData: myData,
            activeType: options.type,
            payPrice: options.price / 100,
            isLive: options.live,
            activityId: options.activityId,
            showPrice: options.price,
            isShare: options.isShare == undefined ? 0 : options.isShare,
            groupId: options.groupId != undefined ? options.groupId : 0,
            isMy: options.my == 1 ? 1 : 0,
            shareId: options.shareId == undefined ? 0 : options.shareId
        })
        console.log(options)
        console.log('isShare----' + options.isShare)
        console.log('groupId----' + options.groupId)
        console.log('shareId----' + this.data.shareId)
        this.getInfo()
        this.checkScholarship()
        this.checkDiscount()
    },
    discount: function () {
        wx.navigateTo({
            url: '../useDiscount/useDiscount?activeType=' + this.data.activeType + '&courseId=' + this.data.payData.courseId + '&sellPrice=' + this.data.showPrice + '&activityId=' + this.data.activityId,
        })
    },
    scholarship: function () {
        wx.navigateTo({
            url: '../scholarship/scholarship?payPrice=' + this.data.payPrice,
        })
    },
    orderPay: function (e) {
        console.log('formId' + e.detail.formId)
        this.setData({
            formId: e.detail.formId
        })
        if (this.data.isLive == 1) {
            //直播预约报名下单
            this.liveOrder()
        } else {
            //课程下单(包括 原价 秒杀  拼团)
            this.courseOrder()
        }
    },
    liveOrder: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'buy/saveLiveMakeEnter',
            data: {
                goodsId: this.data.payData.courseId,
                goodsType: 0,
                totalMoney: this.data.payData.sellPrice,
                realMoney: this.data.payPrice * 100,
                payMode: 0,
                couponId: this.data.discountId,
                couponMoney: this.data.discount * 100,
                distId: 0,
                distMoney: 0,
                scholarshipMoney: this.data.scholarship * 100,
                orderType: this.data.activeType - 1,
                orderFrom: 0,
                // clientType: that.data.clientType,
                clientType: 1,
                formId: this.data.formId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {
                    if (res.data.data.needPay == true) {
                        // 如果需要购买判断是安卓还是ios，安卓直接购买，ios的话弹提示框
                        wx.getSystemInfo({
                            success: function (r) {
                                that.setData({
                                    systemInfo: r,
                                })
                                if (r.platform == "devtools") {
                                    console.log('PC')
                                } else if (r.platform == "ios") {
                                    console.log('IOS')
                                    // 如果是ios，弹ios支付提示框
                                    that.setData({
                                        orderNumber: res.data.data.orderResult.orderNo
                                    })
                                    that.wxPay(res.data.data.orderResult)
                                    // that.iosPayModule()
                                } else if (r.platform == "android") {
                                    // 如果是安卓、正常支付
                                    console.log('android')
                                    that.wxPay(res.data.data.orderResult)
                                }
                            }
                        });
                    } else {
                        wx.showToast({
                            title: '购买成功',
                        })
                        that.livePaySuc()
                    }
                } else if (res.data.status == 1004) {

                }
            }
        })
    },
    wxPay(wxData) {
        var that = this
        wx.requestPayment({
            'timeStamp': wxData.timestamp,
            'nonceStr': wxData.noncestr,
            'package': wxData.wxpackage,
            'signType': 'MD5',
            'paySign': wxData.paySign,
            "success": function (res) {
                if (that.data.isLive == 1) {
                    that.livePaySuc()
                } else {
                    that.coursePaySuc(wxData)
                }
            },
            "fail": function (res) {
            },
            "complete": function (res) {

            }
        })
    },
    livePaySuc: function () {
        wx.navigateBack({
        })
        let pages = getCurrentPages();
        let livePage = pages[pages.length - 2];
        var liveData = livePage.data.liveData
        var isBuy = "liveData.isBuy"
        livePage.setData({
            [isBuy]: 1,
        })
    },
    coursePaySuc: function (wxData) {
        var that = this
        if (that.data.activeType == 2 || that.data.activeType == 4) {
            if (that.data.isShare && that.data.isShare == 1) {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                console.log('----share=1---groupId' + wxData.groupId)
                prevPage.getGroupData(wxData.groupId)
                setTimeout(function () {
                    wx.navigateBack({
                    })
                }, 500)

            } else {
                console.log('-------groupId' + wxData.groupId)
                wx.redirectTo({
                    url: '../courseGroup/courseGroup?groupId=' + wxData.groupId,
                })
            }
        } else {
            if (that.data.isMy == 1) {
                wx.redirectTo({
                    url: '../courseDetails/courseDetails?courseId=' + that.data.payData.courseId,
                })
            } else {
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({//直接给上移页面赋值
                    isBuy: 1,
                    activeIndex: 1
                });
                prevPage.getcourseDirectoryList(that.data.payData.courseId)
                wx.navigateBack({})
            }
        }
    },
    courseOrder: function () {
        console.log('price---------->' + parseInt(this.data.payPrice * 100))
        console.log('isShare====' + this.data.isShare)
        console.log('groupId====' + this.data.groupId)
        var that = this
        console.log(that.data.clientType)
        wx.request({
            url: app.globalData.url + 'buy/buyCourse',
            data: {
                activityId: that.data.activityId,
                courseId: that.data.payData.courseId,
                price: parseInt(that.data.payPrice * 100),
                type: that.data.activeType,
                scholarship: that.data.scholarship * 100,
                couponId: that.data.discountId,
                groupId: that.data.groupId,
                distId: that.data.shareId,
                // clientType: that.data.clientType,
                clientType: 1,
                formId: this.data.formId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                console.log(JSON.stringify(res))
                console.log('2222222222--' + res.data.msg)
                console.log('3333333333--' + res.data.status)
                // 判断安卓、ios，如果是安卓直接支付、如果是ios，弹ios提示框
                if (res.data.status == 0) {
                    if (res.data.data.needPay) {
                        wx.getSystemInfo({
                            success: function (r) {
                                that.setData({
                                    systemInfo: r,
                                })
                                if (r.platform == "devtools") {
                                    console.log('PC')
                                } else if (r.platform == "ios") {
                                    console.log('IOS')
                                    // 如果是ios，弹ios支付提示框
                                    that.setData({
                                        orderNumber: res.data.data.orderResult.orderNo
                                    })
                                    that.wxPay(res.data.data.orderResult)
                                    // that.iosPayModule()
                                } else if (r.platform == "android") {
                                    // 如果是安卓、正常支付
                                    console.log('android')
                                    that.wxPay(res.data.data.orderResult)
                                }
                            }
                        });

                    } else {
                        wx.showToast({
                            title: '购买成功',
                        })
                        that.coursePaySuc(res.data.data.orderResult)

                    }
                }
                else {
                    // 如果已经付款过，弹提示框
                    console.log(res)
                    wx.showToast({
                        icon: 'none',
                        title: res.data.msg
                    })
                }
            }
        })
    },
    iosPayModule: function () {
        var that = this;
        wx.showModal({
            title: '支付提示',
            content: '基于微信小程序的运营规范，ios端暂无法支持微信支付购买，请复制链接在浏览器中打开完成购买',
            showCancel: false,
            confirmText: '复制链接',
            confirmColor: '#EE7F00',
            success: function (res) {
                if (res.confirm) {
                    console.log(that.data.orderNumber)
                    // 复制到剪切板
                    wx.setClipboardData({
                        // 2018060818413844400000029
                        data: 'https://api.dixinyinli.cn/dist/index.html#/' + that.data.orderNumber,
                        success() {
                            console.log('success')
                            that.setData({
                                hasOrder: true
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    checkScholarship: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'bonus/getUserBurseSum',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        allScholarship: res.data.data.burseSum / 100
                    })
                }
            }
        })
    },
    checkDiscount: function () {
        var that = this
        wx.request({
            url: app.globalData.url + 'buy/getDeductibleCouponList',
            data: {
                courseId: this.data.payData.courseId,
                price: this.data.showPrice,
                type: this.data.activeType,
                activityId: (this.data.activityId == 'undefined' || this.data.activityId == undefined) ? 0 : this.data.activityId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                authorization: app.globalData.token
            },
            method: 'post',
            success: function (res) {
                if (res.data.status == 0) {
                    that.setData({
                        canUseDiscount: res.data.data.avaliableList,
                    })
                }
            }
        })
    },
    getInfo: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (r) {
                console.log(r.platform)
                if (r.platform === 'ios') {
                    that.setData({
                        clientType: 1
                    })
                }
                else if (r.platform === 'android') {
                    that.setData({
                        clientType: 1
                    })
                }

            }
        });
        console.log('手机类型---------》' + that.data.clientType)
    },

	/**
	 * 生命周期函数--监听页面显示
	 */
    onShow: function () {
        this.setData({
            payPrice: ((this.data.showPrice / 100) - this.data.discount - this.data.scholarship).toFixed(1)
        })
    },
})