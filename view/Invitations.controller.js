jQuery.sap.declare("bwm.view.Invitations");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.Formatter");
bwm.view.BaseController.extend("bwm.view.Invitations", {
    // controller logic goes here
    onInit: function () {

    },
    onBeforeRendering: function () {},
    onAfterRendering: function () {
    	
    },
    getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },
    toInvitationsMap: function() {
        this.getRouter().navTo("invitationsMap");
    },
    toMine: function() {
        this.getRouter().navTo("mine");
    }

});
