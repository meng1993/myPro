Component({
	properties: {

	},
	methods: {
		getPhoneNumber: function (e) {
			// 	var myEventDetail = {
			// 		jj: e.currentTarget.dataset.name
			// 	} // detail对象，提供给事件监听函数
			// 	var myEventOption = {} // 触发事件的选项
			this.triggerEvent('phoneNumber', e)
		},
		phoneVerity: function(){
			this.triggerEvent('phoneverity')
		},
        haha: function(){
        },
        guanbi: function(){
            this.triggerEvent('hiddenToast')
        }
	}
})