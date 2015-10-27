jQuery.sap.declare("bwm.view.Invitations");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.Formatter");
bwm.view.BaseController.extend("bwm.view.Invitations", {
    // controller logic goes here
    onInit: function() {
        this.getView().addEventDelegate({
            onBeforeShow: $.proxy(this.onBeforeShow, this)
        });
    },
    onBeforeShow: function() {
        this.getView().getModel().refresh();
    },

    toInvitationsMap: function() {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.InvitationsMap",
            targetViewType: "XML",
            transition: "slide",
        });
    },
    toMine: function() {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.Mine",
            targetViewType: "XML",
            transition: "slide",
        });
    },
    onDisplay: function(oEvent) {
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
    },
    onGlobe: function(oEvent) {},
    onAdd: function() {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.NewInvitation",
            targetViewType: "XML",
            transition: "slide",
        });
    },
    _readInvitations: function() {
        var dfd = $.Deferred();
        this.getComponent().getModel().read('/Invitation', {
            success: $.proxy(function(data) {
                dfd.resolve(data.results);
            }, this)
        });

        return dfd.promise();
    }
});
