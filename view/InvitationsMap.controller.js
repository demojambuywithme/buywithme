jQuery.sap.declare("bwm.view.InvitationsMap");
jQuery.sap.require("bwm.view.BaseController");
var invitation;
var selDist;
var selCate;
var selDisc;
var circle;
var markers;
var creator;

bwm.view.BaseController.extend("bwm.view.InvitationsMap", {

	/**
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 * 
	 * @memberOf bwm.view.home
	 */
	onInit: function () {

		this.getView().addEventDelegate({
			onBeforeShow: $.proxy(this.onBeforeShow, this),
			onAfterShow: $.proxy(this.onAfterShow, this),
			onAfterHide: $.proxy(this.onAfterHide, this)
		});
	},

	_readInvitations: function () {
		var dfd = $.Deferred();
		// this.getComponent().getModel().read('/Invitation', {
		// 	success: $.proxy(function (data) {
		// 		dfd.resolve(data.results);
		// 	}, this)
		// });


		// TO Remove
		var invitations = [{
			"id": "34cff2eb2cc54a548539dffbffe2056e",
			"title": "Come On Nike 70%",
			"status": 1,
			"creator.id": "877da535455a47b893b19e9ab8a1f2c2",
			"category.id": "a8d3fea970754d6fa8a4aeb8bf3dbaed",
			"discountType.id": "d92d38df966d4d65b37a6bd8c10dcbe8",
			"total_quantity": 3,
			"discount": "0.3",
			"total_money": null,
			"return_money": null,
			"create_time": "/Date(1439793120000)/",
			"valid_in": 2,
			"end_time": "/Date(1443681120000)/",
			"longitude": "121.6075",
			"latitude": "31.2075",
			"address": "3 Shasta Circle",
		}, {
			"id": "602b4dcf5339472b96786217e3955953",
			"title": "Adidas on Sales 50%",
			"status": 1,
			"creator.id": "81794267dc2e4e5e9619e51e37bfb1de",
			"category.id": "a8d3fea970754d6fa8a4aeb8bf3dbaed",
			"discountType.id": "d92d38df966d4d65b37a6bd8c10dcbe8",
			"total_quantity": 5,
			"discount": "0.5",
			"total_money": null,
			"return_money": null,
			"create_time": "/Date(1439756940000)/",
			"valid_in": 3,
			"end_time": "/Date(1428265800000)/",
			"longitude": "121.606",
			"latitude": "31.207",
			"address": "99 Tennyson Park",
		}, {
			"id": "b4cdcd5b3eff45faa324d75bffaef1d7",
			"title": "Buy With Me->GAP 60%",
			"status": 1,
			"creator.id": "877da535455a47b893b19e9ab8a1f2c2",
			"category.id": "a8d3fea970754d6fa8a4aeb8bf3dbaed",
			"discountType.id": "d92d38df966d4d65b37a6bd8c10dcbe8",
			"total_quantity": 5,
			"discount": "0.4",
			"total_money": null,
			"return_money": null,
			"create_time": "/Date(1439239080000)/",
			"valid_in": 1,
			"end_time": "/Date(1443727200000)/",
			"longitude": "121.607",
			"latitude": "31.207",
			"address": "515 Continental Trail",
		}, {
			"id": "dsads",
			"title": "Test",
			"status": 1,
			"creator.id": "877da535455a47b893b19e9ab8a1f2c2",
			"category.id": "a8d3fea970754d6fa8a4aeb8bf3dbaed",
			"discountType.id": "d92d38df966d4d65b37a6bd8c10dcbe8",
			"total_quantity": 5,
			"discount": "0.4",
			"total_money": null,
			"return_money": null,
			"create_time": "/Date(1439429858000)/",
			"valid_in": 5,
			"end_time": "/Date(1443707206000)/",
			"longitude": "40.70056",
			"latitude": "45.95139",
			"address": "410 Kropf Road",
		}, {
			"id": "ff81562b50ad4902a9156e3c6eee5080",
			"title": "Come with Me buy and Make fun",
			"status": 1,
			"creator.id": "81794267dc2e4e5e9619e51e37bfb1de",
			"category.id": "a8d3fea970754d6fa8a4aeb8bf3dbaed",
			"discountType.id": "d92d38df966d4d65b37a6bd8c10dcbe8",
			"total_quantity": 4,
			"discount": "0.3",
			"total_money": null,
			"return_money": null,
			"create_time": "/Date(1439497620000)/",
			"valid_in": 4,
			"end_time": "/Date(1443719100000)/",
			"longitude": "31.207",
			"latitude": "121.607",
			"address": "33323 Glacier Hill Place",
		}];

		dfd.resolve(invitations);

		return dfd.promise();
	},

	_getCurrentPosition: function () {
		var dfd = $.Deferred();
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function (r) {
			if (r) dfd.resolve(r);
			else dfd.fail();
		}, {
			enableHighAccuracy: true
		});
		return dfd.promise();
	},
	onMarkerClick: function (controller, invData, evt) {
		var oModel = controller.getView().getModel();

		var readCreator = function () {
			var dfd = $.Deferred();
			// oModel.read("/User('" + invData["creator.id"] + "')", {
			// 	success: dfd.resolve
			// });

			// TO Remove
			dfd.resolve({
				id: '1',
				name: "aaron",
				phone: "13621602102",
				rate: "5",
				"pic.id": 'xxx'
			});
			return dfd;
		}


		var readAvatar = function (creator) {
			var dfd = $.Deferred();
			// oModel.read("/Avatar('" + creator["pic.id"] + "')", {
			// 	success: function () {
			// 		dfd.resolve(creator, avatar)
			// 	}
			// });

			// TO Remove
			dfd.resolve(creator, {
				id: '1',
				pic_name: 'aa',
				pic_path: 'bb',
				pic_data: 'ccc'
			});
			return dfd;
		}

		var buildInfoWin = function (creator, avatar) {
			var picUser = "http://10.58.132.213:8000" + avatar.pic_path + avatar.pic_name;
			var sContent = "<div id='infoWin' style='line-height:1.8em;font-size:12px;'>" +
				"<b>Address: </b>" + invData.address + "</br>" +
				"<img id='userPic' src='" + picUser + "' width='10%' height='10%'/>" +
				"<b>    " + creator.name + "</b></br>" + "</div>";

			var opts = {
				title: '<span id="infoTitle" style="font-size:14px;color:#0A8021">' + invData.title + '</span>'
			};

			var infoWindow = new BMap.InfoWindow(sContent, opts);
			this.openInfoWindow(infoWindow);
			// document.getElementById("infoWin").onclick = function () {
			// 	controller.getRouter().myNavToWithoutHash({
			// 		currentView: this.getView(),
			// 		targetViewName: "bwm.view.InvitationDetail",
			// 		targetViewType: "XML",
			// 		transition: "slide",
			// 		data: {
			// 			invitation: invData.id
			// 		}
			// 	});
			// };

			// document.getElementById('userPic').onload = function () {
			// 	infoWindow.redraw();
			// };
		}

		readCreator()
			.then(readAvatar)
			.then(buildInfoWin)
	},
	onAfterHide: function () {
		// every time when user navigate to other page, clear the map overlays and circle
		// because next time we need to get invitation again to redraw map
		this.map.clearOverlays();
		this.circle.remove();
	},
	onAfterRendering: function () {
		// initialize map control
		var $mapContainer = this.byId('mapContainer').$();
		this.map = new BMap.Map($mapContainer[0]);
	},
	onAfterShow: function () {
		var invitationsPromise = this._readInvitations();
		var getPositionPromise = this._getCurrentPosition();

		$.when(invitationsPromise, getPositionPromise)
			.done($.proxy(function (invitations, position) {
				this.invitations = invitations;
				this.currentPosition = position;

				this.currentPoint = position.point;
				// TO Remove
				this.currentPoint = new BMap.Point('121.608265', '31.20729');

				this.reDraw(this.map, this.currentPoint, this.invitations);
			}, this));
	},
	reDraw: function (map, currentPoint, invitations) {
		map.addControl(new BMap.NavigationControl());
		map.enableScrollWheelZoom();
		map.centerAndZoom(currentPoint, 17);

		// current position
		var iconm = new BMap.Icon('image/myPosition.ico', new BMap.Size(32, 32));
		var mk = new BMap.Marker(currentPoint);
		mk.setTitle("My Position");
		mk.setIcon(iconm);
		map.addOverlay(mk);
		map.panTo(currentPoint);


		var keyDist = this.byId('dist').getSelectedKey();
		var keyCate = this.byId('cate').getSelectedKey();
		// TO Remove
		keyCate = 'a8d3fea970754d6fa8a4aeb8bf3dbaed';
		var keyDisc = this.byId('disc').getSelectedKey();
		// TO Remove
		keyDisc = 'd92d38df966d4d65b37a6bd8c10dcbe8';

		invitations.map(function (inv) {
			var invPoint = new BMap.Point(inv.longitude, inv.latitude);
			var distance = map.getDistance(currentPoint, invPoint).toFixed(2);
			return {
				invitation: inv,
				point: invPoint,
				distance: distance
			};
		}).filter(function (inv) {
			return parseFloat(inv.distance) <= parseFloat(keyDist) && inv.invitation["category.id"] === keyCate && inv.invitation["discountType.id"] === keyDisc;
		}).map($.proxy(function (inv) {
			var marker = new BMap.Marker(inv.point);
			// marker.setLabel(new
			// BMap.Label(invitation.oData[i].title));
			marker.setTitle(inv.invitation.title);
			if (inv.invitation["category.id"] == '0550223232fd488db699a7ea9a9fdde0') {
				marker.setIcon('image/sports.ico');
			};
			if (inv.invitation["category.id"] == 'a8d3fea970754d6fa8a4aeb8bf3dbaed') {
				marker.setIcon('image/clothes.ico');
			};
			if (inv.invitation["category.id"] == 'cfe2733e8cbd408db39a5371ab6137ce') {
				marker.setIcon('image/food.ico');
			};

			marker.invitationId = inv.invitation.id;

			// marker add event listener on click
			marker.addEventListener("click", $.proxy(this.onMarkerClick, null, this, inv.invitation));

			return marker;
		}, this)).map($.proxy(function (marker) {
			map.addOverlay(marker);
		}, this));

		this.circle = new BMap.Circle(currentPoint, keyDist);
		map.addOverlay(this.circle);
		this.circle.show();
	},

	selChange: function (e) {
		this.map.clearOverlays();
		this.circle.remove();
		this.reDraw(this.map, this.currentPoint, this.invitations);
	},
	toInvitations: function () {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "bwm.view.Invitations",
			targetViewType: "XML",
			transition: "slide"
		});
	},
	toMine: function () {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "bwm.view.Mine",
			targetViewType: "XML",
			transition: "slide",
		});
	},
});