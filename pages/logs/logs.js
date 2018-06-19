Page({


	data: {
		flag: true,
	},

	/**
	 * 弹出层函数
	 */
	//出现
	show: function () {

		this.setData({ flag: false })

	},
	//消失

	hide: function () {

		this.setData({ flag: true })

	},

})