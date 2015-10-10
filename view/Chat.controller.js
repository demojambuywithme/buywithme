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
          //var chatModel = new sap.ui.json.JSONModel();
          var that = this;

              var oRouter = this.getRouter();
              oRouter.getRoute("chat").attachMatched(this.onRouteMatched, this);

            this.socket = io('http://localhost:8090/chat');
            this.text = this.byId('msg');
            this.msgs = [{
                user: 'jay',
                text: 'do you want to join this?'
            },{
                user: 'loring',
                text: 'shit'
            }];
            this.msgsModel = new sap.ui.model.json.JSONModel(this.msgs);
            this.msg = {
                text: ""
            };
            this.msgModel = new sap.ui.model.json.JSONModel(this.msg);
            this.getView().setModel(this.msgsModel, 'msgs');
            this.getView().setModel(this.msgModel, 'msg');

            this.socket.on('chatHistory', function(chats) {
                that.msgsModel.setData(chats);
            });


      },


        onSend: function() {

            this.getView().getModel('msg').get

            
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
        this.invitationId = oArgs.invitation;

        this.socket.emit('join', {
            conversationId: this.invitationId,
        });
  	},
});
