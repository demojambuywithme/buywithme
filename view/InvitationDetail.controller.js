jQuery.sap.declare("bwm.view.InvitationDetail");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.UtilMethod");


var invitation_item_id = "";
var hasJoined = false;
var invitationItems = "";
var invitation_item = "";
bwm.view.BaseController.extend("bwm.view.InvitationDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf bwm.view.home
	 */
	onInit: function () {
		//		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//		oRouter.getRoute("invitation").attachPatternMatched(
		//				this._onObjectMatched, this);
		// this.getRouter().getRoute('invitationDetail').attachMatched(
		// 	this._onObjectMatched, this);

		this.getView().addEventDelegate({
			onBeforeShow: $.proxy(this.onBeforeShow, this)
		});
		//	    if(this.getView().getModel("user").getData().id == invitation_data.creator.id){
		//	    	this.getView().byId("joinInv").setVisible("false");
		//	    }else{
		//	    	this.getView().byId("quitInv").setVisible("false");
		//	    }
	},
	onBeforeShow: function (oEvt) {
		this.invitation_id = oEvt.data.invitation;

		this.getView().bindElement({
			// path: "/" + oEvent.getParameter("arguments").invitation
			path: "/Invitation('" + this.invitation_id + "')"
		});


		this.getView().getModel().read("/Invitation('" + this.invitation_id + "')", {
			success: $.proxy(function (data) {
				this.invitation_data = data;
				this.calculateCost();
				if (this.getView().getModel("user").getData().uuid == this.invitation_data["creator.id"]) {
					this.setJoinButtonVisible(false);
					this.setCancelButtonVisible(false);
					this.setCloseButtonVisible(true);
				} else {
					this.setJoinCancelBtnForJoiner();
				}
			}, this)
		});
	},

	setJoinCancelBtnForJoiner: function () {
		var logonUserGUID = this.getView().getModel("user").getData().uuid;
		this.getView().getModel().read("/Invitation('" + this.invitation_id + "')/InvitationItems", {
			success: jQuery.proxy(function (data) {
				console.log(data);
			    invitationItems = data;
				//var hasJoined = false;
				for (var i = 0; i < data.results.length; i++) {
					if (data.results[i]["joiner.id"] == logonUserGUID) {
						hasJoined = true;
						invitation_item_id = data.results[i]["inv_id"];
						invitation_item = data.results[i];
						break;
					}
				}
				if (hasJoined) {
					this.setJoinButtonVisible(false);
					this.setCancelButtonVisible(true);
					this.setCloseButtonVisible(false);
				} else {
					this.setJoinButtonVisible(true);
					this.setCancelButtonVisible(false);
					this.setCloseButtonVisible(false);
				}
			}, this)
		});
	},

	discountFormatter: function (total_quantity, discount, discountCat) {
		if (discountCat == "01") {
			return ("Buy " + total_quantity + " Return " + discount);
		} else {
			return ("Buy " + total_quantity + " PCs " + discount + "Off");
		}
	},

	saveInvitationItem: function () {

		var batchChanges = [];
		var oModel = this.getView().getModel();
		// var oInvitation = this.getView().getModel().getData().invitation;
		// item data
		var invitationItem = {
			inv_id: bwm.util.UtilMethod.guid(),
			"inv_head.id": this.invitation_data.id,
			"joiner.id": this.getView().getModel("user").getData().uuid,
			quantity: this.getView().byId("itemQuantity").getValue(),
			money: this.getView().byId("itemCost").getValue()
		};
		
        var joinedQuantity = this.calJoinedQuantity();
        var percentageValue = Math.trunc((parseInt(joinedQuantity)+parseInt(this.getView().byId("itemQuantity").getValue()))/this.invitation_data["total_quantity"]*100);
        if (parseInt(percentageValue) > 100){
        	percentageValue = 100;
        }
        var invitation = {
        		id: this.invitation_data["id"],
                title: this.invitation_data["title"],
                status: this.invitation_data["status"],
                "creator.id": this.invitation_data["creator.id"],
                "category.id": this.invitation_data["category.id"],
                "discountType.id": this.invitation_data["discountType.id"],
                total_quantity: this.invitation_data["total_quantity"],
                discount: this.invitation_data["discount"],
                total_money: this.invitation_data["total_money"],
                return_money: this.invitation_data["return_money"],
                create_time: this.invitation_data["create_time"],
                valid_in: this.invitation_data["valid_in"],
                end_time: this.invitation_data["end_time"],
                longitude: this.invitation_data["longitude"],
                latitude: this.invitation_data["latitude"],
                address: this.invitation_data["address"],
                percentage: percentageValue,
                progress_value: (parseInt(joinedQuantity)+parseInt(this.getView().byId("itemQuantity").getValue())) + '/' + this.invitation_data["total_quantity"]
        }
        
		batchChanges.push(oModel.createBatchOperation("/InvitationItem",
			"POST", invitationItem));
		var invitationPath = "/Invitation('" + invitation.id+"')";
		batchChanges.push(oModel.createBatchOperation(invitationPath,
				"PUT", invitation));
		this.invitation_data.percentage = invitation.percentage;
		this.invitation_data.progress_value = invitation.progress_value;
		//invitation_item = invitationItem;
		oModel.addBatchChangeOperations(batchChanges);
		oModel.setUseBatch(true);
		oModel.submitBatch(
			jQuery.proxy(function (data) {
				invitation_item_id = invitationItem.inv_id;
				oModel.refresh();
				this.onInit();
				//this.onNavButtonPressed();
				jQuery.sap.require("sap.m.MessageToast");
				// ID of newly inserted product is available in mResponse.ID
				this.oBusyDialog.close();
				sap.m.MessageToast.show("Congratulation! Join successfully!");
				this.setCancelButtonVisible(true);
				this.setJoinButtonVisible(false);
				this.setCloseButtonVisible(false);
				hasJoined = true;
			}, this),

			jQuery.proxy(function (err) {
				console.log(err);
				this.oBusyDialog.close();
				this.showErrorAlert("Problem join this invitation");
				hasJoined = false;
			}, this));
	},
	
	//calculate current joined quantity
	calJoinedQuantity: function () {
		var joinedQuantity=0;
				for (var i = 0; i < invitationItems.results.length; i++) {
					joinedQuantity = parseInt(joinedQuantity) + parseInt(invitationItems.results[i]["quantity"]);
				}
		return  parseInt(joinedQuantity);
	},

	onJoinInvitation: function () {
		var itemQuantity = this.getView().byId("itemQuantity").getValue();
		var itemCost = this.getView().byId("itemCost").getValue();
		// Show message if not input quantity or cost
		if (itemQuantity == 0 || itemCost == 0) {
			sap.m.MessageToast.show("Input quantity and cost!");
			// join
		} else {
			if (!this.oBusyDialog) {
				this.oBusyDialog = new sap.m.BusyDialog();
			}
			this.saveInvitationItem();
			// show successfully join message
			// sap.m.MessageToast.show("Congratulation! Join successfully!");
		}
	},

	onNavToChat: function () {
		//var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//oRouter.navTo("chat");
		var oView = this.getView();
		this.getRouter().myNavToWithoutHash({
			currentView: oView,
			targetViewName: "bwm.view.Chat",
			targetViewType: "XML",
			transition: "slide",
			data: {
				invitation: oView.getBindingContext().getProperty('id')
			}
		});
	},

	onNavToMap: function () {

	},

	onChangeValue: function () {
		/*		if (!invitation_data.discount){
					this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue());
				}else{
				this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue()*invitation_data.discount);
				}*/
		this.calculateCost();
	},

	calculateCost: function () {
		if (!this.invitation_data.discount) {
			this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue());
		} else {
			this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue() * this.invitation_data.discount);
		}
	},

	onCallOut: function (oEvent) {
		var oItem = oEvent.getSource();
		var itemId = oItem.getBindingContext().getPath();
		this.getView().getModel().read(itemId + "/ItemParticipator", {
			success: function (data) {
				console.log(data);
				var phoneNo = data.phone;
				window.open('tel:' + phoneNo);
			}
		});
	},

	onFavorite: function (oEvent) {
		//var oFavorite = this.getView().byId("")
		//var oFavorite= oEvent.getSource();
		//oFavorite.
	},

	onQuitInvitation: function (oEvent) {
		if (hasJoined) {
			if ((invitation_item_id !== "") && (this.invitation_id !== "")) {
				var oModel = this.getView().getModel();
//				var thisController = this;
				var invitation_item_path = "/InvitationItem(inv_id='" + invitation_item_id + "',inv_head.id='" + this.invitation_id + "')";
				oModel.remove(invitation_item_path, {
					success: jQuery.proxy(function (mResponse) {
						oModel.refresh();
						//this.onInit();
						this.setJoinButtonVisible(true);
						this.setCancelButtonVisible(false);
						this.setCloseButtonVisible(false);
						hasJoined = false;
						jQuery.sap.require("sap.m.MessageToast");
						// ID of newly inserted product is available in mResponse.ID
						this.oBusyDialog.close();
						sap.m.MessageToast.show("Item has been canceled");
					}, this),
					error: jQuery.proxy(function () {
						this.oBusyDialog.close();
						this.showErrorAlert("Problem when cancel item");
					}, this)
				});
				
				var invitation = {
		        		id: this.invitation_data["id"],
		                title: this.invitation_data["title"],
		                status: this.invitation_data["status"],
		                "creator.id": this.invitation_data["creator.id"],
		                "category.id": this.invitation_data["category.id"],
		                "discountType.id": this.invitation_data["discountType.id"],
		                total_quantity: this.invitation_data["total_quantity"],
		                discount: this.invitation_data["discount"],
		                total_money: this.invitation_data["total_money"],
		                return_money: this.invitation_data["return_money"],
		                create_time: this.invitation_data["create_time"],
		                valid_in: this.invitation_data["valid_in"],
		                end_time: this.invitation_data["end_time"],
		                longitude: this.invitation_data["longitude"],
		                latitude: this.invitation_data["latitude"],
		                address: this.invitation_data["address"],
		                percentage: this.invitation_data["percentage"],
		                progress_value: this.invitation_data["progress_value"]
		        }
				var joinedQuantity = this.calJoinedQuantity();
				var percentageValue = 0;
				if (invitation_item){
				 percentageValue = Math.trunc((parseInt(joinedQuantity)-parseInt(invitation_item.quantity))/this.invitation_data["total_quantity"]*100);
				}else{
					percentageValue = Math.trunc(parseInt(joinedQuantity)/this.invitation_data["total_quantity"]*100);
				}
				if (parseInt(percentageValue) > 100){
		        	percentageValue = 100;
		        }
				invitation.percentage = percentageValue;
				if (invitation_item){
				invitation.progress_value= (parseInt(joinedQuantity)-parseInt(invitation_item.quantity)) + '/' + this.invitation_data["total_quantity"];
				}else{
				invitation.progress_value= parseInt(joinedQuantity) + '/' + this.invitation_data["total_quantity"];
				}
				this.invitation_data.percentage = invitation.percentage;
				this.invitation_data.progress_value = invitation.progress_value;
				var invitationPath = "/Invitation('" + invitation.id+"')";
				oModel.update(invitationPath, invitation,{
					success: jQuery.proxy(function (mResponse) {
						oModel.refresh();
						//this.onInit();
						this.setJoinButtonVisible(true);
						this.setCancelButtonVisible(false);
						this.setCloseButtonVisible(false);
						jQuery.sap.require("sap.m.MessageToast");
						// ID of newly inserted product is available in mResponse.ID
						this.oBusyDialog.close();
						sap.m.MessageToast.show("Item has been canceled");
					}, this),
					error: jQuery.proxy(function () {
						this.oBusyDialog.close();
						sap.m.MessageToast.show("Problem when cancel item");
					}, this)
				});
			}
		}
	},
    
	//close invitation
	onCloseInvitation: function(oEvent){
	if(this.getView().getModel("user").getData().uuid == this.invitation_data["creator.id"]){
		var batchChanges = [];
		var oModel = this.getView().getModel();
		var errorFlag = false;
		this.getView().getModel().read("/Invitation('" + this.invitation_id + "')/InvitationItems", {
			success: jQuery.proxy(function (data) {
				console.log(data);
				var invitationItems = data;
				//var hasJoined = false;
				for (var i = 0; i < data.results.length; i++) {
						invitation_item_id = data.results[i]["inv_id"];
					var invitation_item_path = "/InvitationItem(inv_id='" + invitation_item_id + "',inv_head.id='" + this.invitation_id + "')";
					oModel.remove(invitation_item_path, {
						success: jQuery.proxy(function (mResponse) {
						}, this),
						error: jQuery.proxy(function () {
							errorFlag = true;
							this.showErrorAlert("Problem when cancel item");
						}, this)
					});
					if (errorFlag){
					break;
					}
				}
			}, this)
		});
		
		if(!errorFlag){
		var invitation_path = "/Invitation('" + this.invitation_id + "')";
		oModel.remove(invitation_path, {
			success: jQuery.proxy(function (mResponse) {
				//oModel.refresh();
				//this.onInit();
				//this.setJoinButtonVisible(true);
				//this.setCancelButtonVisible(false);
				jQuery.sap.require("sap.m.MessageToast");
				// ID of newly inserted product is available in mResponse.ID
			    //this.oBusyDialog.close();
				sap.m.MessageToast.show("Invitation is closed");
				this.toInvitationList();
				
			}, this),
			error: jQuery.proxy(function () {
				//this.oBusyDialog.close();
				this.showErrorAlert("Problem when close invitation");
			}, this)
		});
		
		}
	}
	},
	
	setCancelButtonVisible: function (bVisible) {
		this.getView().byId("quitInv").setVisible(bVisible);
	},

	setJoinButtonVisible: function (bVisible) {
		this.getView().byId("joinInv").setVisible(bVisible);
	},
	
	setCloseButtonVisible: function (bVisible){
		this.getView().byId("closeInv").setVisible(bVisible);
	},
	
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
            var PCInput = this.getView().byId("itemQuantity");
            PCInput.setValue(oSelectedItem.getTitle());
        }

    },

    //navigate to invitation list
    toInvitationList: function () {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "bwm.view.Invitations",
			targetViewType: "XML",
			transition: "slide",
		});
	},
	
    onNavButtonPressed: function () {
        this.getRouter().backWithoutHash(this.getView());
        invitation_item_id = "";
        hasJoined = false;
        invitationItems = "";
        invitation_item = "";
    },
	
});