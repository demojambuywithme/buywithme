jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function() {

        if (this.getComponent().oMockServer) {
            this.getComponent().oMockServer.stop();
        }

        var oRouter = this.getRouter();
        oRouter.getRoute("chat").attachMatched(this.onRouteMatched, this);

        //init model
        this.initModel();

        this.oUser = this.getView().getModel('user').getData();
        // this.aUser = this.getView().getModel('users').getData();

        //socket connection
        this.socket = io('http://localhost:8090/chat');
        this.socket.emit('join', {
            conversationId: '001'
        });

        //on chat history
        this.onChatHistory();

        //on new msg
        this.onNewMsg();

        this.byId('chatting').addEventDelegate({
            onBeforeShow: this.onBeforeShow
        });

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

        this.getView().setModel(new sap.ui.model.json.JSONModel({
            id: 'aaron',
            name: 'shen Aaron'
        }), 'user');
    },
    onBeforeShow: function() {

    },

    onChatHistory: function() {
        this.socket.on('chatHistory', $.proxy(function(chats) {
            this.chats = chats;

            var htmlString = this.chats2Html(chats);

            this.byId('msglist').setContent(htmlString);

            // $("#chats").scrollTop($("#chats")[0].scrollHeight);
            // chats = chats.map(this.assignUserName2Msg, this);

        }, this));
    },
    onNewMsg: function() {
        this.socket.on('newMessage', $.proxy(function(chat) {
            this.chats.push(chat);

            var htmlString = this.chats2Html(this.chats);

            this.byId('msglist').setContent(htmlString);
        }, this));
    },
    chats2Html: function(chats) {

        var $chats = $('<div>');

        chats.map($.proxy(function(chat) {
            var $chat = $('<div>').addClass('bubble').text(chat.msg);
            if (chat.usrid === this.oUser.id) {
                $chat.addClass('bubble--alt');
            }
            return $chat;
        }, this)).map($.proxy(function($chats, $chat) {
            $chat.appendTo($chats);
        }, null, $chats));

        return $chats.html();
    },
    onUpdateFinished: function() {
        this.styleMsg();
    },
    styleMsg: function() {
        // var id = this.byId('msglist').getId();
        // var selector = '#' + id + ' textarea';
        // var domElements = $(selector);
        // var msgs = this.getView().getModel('msgs').getData();
        // var currentUserId = this.getView().getModel('user').getData().id;

        // msgs.map(function(msg, i) {
        //     var domEl = $(domElements[i]);
        //     msg.usrid === currentUserId ? domEl.addClass('chatMessage--mine') : domEl.addClass('chatMessage--others');
        // }, this);
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
    // onAfterRendering: function() {
    // }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bwm.view.home
     */
    onExit: function() {},
    onNavButtonPressed: function() {
        if (this.getComponent().oMockServer) {
            this.getComponent().oMockServer.start();
        }
        this.getRouter().backWithoutHash(this.getView());
    },

});
