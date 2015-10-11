jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function() {

        var oRouter = this.getRouter();
        oRouter.getRoute("chat").attachMatched(this.onRouteMatched, this);

        //init model
        this.initModel();

        //socket connection
        this.socket = io('http://localhost:8090/chat');
        this.socket.emit('join', {
            conversationId: '001'
        });

        // this.msgs = [{
        //     user: 'jay',
        //     text: 'do you want to join this?'
        // }, {
        //     user: 'loring',
        //     text: 'shit'
        // }];

        this.socket.on('chatHistory', function(chats) {
            that.msgsModel.setData(chats);
        });


    },
    initModel: function(){
        this.getView().setModel(new sap.ui.model.json.JSONModel({
            text: ""
        }), 'msg');
        
        this.getView().setModel(new sap.ui.model.json.JSONModel([]), 'msgs');
    },

    onSend: function() {
        var msg = this.getView().getModel('msg').getData().text;
        this.socket.emit('chat', {
            conversationId: '001',
            usrid: 'aaron',
            msg: msg
        });
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

    onRouteMatched: function(oEvent) {
        var oArgs, oView;
        oArgs = oEvent.getParameter("arguments");
        this.invitationId = oArgs.invitation;

        this.socket.emit('join', {
            conversationId: this.invitationId,
        });
    },
});
