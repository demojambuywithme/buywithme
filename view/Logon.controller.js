jQuery.sap.declare("bwm.view.Logon");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Logon", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
      onInit: function() {
          this.getView().setModel(new sap.ui.model.json.JSONModel({
              user: "",
              password:""
          }), "logon");
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
      onLogon: function(){
          var logonInfo = this.getView().getModel("logon").getData();
          var users = this.getView().getModel("users").getData();
          var checkUserExist = function(u, user){
              return u === user.id;
          };
          var theUser = users.filter($.proxy(checkUserExist,null, logonInfo.user))[0];

          if(theUser){
              var userModel = new sap.ui.model.json.JSONModel(theUser);
              this.getComponent().setModel(userModel, 'user');
              this.getRouter().navTo('invitations');
          }else {
              sap.m.MessageToast.show("User doesn't exist!",{
                  of: this.byId('user')
              });
          }
      }
});
