//将秒数转为时分秒
const formatSeconds = value => {
	var secondTime = parseInt(value);// 秒
	var minuteTime = 0;// 分
	var hourTime = 0;// 小时
	if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
		//获取分钟，除以60取整数，得到整数分钟
		minuteTime = parseInt(secondTime / 60);
		//获取秒数，秒数取佘，得到整数秒数
		secondTime = parseInt(secondTime % 60);
		//如果分钟大于60，将分钟转换成小时
		if (minuteTime > 60) {
			//获取小时，获取分钟除以60，得到整数小时
			hourTime = parseInt(minuteTime / 60);
			//获取小时后取佘的分，获取分钟除以60取佘的分
			minuteTime = parseInt(minuteTime % 60);
		}
	}
	var result = "" + parseInt(secondTime);
	if (secondTime < 10) {
		result = "0" + parseInt(secondTime);
	}
	if (minuteTime < 10) {
		result = "0" + parseInt(minuteTime) + ":" + result;
	} else {
		result = "" + parseInt(minuteTime) + ":" + result;
	}
	if (hourTime > 0) {
		result = "" + parseInt(hourTime) + ":" + result;
	}
	return result;
}

// 获取日期新增开始
// function getMyDate(str) {
const dateTime = value => {
	var oTime;
	var oDate = new Date(value)
	var oYear = oDate.getFullYear()
	var oMonth = oDate.getMonth() + 1
	var oDay = oDate.getDate()
	var oHour = oDate.getHours();
	var oMinute = oDate.getMinutes();
	var oSecond = oDate.getSeconds();
	if (oHour < 10) {
		oHour = '0' + oHour
	}
	if (oMinute < 10) {
		oMinute = '0' + oMinute
	}
	if (oSecond < 10) {
		oSecond = '0' + oSecond
	}
	oTime = oYear + '-' + oMonth + '-' + oDay + '  ' + oHour + ':' + oMinute + ':' + oSecond
	return oTime;
};
// 获取日期新增结束

// 获取日期简洁开始
// function getMyDate(str) {
const dateTimeOne = value => {
  var oTime;
  var oDate = new Date(value)
  var oYear = oDate.getFullYear()
  var oMonth = oDate.getMonth() + 1
  var oDay = oDate.getDate()
  var oHour = oDate.getHours();
  var oMinute = oDate.getMinutes();
  var oSecond = oDate.getSeconds();
  if (oHour < 10) {
    oHour = '0' + oHour
  }
  if (oMinute < 10) {
    oMinute = '0' + oMinute
  }
  if (oSecond < 10) {
    oSecond = '0' + oSecond
  }
  if (oMonth < 10) {
    oMonth = '0' + oMonth
  }
  if (oDay < 10) {
    oDay = '0' + oDay
  }
  oTime = oMonth + '/' + oDay + '  ' + oHour + ':' + oMinute
  return oTime;
};
// 获取日期简洁结束


//倒计时
const countDown = value => {
	var timeArray = []
	//创建时间（现在）
	var nowDate = new Date();
	//获取两个时间点 距离1970.0.1的时间（毫秒数）
	var nowTime = nowDate.getTime();
	var nextTime = value
	if (nextTime < nowTime) {
		timeArray = ['00', '00', '00', '00']
	} else {
		//根据差值可以计算出 现在距离2018年的毫秒数 进而计算出秒数（毫秒数/1000）
		var dSecond = parseInt((nextTime - nowTime) / 1000);
		//通过现在距离2018年的秒数求出天数（秒数/24*60*60）
		var dDay = parseInt(dSecond / (24 * 60 * 60));
		if (dDay < 10) {
			dDay = '0' + dDay
		}
		//通过现在距离2018年的秒数取余 求出 去掉天数剩下的秒数
		var reSecond = dSecond % (24 * 60 * 60);
		//通过计算完剩下的秒数  求出小时数
		var dHour = parseInt(reSecond / 3600);
		// console.log(dHour);

		var dHour = parseInt(reSecond / 3600);
		if (dHour < 10) {
			dHour = '0' + dHour
		}

		//通过计算小时 剩下的秒数 求分钟数
		var reSecond1 = reSecond % 3600;

		var dMinute = parseInt(reSecond1 / 60);

		if (dMinute < 10) {
			dMinute = '0' + dMinute
		}
		// console.log(dMinute);
		//通过计算分钟数 剩下的秒数  就是我们想要的描述

		var nowSecond = reSecond1 % 60;
		if (nowSecond < 10) {
			nowSecond = '0' + nowSecond
		}

		// console.log('距离2018年1月1日还有' + dDay + '天' + dHour + '小时' + dMinute + '分钟' + nowSecond + '秒')
		timeArray = [dDay, dHour, dMinute, nowSecond]
	}
	return timeArray
}

//验证手机号的格式
const checkPhone  = (phoneNum) =>{
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;  
    if (!myreg.test(phoneNum)) {
        return false;
    } else {
        return true;
    }  
}
const request = (url, data) => {
	// var mytoken = ''
	// wx.getStorage({
	// 	key: 'token',
	// 	success: function(res) {
	// 		mytoken = res.data
	// 	},
	// })
	return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			data: data,
			method: 'post',
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				authorization: ''
			},
			success: function (res) {
				if (res.data.status == 0) {
					resolve(res)
				} else if (res.data.status == 1004) {
					wx.showToast({
						title: '请登录',
						icon: 'none'
					})
				}
			},
			fail: function (error) {
				reject(error)
			}
		})
	})
}

const resCode = (res, itSelf, loginShow, func) => {
	if (res.data.status == 1004) {
		itSelf.setData({
			loginShow: true
		})
	} else if (res.data.status == 0) {
		itSelf.func()
	}
}


module.exports = {
	formatSeconds: formatSeconds,
	dateTime: dateTime,
  dateTimeOne: dateTimeOne,
	countDown: countDown,
    checkPhone: checkPhone
	// request: request
}
