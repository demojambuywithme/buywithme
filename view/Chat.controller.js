jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
    onInit: function () {
        // var oRouter = this.getRouter();
        // oRouter.getRoute("chat").attachMatched(this.onRouteMatched, this);

        //init model
        this.initModel();

        this.oUser = this.getView().getModel('user').getData();
        this.aUser = this.getComponent().getModel('users').getData();

        //socket connection
        this.socket = io('http://localhost:8090/chat');

        // init chats
        this.chats = [];

        this.byId('chatting').addEventDelegate({
            onBeforeShow: this.onBeforeShow,
            onAfterShow: this.onBeforeShow
        });
    },
    initModel: function () {
        this.getView().setModel(new sap.ui.model.json.JSONModel({
            text: ''
        }), 'msg');

        this.getView().setModel(new sap.ui.model.json.JSONModel({
            id: 'aaron',
            name: 'shen Aaron'
        }), 'user');
        this.getView().setModel(new sap.ui.model.json.JSONModel({
            id: 'jay',
            name: 'jay ss'
        }), 'user');
    },
    onBeforeShow: function () {
        this.socket.emit('join', {
            conversationId: '001'
        });
        //on chat history
        this.onChatHistory();

        //on new msg
        this.onNewMsg();

    },
    onChatHistory: function () {
        this.socket.on('chatHistory', $.proxy(function (chats) {
            this.chats = chats;

            var dom = this.chats2dom(chats);
            this.byId('msglist').setDOMContent(dom);

            // $("#chats").scrollTop($("#chats")[0].scrollHeight);
            // chats = chats.map(this.assignUserName2Msg, this);

        }, this));
    },
    onNewMsg: function () {
        this.socket.on('newMessage', $.proxy(function (chat) {
            this.chats.push(chat);

            var dom = this.chats2dom(this.chats);
            this.byId('msglist').setDOMContent(dom);
        }, this));
    },
    clearChats: function () {
        var id = this.byId('msglist').getId();
        $('#' + id).empty();
    },
    chats2dom: function (chats) {
        var filterUser = function (usrid, ouser) {
            return ouser.id === usrid;
        }

        var isUserExist = function (id, user) {
            return user.id = id;
        };

        chats = chats.filter($.proxy(function (chat) {
            return this.aUser.some($.proxy(isUserExist, null, chat.usrid));
        }, this));

        var $chats = $('<div>');

        chats.map($.proxy(function (chat) {

                var $chat = $('<div>');
                var ouser = this.aUser.filter($.proxy(filterUser, null, chat.usrid))[0];
                var $name = $('<div>').text(ouser.name);
                var $msg = $('<div>').addClass('bubble').text(chat.msg);
                if (chat.usrid === this.oUser.id) {
                    $msg.addClass('bubble--right');
                    $name.css('float', 'right');
                } else {
                    $msg.addClass('bubble--left');
                    $name.css('float', 'left');
                }

                $msg.appendTo($chat);
                $name.appendTo($chat);
                return $chat;
            }, this))
            .map($.proxy(function ($chats, $chat) {
                $chat.appendTo($chats);
            }, null, $chats));

        return $chats[0];
    },
    onSend: function () {
        var msg = this.getView().getModel('msg').getData().text;
        this.socket.emit('chat', {
            conversationId: '001',
            // usrid: this.getView().getModel('user').getData().id,
            usrid: this.oUser.id,
            msg: msg
        });
    },
    onRouteMatched: function (oEvent) {
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
    onExit: function () {},
    onNavButtonPressed: function () {}

});