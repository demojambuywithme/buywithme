jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
      onInit: function() {

          //initialize a json model for chat history
          var chatModel = new sap.ui.json.JSONModel();

    	  var oRouter = this.getRouter();
  		  oRouter.getRoute("invitation").attachMatched(this.onRouteMatched, this);
    
      },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf bwm.view.home
     */
    //  onBeforeRendering: function() {
    //
    //  },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf bwm.view.home
     */
    //  onAfterRendering: function() {
    //
    //  },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bwm.view.home
     */
    //  onExit: function() {
    //
    //  }

      onRouteMatched : function (oEvent) {
  		var oArgs, oView;
  		oArgs = oEvent.getParameter("arguments");
  		oView = this.getView();

  		oView.bindElement({
  			path : "/"+oArgs.invitation,
  			events : {
  				change: this.onBindingChange.bind(this),
  				dataRequested: function (oEvent) {
  					oView.setBusy(true);
  				},
  				dataReceived: function (oEvent) {
  					oView.setBusy(false);
  				}
  			}
  		});
  	},
});
