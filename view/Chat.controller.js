jQuery.sap.declare("bwm.view.Chat");
jQuery.sap.require("bwm.view.BaseController");

bwm.view.BaseController.extend("bwm.view.Chat", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf bwm.view.home
	 */
	onInit: function () {

		//init model
		this.initModel();


		this.oUser = this.getComponent().getModel('user').getData();
		this.aUser = this.getComponent().getModel('users').getData();

		//socket connection
		this.socket = io('http://10.58.91.184:8090/chat');

		// init chats
		this.chats = [];

		this.getView().addEventDelegate({
			onBeforeShow: $.proxy(this.onBeforeShow, this),
			onAfterShow: $.proxy(this.onAfterShow, this),
			onAfterHide: $.proxy(this.onAfterHide, this)
		});
	},
	initModel: function () {
		this.getView().setModel(new sap.ui.model.json.JSONModel({
			text: ''
		}), 'msg');
	},
	onBeforeShow: function (oEvt) {
		this.conversationId = oEvt.data.invitation;
		this.socket.emit('join', {
			conversationId: this.conversationId
		});
		//on chat history
		this.onChatHistory();

		//on new msg
		this.onNewMsg();

	},
	onAfterHide: function () {
		this.socket.emit('leave', {
			conversationId: this.conversationId
		});
		this.socket.removeAllListeners('chatHistory');
		this.socket.removeAllListeners('newMessage');
		this.chats = [];
		this.clearChats();
	},
	onChatHistory: function () {
		this.socket.on('chatHistory', $.proxy(function (chats) {
			this.chats = chats;

			var dom = this.chats2dom(chats);
			this.clearChats();
			this.byId('msglist').setDOMContent(dom);

		}, this));
	},
	onNewMsg: function () {
		this.socket.on('newMessage', $.proxy(function (chat) {
			this.chats.push(chat);

			var dom = this.chats2dom(this.chats);
			this.clearChats();
			this.byId('msglist').setDOMContent(dom);
		}, this));
	},
	clearChats: function () {
		var id = this.byId('msglist').getId();
		$('#' + id).empty();
	},
	chats2dom: function (chats) {
		var isUserEqualId = function (id, oUser) {
			return oUser.id === id;
		}
		chats = chats.filter($.proxy(function (chat) {
			return this.aUser.some($.proxy(isUserEqualId, null, chat.usrid));
		}, this));

		var $chats = $('<div>');

		chats.map($.proxy(function (chat) {

				var $chat = $('<div>');
				var ouser = this.aUser.filter($.proxy(isUserEqualId, null, chat.usrid))[0];
				var $name = $('<div>').css('clear', 'both').css('margin-bottom', '10px');
				var $msg = $('<div>').addClass('bubble').text(chat.msg);
				if (chat.usrid === this.oUser.id) {
					$msg.addClass('bubble--right');
					$name.text("Myself");
					$name.css('float', 'right');
				} else {
					$msg.addClass('bubble--left');
					$name.text(ouser.name)
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
		this.getView().getModel('msg').setData({
			text: ''
		});
		this.socket.emit('chat', {
			conversationId: this.conversationId,
			// usrid: this.getView().getModel('user').getData().id,
			usrid: this.oUser.id,
			msg: msg
		});
	}
});