jQuery.sap.declare("bwm.view.Invitations");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.Formatter");
bwm.view.BaseController.extend("bwm.view.Invitations", {
	// controller logic goes here
	onInit: function () {

	},
	onBeforeRendering: function () {},
	onAfterRendering: function () {},
	getRouter: function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	toInvitationsMap: function () {
		this.getRouter().navTo("invitationsMap");
	},
	toMine: function () {
		this.getRouter().navTo("mine");
	},
	onDisplay: function (oEvent) {
		var oItem = oEvent.getSource();
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "bwm.view.InvitationDetail",
			targetViewType: "XML",
			transition: "slide",
			data: {
				invitation: oItem.getBindingContext().getProperty('id')
			}
		});
		// this.getRouter().navTo("invitationDetail", {
		// 	invitation: oItem.getBindingContext().getPath().substr(1),
		// });
	},
	onGlobe: function (oEvent) {
		var oItem = oEvent.getSource();
		this.getRouter().navTo("invitationDetailMap", {
			invitation: oItem.getBindingContext().getPath().substr(1),
		});
	},
	onAdd: function () {
		this.getRouter().navTo("newInvitation");
	}
});