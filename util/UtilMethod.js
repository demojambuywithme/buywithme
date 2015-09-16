jQuery.sap.declare("bwm.util.UtilMethod");

bwm.util.UtilMethod = {
	    //Function to generate GUID for new invitation, but not sure whether it should be done by frontend or backend		
	guid : function() {
		
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		}
		
		
		return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
	}
};