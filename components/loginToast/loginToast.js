Component({
	properties: {
		
	},
	methods: {
		getUserInfo: function (e) {
			// debugger

		// 	var myEventDetail = {
		// 		jj: e.currentTarget.dataset.name
		// 	} // detail对象，提供给事件监听函数
		// 	var myEventOption = {} // 触发事件的选项
			this.triggerEvent('getUserInfo', e)
		},
        stopmaopao: function(){
            
        }
	}
})