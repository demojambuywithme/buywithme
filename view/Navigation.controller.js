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
    },
    toInvitationsMap: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.InvitationsMap",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toInvitationDetail: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.InvitationDetail",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toInvitationDetailMap: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.InvitationDetailMap",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toNewInvitation: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.NewInvitation",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toChat: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.Chat",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toMine: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.Mine",
            targetViewType: "XML",
            transition: "slide"
        });
    },
    toLogon: function () {
        this.getRouter().myNavToWithoutHash({
            currentView: this.getView(),
            targetViewName: "bwm.view.Logon",
            targetViewType: "XML",
            transition: "slide"
        });
    }
});
