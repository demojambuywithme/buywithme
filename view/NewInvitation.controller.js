jQuery.sap.declare("bwm.view.NewInvitation");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.NewInvitation", {
    //CY01
    //When click "Where are you", system will automatically populate the link with current location
    handleLocation: function(oEvent) {
        "use strict";
        var testLink = new sap.m.Link({
            id: "link02", // sap.ui.core.ID
            text: "Test Link" // string
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

    //CY03
    //Create a json model for new invitation data
    initializeNewInvitationData : function() {
        this.getView().getModel("newInvitation").setData({
            Invitation: {
                valid_in: "ab",
                title: "xcy"
            }
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
        this.getView().setModel(new sap.ui.model.json.JSONModel(), "newInvitation");
        this.initializeNewInvitationData();
    },

    //CY02
    //When click "Add picture", popup a dialog for user to select the way to add pictures
    //There will be two options: <1>Taking a photo <2>Picking from gallery
    onPhotoDataSuccess: function(imageData) {
            var oView = {};
        oView = this.getView();
        var myImage = oView.byId("myImage");
        myImage.setSrc("data:image/jpeg;base64," + imageData);
    },

    onPhotoURISuccess: function(imageURI) {
                    var oView = {};
        oView = this.getView();
        var myImage = oView.byId("myImage");
        myImage.setSrc(imageURI);
    },
    onFail: function(message) {
        console.log("Failed because: " + message);
    },
    onDialogPress: function(oEvent) {
        var dialog = new sap.m.Dialog({
            title: 'Add picture by...',
            content: [new sap.m.Button({
                    id: "buttonNI001", // sap.ui.core.ID
                    busyIndicatorDelay: 1000, // int
                    text: "Taking a photo", // string
                    type: sap.m.ButtonType.Default, // sap.m.ButtonType
                    width: "200px", // sap.ui.core.CSSSize
                    enabled: true,
                    //icon : undefined, // sap.ui.core.URI
                    press: [
                        function(oEvent) {
                            var control = oEvent.getSource();
                            var oNav = navigator.camera;
                            oNav.getPicture(this.onPhotoDataSuccess, this.onFail, {
                                quality: 10,
                                destinationType: oNav.DestinationType.DATA_URL
                            });
                    },
                        this]
                }),
                new sap.m.Button({
                    id: "buttonNI002", // sap.ui.core.ID
                    busyIndicatorDelay: 1000, // int
                    text: "Picking from gallery", // string
                    type: sap.m.ButtonType.Default, // sap.m.ButtonType
                    width: "200px", // sap.ui.core.CSSSize
                    enabled: true, // boolean
                    //icon : undefined, // sap.ui.core.URI
                    press: [
                        function(oEvent) {
                            var control = oEvent.getSource();
                            var oNav = navigator.camera;
                            oNav.getPicture(this.onPhotoURISuccess, this.onFail, {
                                quality: 50,
                                destinationType: oNav.DestinationType.FILE_URI,
                                sourceType: oNav.PictureSourceType.PHOTOLIBRARY
                            });
                    },
                        this]
                })
            ],
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
        var sMessage = "New Name: " + params.name + "\nDefault: " + params.def + "\nOverwrite:" + params.overwrite + "\nSelected Item Key: " +
            params.key;
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

/*
        saveInvitation : function(nID) {
        var mNewInvitation = this.getView().getModel("newInvitation").getData().Invitation;
        // Basic payload data
        var mNewInvitation = {
            ID: nID,
            Name: mNewProduct.Name,
            Description: mNewProduct.Description,
            ReleaseDate: this.dateFromString(mNewProduct.ReleaseDate),
            Price: mNewProduct.Price.toString(),
            Rating: mNewProduct.Rating
        };

        if (mNewProduct.DiscontinuedDate) {
            mPayload.DiscontinuedDate = this.dateFromString(mNewProduct.DiscontinuedDate);
        };
        ["Supplier", "Category"].forEach(function(sRelation) {
            var oSelect = this.getView().byId("idSelect" + sRelation);
            var sPath = oSelect.getSelectedItem().getBindingContext().getPath();
            mPayload[sRelation] = {
                __metadata: {
                    uri: sPath
                }
            };
        }, this);
        console.log(mPayload);
        // Send OData Create request
        var oModel = this.getView().getModel();
        oModel.create("/Products", mPayload, {
            success : jQuery.proxy(function(mResponse) {
                this.initializeNewProductData();            
                sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
                    from: "master",
                    product: "Products(" + mResponse.ID + ")",
                    tab: "supplier"
                }, false);
                jQuery.sap.require("sap.m.MessageToast");
                // ID of newly inserted product is available in mResponse.ID
                this.oBusyDialog.close();
                sap.m.MessageToast.show("Product '" + mPayload.Name + "' added");
            }, this),
            error : jQuery.proxy(function() {
                this.oBusyDialog.close();
                this.showErrorAlert("Problem creating new product");
            }, this)
        });

    },
*/

    /*
    onSave : function() {
        // Show message if no product name has been entered
        // Otherwise, get highest existing ID, and invoke create for new product
        if (!this.getView().getModel("newProduct").getProperty("/Detail/Name")) {
            if (!this.oAlertDialog) {
                this.oAlertDialog = sap.ui.xmlfragment("com.ui5.start.view.NameRequiredDialog", this);
                this.getView().addDependent(this.oAlertDialog);
            }
            this.oAlertDialog.open();
        } else {
            if (!this.oBusyDialog) {
                this.oBusyDialog = new sap.m.BusyDialog();
            }
            this.oBusyDialog.open();
            this.getView().getModel().read("/Products", {
                urlParameters : {
                    "$top" : 1,
                    "$orderby" : "ID desc",
                    "$select" : "ID"
                },
                async : false,
                success : jQuery.proxy(function(oData) {
                    this.saveProduct(oData.results[0].ID + 1);
                }, this),
                error : jQuery.proxy(function() {
                    this.oBusyDialog.close();
                    this.showErrorAlert("Cannot determine next ID for new product");
                }, this)
            });

        }
    },
    */

    /*
    onCancel : function() {
        sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
    },
    */
    onNavButtonPressed: function () {
        this.getRouter().backWithoutHash(this.getView());
        sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
    },

    onSelect: function(oEvent) {
        "use strict";
        var params = oEvent.getParameters();
        var sMessage = "New Variant Selected: " + params.key;
        sap.m.MessageToast.show(sMessage);
    }

});