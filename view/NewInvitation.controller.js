jQuery.sap.declare("bwm.view.NewInvitation");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.NewInvitation", {
    //When click "Where are you", system will automatically populate the link with current location
    handleLocation: function(oEvent) {
        "use strict";
        var testLink = new sap.m.Link({
            id: "link02", // sap.ui.core.ID
            text: "Test Link", // string
        });
        var olink2 = sap.ui.getCore().byId("link02");

        var sMessage = "You current location is determined";
        sap.m.MessageToast.show(sMessage);

        var map = new BMap.Map("allmap");
        var point = new BMap.Point(121.608265, 31.20729); //Sap labs China
        // 
        var geoc = new BMap.Geocoder();
        var pt = point;
        var abc = [];
        geoc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            var locDetail = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            var olink1 = sap.ui.getCore().byId("__xmlview2--link01");
            //var olink1 = this.getView().byId("link01");
            olink1.setText(locDetail);
        });
    },


    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function() {

        if (this._oPopover) {
            this._oPopover.destroy();
        }

    },

    onDialogPress: function(oEvent) {
        var dialog = new sap.m.Dialog({
            title: 'Add picture by...',
            content: new sap.m.Button({
                id: "buttonNI001", // sap.ui.core.ID
                busyIndicatorDelay: 1000, // int
                text: "Taking a photo", // string
                type: sap.m.ButtonType.Default, // sap.m.ButtonType
                width: "200px", // sap.ui.core.CSSSize
                enabled: true, // boolean
                //icon : undefined, // sap.ui.core.URI
                press: [function(oEvent) {
                    var control = oEvent.getSource();
                }, this]
            }),

            beginButton: new sap.m.Button({
                text: 'Close',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }

        });
        //to get access to the global model
        this.getView().addDependent(dialog);
        dialog.open();
        //===============Open by fragment======================
        /*if (!this._oPopover) {
            this._oPopover = sap.ui.xmlfragment("bwm.fragment.PhotoPick", this);

            //to get access to the global model
            this.getView().addDependent(this.oPopover);
        }
        
        // delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
        var oButton1 = oEvent.getSource();
        jQuery.sap.delayedCall(0, this, function() {
            this._oPopover.openBy(oButton1);
        });*/
    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf bwm.view.home
     */
    onBeforeRendering: function() {

    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf bwm.view.home
     */
    onAfterRendering: function() {

    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bwm.view.home
     */
    onExit: function() {

    },

    getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },


    onSave: function(oEvent) {
        "use strict";
        jQuery.sap.require("sap.m.MessageToast");
        var params = oEvent.getParameters();
        var sMessage = "New Name: " + params.name + "\nDefault: " + params.def + "\nOverwrite:" + params.overwrite + "\nSelected Item Key: " + params.key;
        sap.m.MessageToast.show(sMessage);
    },
    onManage: function(oEvent) {
        "use strict";
        jQuery.sap.require("sap.m.MessageToast");
        var params = oEvent.getParameters();
        var renamed = params.renamed;
        var deleted = params.deleted;
        var sMessage = "renamed: \n";
        for (var h = 0; h < renamed.length; h++) {
            sMessage += renamed[h].key + "=" + renamed[h].name + "\n";
        }
        sMessage += "\n\ndeleted: ";
        for (var f = 0; f < deleted.length; f++) {
            sMessage += deleted[f] + ",";
        }

        sap.m.MessageToast.show(sMessage);
    },
    onSelect: function(oEvent) {
        "use strict";
        var params = oEvent.getParameters();
        var sMessage = "New Variant Selected: " + params.key;
        sap.m.MessageToast.show(sMessage);
    }



});
