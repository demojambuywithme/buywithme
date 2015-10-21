jQuery.sap.declare("bwm.util.Formatter");

bwm.util.Formatter = {
	getImageSrc : function(imageData) {
		return "data:image/png;base64," + imageData;
	},

	discountInforFormatter : function(total_quantity,discountType,discount,total_money,return_money) {
		
		var returnText = '';
		
		if (discountType === '01') {
			returnText = 'Buy ' + total_money + ' Return ' + return_money;
		}else if(discountType === '02') {
			var off = (1 - discount) * 100;
			returnText = 'Buy ' + total_quantity + ' PC ' + off.toString() + '%' ;
		}
		
		return returnText;
	}
	
};