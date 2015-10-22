jQuery.sap.declare("bwm.view.BaseController");
jQuery.sap.require("sap.ui.core.routing.History");
sap.ui.core.mvc.Controller.extend("bwm.view.BaseController", {
    getEventBus: function () {
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId).getEventBus();
    },

    getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    onNavButtonPressed: function () {
        this.getRouter().backWithoutHash(this.getView());
    },

    getComponent: function(){
        return this.getOwnerComponent();
    },
    
    onNavBack: function (oEvent) {
		var oHistory, sPreviousHash;

		oHistory = sap.ui.core.routing.History.getInstance();
		sPreviousHash = oHistory.getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("invitations", {}, true /*no history*/); //Home 
		}
	}

});
