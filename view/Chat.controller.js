jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function() {
        this.getView().setModel(new sap.ui.model.json.JSONModel({
            id: 'aaron',
            name: 'shen Aaron'
        }), 'user');

        var oRouter = this.getRouter();
        oRouter.getRoute("chat").attachMatched(this.onRouteMatched, this);

        //init model
        this.initModel();

        //socket connection
        this.socket = io('http://10.58.91.184:8090/chat');
        this.socket.emit('join', {
            conversationId: '001'
        });

        //on chat history
        this.onChatHistory();

        //on new msg
        this.onNewMsg();

        // this.msgs = [{
        //     user: 'jay',
        //     text: 'do you want to join this?'
        // }, {
        //     user: 'loring',
        //     text: 'shit'
        // }];



    },
    initModel: function() {
        this.getView().setModel(new sap.ui.model.json.JSONModel({
            text: ""
        }), 'msg');

        this.getView().setModel(new sap.ui.model.json.JSONModel([]), 'msgs');
    },
    onChatHistory: function() {
        this.socket.on('chatHistory', $.proxy(function(chats) {
            chats = chats.map(this.assignUserName2Msg, this);
            this.getView().getModel('msgs').setData(chats);
        }, this));
    },
    onNewMsg: function() {
        this.socket.on('newMessage', $.proxy(function(chat) {
            var msgs = this.getView().getModel('msgs').getData();
            msgs.push(this.assignUserName2Msg(chat));
            this.getView().getModel('msgs').setData(msgs);

            // $("#chats").scrollTop($("#chats")[0].scrollHeight);
        }, this));
    },
    assignUserName2Msg: function(msg) {
        var users = this.getView().getModel('users').getData();
        var theUser = users.filter(function(u) {
            return u.id === msg.usrid;
        })[0];
        var newMsg = $.extend({}, msg);
        newMsg.usrname = theUser ? theUser.name : msg.usrid;
        return newMsg;
    },
    onUpdateFinished: function() {
        this.styleMsg();
    },
    styleMsg: function() {
        var id = this.byId('msglist').getId();
        var selector = '#' + id + ' textarea';
        var domElements = $(selector);
        var msgs = this.getView().getModel('msgs').getData();
        var currentUserId = this.getView().getModel('user').getData().id;

        msgs.map(function(msg, i) {
            var domEl = $(domElements[i]);
            msg.usrid === currentUserId ? domEl.addClass('chatMessage--mine') : domEl.addClass('chatMessage--others');
        }, this);
    },
    onSend: function() {
        var msg = this.getView().getModel('msg').getData().text;
        this.socket.emit('chat', {
            conversationId: '001',
            // usrid: this.getView().getModel('user').getData().id,
            usrid: "aaron",
            msg: msg
        });
    },

    onRouteMatched: function(oEvent) {
            // var oArgs, oView;
            // oArgs = oEvent.getParameter("arguments");
            // this.invitationId = oArgs.invitation;

            // this.socket.emit('join', {
            //     conversationId: this.invitationId,
            // });
        }
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
    // onAfterRendering: function() {
    // }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bwm.view.home
     */
    //  onExit: function() {
    //
    //  }

});
