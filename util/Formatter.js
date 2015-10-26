jQuery.sap.declare("bwm.util.Formatter");

bwm.util.Formatter = {
	getImageSrc : function(imageData) {
		return "data:image/png;base64," + imageData;
	},

	/*discountInforFormatter : function(total_quantity,discountType,discount,total_money,return_money) {
		
		var returnText = '';
		
		if (discountType === '01') {
			returnText = 'Buy ' + total_money + ' Return ' + return_money;
		}else if(discountType === '02') {
			var off = (1 - discount) * 100;
			returnText = 'Buy ' + total_quantity + ' PC ' + off.toString() + '%' ;
		}
		
		return returnText;
	},
	
	validInFormatter : function(create_time,valid_in, end_time){
		   if(end_time){
			   if ((Math.trunc((end_time - Date.parse(new Date()))/1000/60)) >= 0){
	            return (Math.trunc((end_time - Date.parse(new Date()))/1000/60));
			   } else{
				   return 0;
			   }
		   }else{
			   if ((Math.trunc(((Date.parse(new Date()) - create_time)/1000/60 - valid_in*60)))>=0){
		        return (Math.trunc(((Date.parse(new Date()) - create_time)/1000/60 - valid_in*60)));
			   }else{
				return 0;
			   }
		   }
		},
		
		percentValueFormatter: function (invId,totalQuantity) {
			this.getView().getModel().read("/Invitation('" + invId + "')/InvitationItems", {
				success: jQuery.proxy(function (data) {
					console.log(data);
					var invitationItems = data;
					var joinedQuantity=0;
					//var hasJoined = false;
					for (var i = 0; i < data.results.length; i++) {
						joinedQuantity = joinedQuantity + data.results[i]["quantity"];
					}
                    return (Math.trunc(joinedQuantity/totalQuantity*100));
				}, this)
			});
		},
		
		displayValueFormatter: function (invId,totalQuantity) {
			this.getView().getModel().read("/Invitation('" + invId + "')/InvitationItems", {
				success: jQuery.proxy(function (data) {
					console.log(data);
					var invitationItems = data;
					var joinedQuantity=0;
					//var hasJoined = false;
					for (var i = 0; i < data.results.length; i++) {
						joinedQuantity = joinedQuantity + data.results[i]["quantity"];
					}
                    return (joinedQuantity + '/' + totalQuantity);
				}, this)
			});
		},*/
		
};