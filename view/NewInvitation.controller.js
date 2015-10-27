jQuery.sap.declare("bwm.view.NewInvitation");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.UtilMethod");
var curLocList;
var curLongitude;
var curLatitude;
var oView;

bwm.view.BaseController.extend("bwm.view.NewInvitation", {

    oView: null,

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function() {
        //Initialization for new invitation
        if (this._oPopover) {
            this._oPopover.destroy();
        }
        this.getView().setModel(new sap.ui.model.json.JSONModel(), "newInvitation");
        this.initializeNewInvitationData();
        oView = this.getView();
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

    //CY01
    //When click "Where are you", system will automatically populate the link with current location
    handleLocation: function(oEvent) {
        "use strict";

        var sMessage = "You current location is determined";
        sap.m.MessageToast.show(sMessage);
        var map = new BMap.Map("allmap");

        //var curLoc = this.getView().getModel("currentLoc").getData();
        var geolocation = new BMap.Geolocation();
        var oView = this;
        geolocation.getCurrentPosition(function(r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                curLongitude = r.point.lng;
                curLatitude = r.point.lat;
                var mapUrl = "http://api.map.baidu.com/geocoder/v2/?ak=CD70726d5902ec38d1e1a9e7d249d923&callback=renderReverse&location=" + curLatitude + "," + curLongitude + "&output=json&pois=1";
                jQuery.ajax({
                    //type: "post",
                    //TO DO, Add real latitude and longitude into it

                    //url: "http://api.map.baidu.com/geocoder/v2/?ak=CD70726d5902ec38d1e1a9e7d249d923&callback=renderReverse&location=31.20729,121.608265&output=json&pois=1",
                    url: mapUrl,
                    dataType: "jsonp",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        var locList = [];
                        var locSingle;
                        var result = data.result.pois;

                        curLocList = data.result.pois.map(function(el) {
                            return {
                                locationName: el.name
                            };
                        });
                        //CY
                        //Below part is to rasie a popup window to show all possible locations
                        if (oView.oCurLocDialog) {
                            oView.oCurLocDialog.destroy();
                        }

                        var aModel = new sap.ui.model.json.JSONModel(curLocList);
                        // oView.getView().setModel(new sap.ui.model.json.JSONModel(), "locListDialog");
                        // oView.getView().getModel("locListDialog").setData(loclisttest);
                        oView.oCurLocDialog = sap.ui.xmlfragment("bwm.fragment.CurrentLocSel", oView);
                        oView.oCurLocDialog.setModel(aModel, "locListDialog");
                        oView.getView().addDependent(this.oCurLocDialog);
                        oView.oCurLocDialog.open();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert("Oh no, an error occurred");
                    }
                });
            } else {
                alert('failed' + this.getStatus());
            }
        }, {
            enableHighAccuracy: true,
        });
    },

    //
    handleClose: function(oEvent) {
        var aItem = oEvent.getParameters("selectedItem");
        if (aItem) {
            var locLink = this.getView().byId("link01");
            locLink.setText(aItem.selectedItem.mProperties.description);
        }
    },

    //CY03
    //Create a json model for new invitation data
    initializeNewInvitationData: function() {
        var invGuid = bwm.util.UtilMethod.guid();
        this.getView().getModel("newInvitation").setData({
            Invitation: {
                valid_in: "2",
                //@TODO Question: Creator.id needs to be replaced; and do I need to create invGuid manually?
                //"creator.id": "4defa41b7b934dab9f36627b32fb7bb7", //User Jiang, Xin
                //"creator.id": creatorGuid,
                status: "1",
                id: invGuid,
                total_quantity: null,
                total_money: null,
                return_money : null,
            }
        });
    },

    //CY02
    //When click "Add picture", popup a dialog for user to select the way to add pictures
    //There will be two options: <1>Taking a photo <2>Picking from gallery
    onPhotoDataSuccess: function(imageData) {
        var myCarousel = oView.byId("myImage");
/*        var carouselWidth = myCarousel.getWidth();
        if (carouselWidth == "0px") {
            myCarousel.setWidth("180px");
        }*/
        var newImage = new sap.m.Image();
        var layoutData = new sap.m.FlexItemData();
        layoutData.setAlignSelf(sap.m.FlexAlignSelf.Stretch);
        newImage.setWidth("200px");
        newImage.setHeight("200px");
        newImage.setSrc("data:image/png;base64," + imageData);
        newImage.setLayoutData(layoutData);
        myCarousel.addPage(newImage);
    },

    onPhotoURISuccess: function(imageURI) {
        var myCarousel = oView.byId("myImage");
/*        var carouselWidth = myCarousel.getWidth();
        if (carouselWidth == "0px") {
            myCarousel.setWidth("180px");
        }*/
        var newImage = new sap.m.Image();
        var layoutData = new sap.m.FlexItemData();
        layoutData.setAlignSelf(sap.m.FlexAlignSelf.Stretch);
        newImage.setWidth("200px");
        newImage.setHeight("200px");
        newImage.setSrc(imageURI);
        newImage.setLayoutData(layoutData);
        myCarousel.addPage(newImage);
    },
    onPhotoFail: function(message) {
        //alert("Failed because: " + message);
    },
    onPhotoDialogPress: function(oEvent) {
        var dialog = new sap.m.Dialog({
            title: 'Add picture by...',
            content: [new sap.m.Button({
                    id: "buttonNI001", // sap.ui.core.ID
                    busyIndicatorDelay: 1000, // int
                    text: "Taking a photo", // string
                    type: sap.m.ButtonType.Default, // sap.m.ButtonType
                    width: "290px", // sap.ui.core.CSSSize
                    enabled: true,
                    "class": "sapUiLargeMarginBegin",
                    icon: sap.ui.core.IconPool.getIconURI("camera"), // sap.ui.core.URI
                    iconFirst: true,
                    press: [
                        function(oEvent) {
                            var control = oEvent.getSource();
                            var oNav = navigator.camera;
                            oNav.getPicture(this.onPhotoDataSuccess, this.onPhotoFail, {
                                quality: 50,
                                destinationType: oNav.DestinationType.DATA_URL
                            });
                            dialog.close();
                        },
                        this
                    ]
                }),
                new sap.m.Button({
                    id: "buttonNI002", // sap.ui.core.ID
                    busyIndicatorDelay: 1000, // int
                    text: "Picking from gallery", // string
                    type: sap.m.ButtonType.Default, // sap.m.ButtonType
                    width: "290px", // sap.ui.core.CSSSize
                    enabled: true, // boolean
                    icon: sap.ui.core.IconPool.getIconURI("background"), // sap.ui.core.URI
                    iconFirst: true,
                    press: [
                        function(oEvent) {
                            var control = oEvent.getSource();
                            var oNav = navigator.camera;
                            oNav.getPicture(this.onPhotoURISuccess, this.onPhotoFail, {
                                quality: 50,
                                destinationType: oNav.DestinationType.FILE_URI,
                                sourceType: oNav.PictureSourceType.PHOTOLIBRARY
                            });
                            dialog.close();
                        },
                        this
                    ]
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
    },

    getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    saveInvitation: function(invGUID) {

        //Creator ID
        var creatorGuid = this.getView("bwm.view.Logon").getModel("user").getData().uuid;
        var batchChanges = [];
        var oModel = this.getView().getModel();
        var mNewInvitation = this.getView().getModel("newInvitation").getData().Invitation;
        var discountTypeId = this.getView().byId("discountType_select").getSelectedKey();
        //@BWM
        var curPC = this.getView().byId("piece01").getValue();
        var progress_value = curPC + "/" + parseInt(mNewInvitation.total_quantity); 
        var percentage = parseInt(curPC / parseInt(mNewInvitation.total_quantity) * 100);
        //
        var categortid = this.getView().byId("catrogry_select").getSelectedKey();
        // Basic payload data
        //Time
        var myData = new Date();
        var myFromTime = Date.parse(new Date());
        var valid_period = mNewInvitation.valid_in * 3600 * 1000;
        var myToTime = myFromTime + valid_period;
        //var toTime  = new Date(myToTime);
        
        valid_period = valid_period / 1000 / 60;

        var discNew = 0.00;
        if (mNewInvitation.discount == "10%") {
            discNew = 0.90;
        }
        if (mNewInvitation.discount == "20%") {
            discNew = 0.80;
        }
        if (mNewInvitation.discount == "30%") {
            discNew = 0.70;
        }
        if (mNewInvitation.discount == "40%") {
            discNew = 0.60;
        }
        if (mNewInvitation.discount == "50%") {
            discNew = 0.50;
        }
        if (mNewInvitation.discount == "60%") {
            discNew = 0.40;
        }
        if (mNewInvitation.discount == "70%") {
            discNew = 0.30;
        }
        if (mNewInvitation.discount == "80%") {
            discNew = 0.20;
        }
        if (mNewInvitation.discount == "90%") {
            discNew = 0.10;
        }
         
        var fromDateTS = "/Date("+myFromTime+")/";
        var toDateTS   = "/Date("+myToTime+")/";
        var mNewInv = {
            //替换
            id: invGUID,
            title: mNewInvitation.title,
            status: 1,
            //"creator.id": "877da535455a47b893b19e9ab8a1f2c2",
            "creator.id": creatorGuid,
            "category.id": categortid,
            "discountType.id": discountTypeId,
            total_quantity: parseInt(mNewInvitation.total_quantity),
            discount: discNew+"",
            total_money: mNewInvitation.total_money,
            return_money: mNewInvitation.return_money,
            create_time: fromDateTS,
            valid_in: valid_period,
            end_time: toDateTS,
            longitude: curLongitude + "",
            latitude: curLatitude + "",
            address: this.getView().byId("link01").getText(),
            //@BWM
            percentage: percentage +"",
            progress_value: progress_value + "",
        };

        if (mNewInv.valid_in) {
            //mNewInv.end_time = 1;
        }

        batchChanges.push(oModel.createBatchOperation("/Invitation", "POST", mNewInv));

        var invatationItem = {
            inv_id: bwm.util.UtilMethod.guid(),
            "inv_head.id": invGUID,
            "joiner.id": mNewInv['creator.id'],
            quantity: this.getView().byId("piece01").getValue(),
            money: this.getView().byId("discountAmount01").getNumber()
        };

        batchChanges.push(oModel.createBatchOperation("/InvitationItem", "POST", invatationItem));

        var myCarousel = this.getView().byId("myImage");
        var images = myCarousel.getPages();
        var invPics = [];
        for (var i = 0; i < images.length; i++) {
            if (images[i] instanceof sap.m.Image) {
                var imageData = '';
                if (images[i].getSrc().search('image/png')) {
                    imageData = images[i].getSrc().replace("data:image/png;base64,", "");
                } else if (images[i].getSrc().search('image/jpeg')) {
                    imageData = images[i].getSrc().replace("data:image/jpeg;base64,", "");
                }else{
                	imageData = images[i].getSrc().replace("data:image/png;base64,", "");
                }

                var image = {
                    id: bwm.util.UtilMethod.guid(),
                    "inv_head.id":invGUID,
                    pic_name: null,
                    pic_path: null,
                    pic_data: imageData
                };
                invPics.push(image);
                batchChanges.push(oModel.createBatchOperation("/InvitationPicture", "POST", image));
            }
        }

        oModel.addBatchChangeOperations(batchChanges);
        oModel.setUseBatch(true);
        oModel.submitBatch(
            jQuery.proxy(function(data) {
                console.log(data);
                oModel.refresh();
                this.initializeNewInvitationData();
                //@TODO will navigation to the detail Invitation
                //sap.ui.core.UIComponent.getRouterFor(this).navTo();
                //currently, navigation to Main
                this.onNavButtonPressed();
                jQuery.sap.require("sap.m.MessageToast");
                // ID of newly inserted product is available in mResponse.ID
                this.oBusyDialog.close();
                sap.m.MessageToast.show("Invitation '" + mNewInv.title + "' published");
            }, this),

            jQuery.proxy(function(err) {
                console.log(err);
                this.oBusyDialog.close();
                this.showErrorAlert("Problem publishing new invitation");
            }, this)
        );

    },
    //@TODO: Check whether it is correct?
    onPublish: function() {
        // Show message if no product name has been entered
        // Otherwise, get highest existing ID, and invoke create for new product
        if (!this.getView().getModel("newInvitation").getProperty("/Invitation/title")) {
            // this.oAlertDialog.open();
            sap.m.MessageToast.show("Data Error!");
        } else {
            if (!this.oBusyDialog) {
                this.oBusyDialog = new sap.m.BusyDialog();
            }
           this.saveInvitation(this.getView().getModel("newInvitation").getProperty("/Invitation/id"));
            //this.saveInvitation();
            //@TODO: Later on this should navigate to invitation list
            // this.onNavButtonPressed();
            // sap.m.MessageToast.show("Invitation Published!");
        }
    },
    //For discount details, to maintain value X and Y
    onNavToDisType: function() {
        if (this.oDiscDetailDialog) {
            this.oDiscDetailDialog.destroy();
        }
        this.oDiscDetailDialog = sap.ui.xmlfragment("bwm.fragment.DiscountTypeDetail", this);
        this.getView().addDependent(this.oDiscDetailDialog);
        this.oDiscDetailDialog.open();
    },
    onDiscDialogConfirm: function() {
        this.oDiscDetailDialog.close();
        var total_quantity = this.getView().getModel("newInvitation").getData().Invitation.total_quantity;
        var discount = this.getView().getModel("newInvitation").getData().Invitation.discount;
        var selectLable = "Buy" + " " + total_quantity + " " + "PC" + " " + discount + " " + "OFF";
        // var discLabel = sap.ui.getCore().byId("__xmlview2--discountType_select");
        var discLabel = oView.byId("discountType_select");
        discLabel.setValue(selectLable);
    },
    onDiscDialogClose: function() {
        this.oDiscDetailDialog.destroy();
    },

    //For value helps
    //Value help for "I want to buy ? PC"
    handlePCValueHelp: function(oEvent) {
        var oView = this;
        oView.inputId = oEvent.getSource().getId();
        // create value help dialog
        if (!oView.oPCDialog) {
            //Initialization for PC value help
            var oModelPC = new sap.ui.model.json.JSONModel("./model/Pieces.json");
            oView.oPCDialog = sap.ui.xmlfragment("bwm.fragment.PCDialog", oView);
            oView.oPCDialog.setModel(oModelPC, "PCValueHelpDialog");
            oView.getView().addDependent(oView.oPCDialog);
        }
        // open value help dialog filtered by the input value
        oView.oPCDialog.open();
    },

    _handlePCValueHelpClose: function(evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var PCInput = this.getView().byId("piece01");
            PCInput.setValue(oSelectedItem.getTitle());
        }

    },

    //Value help for discount details: Buy X PCs Y Off => X
    handleDPCValueHelp: function(oEvent) {
        var oView = this;
        // create value help dialog
        if (!oView.oDPCDialog) {
            //Initialization for PC value help
            var oModelDPC = new sap.ui.model.json.JSONModel("./model/Pieces.json");
            oView.oDPCDialog = sap.ui.xmlfragment("bwm.fragment.DPCDialog", oView);
            oView.oDPCDialog.setModel(oModelDPC, "DPCValueHelpDialog");
            oView.getView().addDependent(oView.oDPCDialog);
        }
        // open value help dialog filtered by the input value
        oView.oDPCDialog.open();
    },

    _handleDPCValueHelpClose: function(evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var piece = oSelectedItem.getTitle();
            this.getView().getModel("newInvitation").setProperty("/Invitation/total_quantity", piece);
            //PCInput.setNumber(oSelectedItem.getTitle());
        }

    },
    //Value help for discount details: Buy X PCs Y Off => X
    handleDRTValueHelp: function(oEvent) {
        var oView = this;
        // create value help dialog
        if (!oView.oDRTDialog) {
            //Initialization for PC value help
            var oModelDRT = new sap.ui.model.json.JSONModel("./model/DiscValueHelp.json");
            oView.oDRTDialog = sap.ui.xmlfragment("bwm.fragment.DRTDialog", oView);
            oView.oDRTDialog.setModel(oModelDRT, "DRTValueHelpDialog");
            oView.getView().addDependent(oView.oDPCDialog);
        }
        // open value help dialog filtered by the input value
        oView.oDRTDialog.open();
    },

    _handleDRTValueHelpClose: function(evt) {
        var oSelectedItem = evt.getParameter("selectedItem");
        if (oSelectedItem) {
            var disc = oSelectedItem.getTitle();
            this.getView().getModel("newInvitation").setProperty("/Invitation/discount", disc);
            //PCInput.setNumber(oSelectedItem.getTitle());
        }

    },
    //Calculate Amount
    handleAmountChange: function(oEvent) {
        var newValue = oEvent.getParameter("value");
        var discountAmount = this.getView().byId("discountAmount01");

        var disc = this.getView().getModel("newInvitation").getData().Invitation.discount;
        if (disc == "10%") {
            newValue = newValue * 0.9;
        }
        if (disc == "20%") {
            newValue = newValue * 0.8;
        }
        if (disc == "30%") {
            newValue = newValue * 0.7;
        }
        if (disc == "40%") {
            newValue = newValue * 0.6;
        }
        if (disc == "50%") {
            newValue = newValue * 0.5;
        }
        if (disc == "60%") {
            newValue = newValue * 0.4;
        }
        if (disc == "70%") {
            newValue = newValue * 0.3;
        }
        if (disc == "80%") {
            newValue = newValue * 0.2;
        }
        if (disc == "90%") {
            newValue = newValue * 0.1;
        }
        newValue = newValue.toFixed(2);
        discountAmount.setNumber(newValue);
    },

    //For location list selection close
    /*
    onCancel : function() {
        sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
    },
    */
    // onNavButtonPressed: function() {
    //     //this.getRouter().navTo("invitations");

    //     this.onNavBack();
    // },

    onSelect: function(oEvent) {
        "use strict";
        var params = oEvent.getParameters();
        var sMessage = "New Variant Selected: " + params.key;
        sap.m.MessageToast.show(sMessage);
    },
    showErrorAlert: function(sMessage) {
        jQuery.sap.require("sap.m.MessageBox");
        sap.m.MessageBox.alert(sMessage);
    }
});
