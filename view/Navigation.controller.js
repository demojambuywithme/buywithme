jQuery.sap.declare("bwm.view.Navigation");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Navigation", {
    toInvitations: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.Invitations",
            targetViewType: "XML",
            transition: "slide"
        });
    }
});