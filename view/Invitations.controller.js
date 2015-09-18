jQuery.sap.declare("bwm.view.Invitations");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.Formatter");
bwm.view.BaseController.extend("bwm.view.Invitations", {
	// controller logic goes here
	onInit : function() {
		
	},
	onBeforeRendering : function() {
	},
	onAfterRendering : function() {

	},
	getRouter : function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	toInvitationsMap : function() {
		this.getRouter().navTo("invitationsMap");
	},
	toMine : function() {
		this.getRouter().navTo("mine");
	},
	onPress : function(oEvent) {
		var oItem = oEvent.getSource();
		//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		/*oRouter.navTo("invitation", {
			invitationPath : oItem.getBindingContext().getPath().substr(1)
		});*/
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("invitation", {
			from: "invitations",
			invitation : oItem.getBindingContext().getPath().substr(1),
		}, bReplace);
		console.log(oItem.getBindingContext().getPath());
		
	}

});
