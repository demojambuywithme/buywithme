jQuery.sap.declare("bwm.view.Logon");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Logon", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
      onInit: function() {

          var logonModel = new sap.ui.model.json.JSONModel({
              user: "",
              password: ""
          });

          this.getView().setModel(logonModel, "logon");

            this.users = {
                jay: {
                    id: "311c0ab7fed848c7857f8f5204faf111",
                    name: "Zhao Jay"
                },
                chunyang: {
                    id: "4defa41b7b934dab9f36627b32fb7bb7",
                    name: "Xu Chunyang"
                },
                aaron: {
                    id: "81794267dc2e4e5e9619e51e37bfb1de",
                    name: "Shen Aaron"
                },
                xin: {
                    id: "877da535455a47b893b19e9ab8a1f2c2",
                    name: "Jiang Xin"
                },
                loring: {
                    id: "6273876ccd96464cae261fd8c390267f",
                    name: "Wu Loring"
                }
            };
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
          if(this.users[logonInfo.user]){
              var userModel = new sap.ui.model.json.JSONModel(this.users[logonInfo.user]);
              this.getComponent().setModel(userModel, 'user');
              this.getRouter().navTo('invitations');
          }else {
              sap.m.MessageToast.show("User doesn't exist!",{
                  of: this.byId('user')
              });
          }
      }
});
