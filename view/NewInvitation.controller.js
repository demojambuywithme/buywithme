jQuery.sap.declare("bwm.view.NewInvitation
");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.NewInvitation", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    //  onInit: function() {
    //
    //  },

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