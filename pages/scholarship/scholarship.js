const app = getApp()
Page({
	data:{
		scholarship: 0,
		canUse: true,
		chooseScholarship:'',
		payPrice: 0
	},
	onLoad: function(options){
		this.setData({
			payPrice: options.payPrice
		})
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
						scholarship: res.data.data.burseSum/100
					})
				}
			}
		})
	},
	myInput: function(e) {
        // debugger
        // if (e.detail.value.split('')[0] == '.'){
        //     this.setData({
        //         chooseScholarship: '0.',
        //         canUse: true
        //     })
        // }
		this.setData({
            canUse: (Number(e.detail.value) > this.data.scholarship || Number(e.detail.value) > this.data.payPrice || Number(e.detail.value)==0) ? false : true,
            chooseScholarship: e.detail.value.split('')[0] == '.' ? '0.' : this.inputOnlyOnePoint(e.detail.value)
            // chooseScholarship: e.detail.value
		})
	},
	myFocus: function () {
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
        this.setData({
            payPrice: ((prevPage.data.showPrice / 100) - prevPage.data.discount).toFixed(2)
        })
	},
    inputOnlyOnePoint: function(v) {  
        var inputVal;  
        // inputVal = v.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
        inputVal = v.replace(/\.{2,}/g, ".").replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); //只保留第一个. 清除多余的  
        // inputVal = v.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                                                                                                // inputVal = v.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3');//只能输入两个小数  
        if (inputVal.indexOf(".") < 0 && inputVal != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
            inputVal = parseFloat(inputVal);
        }
        return inputVal;  
    },
	useScholarship: function(){
		let pages = getCurrentPages();
		let prevPage = pages[pages.length - 2];
		prevPage.setData({//直接给上移页面赋值
			scholarship: this.data.chooseScholarship,
			useScholar: true
		});
		wx.navigateBack({})
	},
	notUse: function() {
		// wx.showToast({
		// 	title: '你有这么多吗？？',
		// })
	}
})