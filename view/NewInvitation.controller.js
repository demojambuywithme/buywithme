jQuery.sap.declare("bwm.view.NewInvitation");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.UtilMethod");

bwm.view.BaseController.extend("bwm.view.NewInvitation", {
	
	 oView : null,
	
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
        //@TODO 替换成获取真实当前地址
        var point = new BMap.Point(121.608265, 31.20729); //Sap labs China
        // 
        var geoc = new BMap.Geocoder();
        //@TODO 测试，拿到当前输入搜索地址列表
        var ac = new BMap.Autocomplete( //建立一个自动完成的对象
            {
                "input": "静安寺",
                "location": map
            });
        //@TODO: 关键字检索功能
        //var map = new BMap.Map("allmap");
        //map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        /*
        var options = {
            onSearchComplete: function(results) {
                // 判断状态是否正确
                if (local.getStatus() == 0 ) {
                    var s = [];
                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                        s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                    }
                    //document.getElementById("r-result").innerHTML = s.join("<br/>");
                }
            }
        };
        var local = new BMap.LocalSearch(map, options);
        local.search("厕所");
        */

        //测试结束
        var pt = point;
        var abc = this.getView().byId("link01");
        geoc.getLocation(pt, function(rs) {
            var addComp = rs.addressComponents;
            var locDetail = addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            //@TODO 替换成用真实ID拿link01，不应用__xmlview2--link01，runtime有时候会变
            var olink1 = sap.ui.getCore().byId("__xmlview2--link01");
            //var olink1 = this.getView().byId("link01");
            olink1.setText(locDetail);
        });
        sap.m.MessageToast.show(sMessage);
    },
    //Dialog with a selection list to select a accurate location
    handleLocation1: function(oEvent) {
        if (this.oCurLocDialog) {
            this.oCurLocDialog.destroy();
        }
        this.oCurLocDialog = sap.ui.xmlfragment("bwm.fragment.CurrentLocSel", this);
        this.getView().addDependent(this.oCurLocDialog);
        this.oCurLocDialog.open();
    },


    //CY03
    //Create a json model for new invitation data
    initializeNewInvitationData: function() {
        var invGuid = bwm.util.UtilMethod.guid();
        this.getView().getModel("newInvitation").setData({
            Invitation: {
                valid_in: "2",
                //@TODO Question: Creator.id needs to be replaced; and do I need to create invGuid manually?
                "creator.id": "4defa41b7b934dab9f36627b32fb7bb7", //User Jiang, Xin
                status: "1",
                id: invGuid,
                total_quantity: "3",
                discount: 0.3
            }
        });
    },

    //CY02
    //When click "Add picture", popup a dialog for user to select the way to add pictures
    //There will be two options: <1>Taking a photo <2>Picking from gallery
    onPhotoDataSuccess: function(imageData) {
        var myCarousel = oView.byId("myImage");
        var newImage = new sap.m.Image();
        var layoutData = new sap.m.FlexItemData();
      	layoutData.setAlignSelf( sap.m.FlexAlignSelf.Stretch );
      	newImage.setWidth("200px");
      	newImage.setHeight("200px");
      	newImage.setSrc("data:image/jpeg;base64," + imageData);
        newImage.setLayoutData(layoutData);
        myCarousel.addPage(newImage);
    },

    onPhotoURISuccess: function(imageURI) {
		var myCarousel = oView.byId("myImage");
        var newImage = new sap.m.Image();
        var layoutData = new sap.m.FlexItemData();
    	layoutData.setAlignSelf( sap.m.FlexAlignSelf.Stretch );
        newImage.setWidth("200px");
    	newImage.setHeight("200px");
        newImage.setSrc(imageURI);
        newImage.setLayoutData(layoutData);
        myCarousel.addPage(newImage);
    },
    onPhotoFail: function(message) {
        alert("Failed because: " + message);
    },
    onPhotoDialogPress: function(oEvent) {
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
                    width: "200px", // sap.ui.core.CSSSize
                    enabled: true, // boolean
                    //icon : undefined, // sap.ui.core.URI
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

    getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    saveInvitation: function(nID) {
    	
    	var batchChanges = [];
    	var oModel = this.getView().getModel();
        var mNewInvitation = this.getView().getModel("newInvitation").getData().Invitation;
        var discountTypeId = this.getView().byId("discountType_select").getSelectedKey();
        var categortid = this.getView().byId("catrogry_select").getSelectedKey();
        // Basic payload data
        var mNewInv = {
            //替换
        	id: nID,
            title: mNewInvitation.title,
            status: 1,
            "creator.id": "877da535455a47b893b19e9ab8a1f2c2",
            "category.id": categortid,
            "discountType.id": discountTypeId,
            total_quantity: mNewInvitation.total_quantity,
           // discount: mNewInvitation.discount,
            total_money: mNewInvitation.total_money,
            return_money: mNewInvitation.return_money,
            //create_time: mNewInvitation.create_time,
            //valid_in: mNewInvitation.valid_in,
            //end_time: mNewInvitation.end_time,
            longitude: mNewInvitation.longitude,
            latitude: mNewInvitation.latitude,
            address: mNewInvitation.address
        };

        if (mNewInv.valid_in) {
            //mNewInv.end_time = 1;
        }
        
        batchChanges.push(oModel.createBatchOperation("/Invitation", "POST", mNewInv) );
        
        var invatationItem = {
        		inv_id:  bwm.util.UtilMethod.guid(),
        		"inv_head.id": nID,
        		"joiner.id" : mNewInv['creator.id'],
        		quantity: this.getView().byId("piece01").getValue(),
        		money: this.getView().byId("dis_money").getNumber()	
        };
        
        batchChanges.push(oModel.createBatchOperation("/InvitationItem", "POST", invatationItem) );
        
        var myCarousel = this.getView().byId("myImage");
        var images = myCarousel.getPages();
        var invPics=[];
        for(var i=0;i<images.length;i++){
        	if (images[i] instanceof sap.m.Image) {
        		var imageData = '';
        		if(images[i].getSrc().search('image/png')) {
        			imageData = images[i].getSrc().replace("data:image/png;base64,","");
        		}else if (images[i].getSrc().search('image/jpeg')) {
        			imageData = images[i].getSrc().replace("data:image/jpeg;base64,","");
        		}
        		 
		    	var image = {
		    		id: bwm.util.UtilMethod.guid(),
		    		"inv_head.id":nID,
		    		pic_data: imageData
		    	};
		    	invPics.push(image);
		    	batchChanges.push(oModel.createBatchOperation("/InvitationPicture", "POST", image) );
        	}
        };
        
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
/*            //@TODO: Later on this should navigate to invitation list
            this.onNavButtonPressed();
            sap.m.MessageToast.show("Data Saved!");*/
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
        var discLabel = sap.ui.getCore().byId("__select1");
        discLabel.setValue(selectLable);
    },
    onDiscDialogClose: function() {
        this.oDiscDetailDialog.destroy();
    },
    /*
    onCancel : function() {
        sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
    },
    */
    onNavButtonPressed: function() {
        this.getRouter().backWithoutHash(this.getView());
        sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
    },

    onSelect: function(oEvent) {
        "use strict";
        var params = oEvent.getParameters();
        var sMessage = "New Variant Selected: " + params.key;
        sap.m.MessageToast.show(sMessage);
    },
    showErrorAlert : function(sMessage) {
		jQuery.sap.require("sap.m.MessageBox");	
		sap.m.MessageBox.alert(sMessage);				
	}
});
