jQuery.sap.declare("bwm.view.InvitationDetail");
jQuery.sap.require("bwm.view.BaseController");
jQuery.sap.require("bwm.util.UtilMethod");
var invitation_data;
bwm.view.BaseController.extend("bwm.view.InvitationDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf bwm.view.home
	 */
	// onInit: function() {
	//
	// },
	/*
	 * onInit: function(){ invDetView = this.getView(); var oInvation = new
	 * sap.ui.model.json.JSONModel(); jQuery.ajax({ url:
	 * "http://10.58.132.213:8000/BWM/services/bwm.xsodata/Invitation('2319409ba6ff4f2dbb903225d689301a')",
	 * dataType: "json", async: false, success: function(data, textStatus,
	 * jqXHR) { oInvation = new sap.ui.model.json.JSONModel();
	 * oInvation.setData(data.d); }, error: function(jqXHR, textStatus,
	 * errorThrown) { //alert("Oh no, an error occurred"); } });
	 * invDetView.setModel(oInvation,"invation"); }
	 */

	onInit : function() {
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.getRoute("invitation").attachPatternMatched(
				this._onObjectMatched, this);
//		this.getRoute().getRoute('invitationDetail')attachMatched(
//				this._onObjectMatched, this);
	
	},
	_onObjectMatched : function(oEvent) {
		console.log(oEvent.getParameter("arguments"));
		this.getView().bindElement({
			path : "/" + oEvent.getParameter("arguments").invitation
		});
		var invitation_id = oEvent.getParameter("arguments").invitation.substring(
				12, 44);
		var that = this;
		
		this.getView().getModel().read("/Invitation('"+invitation_id+"')", {
			success: function(data){
				console.log(data);
				invitation_data = data;
				that.calculateCost();
			}
		});
	},

	discountFormatter : function(total_quantity, discount, discountCat) {
		if (discountCat == "01") {
			return ("Buy " + total_quantity + " Return " + discount);
		} else {
			return ("Buy " + total_quantity + " PCs " + discount + "Off");
		}
	},

	saveInvitationItem : function() {

		var batchChanges = [];
		var oModel = this.getView().getModel();
		// var oInvitation = this.getView().getModel().getData().invitation;
		// item data
		var invitationItem = {
			inv_id : bwm.util.UtilMethod.guid(),
			"inv_head.id" : invitation_data.id,
			"joiner.id" : "6273876ccd96464cae261fd8c390267f",
			quantity : this.getView().byId("itemQuantity").getValue(),
			money : this.getView().byId("itemCost").getValue()
		};

		batchChanges.push(oModel.createBatchOperation("/InvitationItem",
				"POST", invitationItem));

		oModel.addBatchChangeOperations(batchChanges);
		oModel.setUseBatch(true);
		oModel.submitBatch(jQuery.proxy(function(data) {
			console.log(data);
			oModel.refresh();
			this.onInit();
			// @TODO will navigation to the detail Invitation
			// sap.ui.core.UIComponent.getRouterFor(this).navTo();
			// currently, navigation to Main
			this.onNavButtonPressed();
			jQuery.sap.require("sap.m.MessageToast");
			// ID of newly inserted product is available in mResponse.ID
			this.oBusyDialog.close();
			sap.m.MessageToast.show("Congratulation! Join successfully!");
		}, this),

		jQuery.proxy(function(err) {
			console.log(err);
			this.oBusyDialog.close();
			this.showErrorAlert("Problem join this invitation");
		}, this));
	},

	onJoinInvitation : function() {
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

	onNavButtonPressed : function() {
		this.getRouter().backWithoutHash(this.getView());
		// sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
	},
	
	onNavToChat : function(){
		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		oRouter.navTo("chat");
	},
	
	onNavToMap : function(){
		this.getRouter().navTo("invitationDetailMap");
	},
	
	onChangeValue : function(){
/*		if (!invitation_data.discount){
			this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue());
		}else{
		this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue()*invitation_data.discount);
		}*/
		this.calculateCost();
	},
	
	calculateCost(){
		if (!invitation_data.discount){
			this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue());
		}else{
		this.getView().byId("actualCost").setText(this.getView().byId("itemCost").getValue()*invitation_data.discount);
		}	
	},
	
	callOut(oEvent){
		var oItem = oEvent.getSource();
		var itemId = oItem.getBindingContext().getPath();
		this.getView().getModel().read(itemId+"/ItemParticipator", {
			success: function(data){
				console.log(data);
				var phoneNo = data.phone;
				window.open('tel:' + phoneNo);
			}
		});
	}
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf bwm.view.home
 */
// onBeforeRendering: function() {
//
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf bwm.view.home
 */
// onAfterRendering: function() {
//
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf bwm.view.home
 */
// onExit: function() {
//
// }
});