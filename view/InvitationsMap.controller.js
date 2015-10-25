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
		// invitation = new sap.ui.model.json.JSONModel();
		// invitation.loadData("model/Invitation.json",false,
		// false);
		this.getView().addEventDelegate({
			onBeforeShow: $.proxy(this.onBeforeShow, this)
		});
	},

	_readInvitations: function () {
		var dfd = $.Deferred();
		// this.getComponent().getModel().read('/Invitation', {
		// 	success: $.proxy(function (data) {
		// 		dfd.resolve(data.results);
		// 	}, this)
		// });

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

	/**
	 * Similar to onAfterRendering, but this hook is invoked
	 * before the controller's View is re-rendered (NOT before
	 * the first rendering! onInit() is used for that one!).
	 * 
	 * @memberOf bwm.view.home
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is
	 * part of the document). Post-rendering manipulations of
	 * the HTML could be done here. This hook is the same one
	 * that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf bwm.view.home
	 */
	onAfterRendering: function () {

		var invitationsPromise = this._readInvitations();
		var getPositionPromise = this._getCurrentPosition();
		var $content = $("#" + this.byId("mapPage").getId() + "-cont");
		$.when(invitationsPromise, getPositionPromise)
			.done($.proxy(function (invitations, position) {
				this.invitations = invitations;
				this.currentPosition = position;

				this.currentPoint = position.point;
				this.currentPoint = new BMap.Point('121.608265', '31.20729');

				// map initialization
				if (!this.map) {
					this.map = new BMap.Map($content[0]);
				}

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
		var keyDisc = this.byId('disc').getSelectedKey();

		// var invPoints = 
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
		}).map(function (inv) {
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
			return marker;
		}).map($.proxy(function (marker) {
			map.addOverlay(marker);
		}, this));

		this.circle = new BMap.Circle(currentPoint, keyDist);
		map.addOverlay(this.circle);
		this.circle.show();

	},

	onBeforeShow: function () {

	},

	selChange: function (e) {
		this.map.clearOverlays();
		this.circle.remove();

		this.reDraw(this.map, this.currentPoint, this.invitations);

		// var mk = new BMap.Marker(this.currentPoint);
		// mk.setTitle("My Position");
		// var iconm = new BMap.Icon('image/myPosition.ico', new BMap.Size(32, 32));
		// mk.setIcon(iconm);
		// map.addOverlay(mk);

		// var keyDist = selDist.getSelectedKey();
		// var keyCate = selCate.getSelectedKey();
		// var keyDisc = selDisc.getSelectedKey();
		// for (i = 0; i < invitation.oData.d.results.length; i++) {
		// 	var cate;
		// 	var disc;
		// 	for (j in invitation.oData.d.results[i]) {
		// 		if (j == "category.id") {
		// 			cate = invitation.oData.d.results[i][j];
		// 		};
		// 		if (j == "discountType.id") {
		// 			disc = invitation.oData.d.results[i][j];
		// 		}
		// 	}
		// 	var invData = invitation.oData.d.results[i];
		// 	var invPoint = new BMap.Point(
		// 		invitation.oData.d.results[i].longitude,
		// 		invitation.oData.d.results[i].latitude);
		// 	var dist = map.getDistance(currentPoint, invPoint)
		// 		.toFixed(2);
		// 	if (parseFloat(dist) <= parseFloat(keyDist) & cate == keyCate & disc == keyDisc) {
		// 		// var invPoint = new
		// 		// BMap.Point(invitation.oData[i].latitude,invitation.oData[i].longtitude);
		// 		// var walking = new BMap.WalkingRoute(map,
		// 		// {renderOptions:{map: map, autoViewport:
		// 		// false}});
		// 		// walking.search(currentPoint, invPoint);
		// 		var marker = new BMap.Marker(invPoint);
		// 		// marker.setLabel(new
		// 		// BMap.Label(invitation.oData[i].title));
		// 		marker.setTitle(invitation.oData.d.results[i].title);
		// 		if (keyCate == '0550223232fd488db699a7ea9a9fdde0') {
		// 			var icons = new BMap.Icon(
		// 				'http://localhost:8080/bwm/image/sports.ico',
		// 				new BMap.Size(32, 32));
		// 			marker.setIcon(icons);
		// 		};
		// 		if (keyCate == 'a8d3fea970754d6fa8a4aeb8bf3dbaed') {
		// 			var iconc = new BMap.Icon(
		// 				'http://localhost:8080/bwm/image/clothes.ico',
		// 				new BMap.Size(32, 32));
		// 			marker.setIcon(iconc);
		// 		};
		// 		if (keyCate == 'cfe2733e8cbd408db39a5371ab6137ce') {
		// 			var iconf = new BMap.Icon(
		// 				'http://localhost:8080/bwm/image/food.ico',
		// 				new BMap.Size(32, 32));
		// 			marker.setIcon(iconf);
		// 		};

		// 		marker.addEventListener(
		// 			"click",
		// 			$.proxy(function (controller, evt) {
		// 				// var walking = new
		// 				// BMap.WalkingRoute(map,
		// 				// {renderOptions:{map: map,
		// 				// autoViewport: false}});
		// 				// walking.search(currentPoint,
		// 				// evt.target.getPosition());
		// 				// var infoPage = new
		// 				// sap.ui.view({viewName:"bwm.view.InfoWindow",
		// 				// type:sap.ui.core.mvc.ViewType.XML});
		// 				var title = evt.target
		// 					.getTitle();
		// 				var invData = null;
		// 				for (k = 0; k < invitation.oData.d.results.length; k++) {
		// 					if (title == invitation.oData.d.results[k].title) {
		// 						// infoPage.setHeight(300);
		// 						invData = invitation.oData.d.results[k];
		// 						break;
		// 						// infoPage.setModel(new
		// 						// sap.ui.model.json.JSONModel());
		// 						// break;
		// 					}
		// 				}

		// 				for (j in invData) {
		// 					if (j == "creator.id") {
		// 						creator = invData[j];
		// 					};
		// 				}
		// 				// infoPage.getController();
		// 				// infoPage.placeAt('infoWin');
		// 				var user = null;
		// 				var pic_id = null;
		// 				jQuery.ajax({
		// 					url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/User('" + creator + "')",
		// 					dataType: "json",
		// 					async: false,
		// 					success: function (
		// 						data,
		// 						textStatus,
		// 						jqXHR) {
		// 						user = data.d;
		// 						for (j in data.d) {
		// 							if (j == "pic.id") {
		// 								pic_id = data.d[j];
		// 							};
		// 						}
		// 						//invitation = new sap.ui.model.json.JSONModel();
		// 						//invitation.setData(data.d.results);
		// 						// sap.ui.getCore().setModel(invitation);
		// 					},
		// 					error: function (
		// 						jqXHR,
		// 						textStatus,
		// 						errorThrown) {

		// 					}
		// 				});
		// 				jQuery.ajax({
		// 					url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/Avatar('" + pic_id + "')",
		// 					dataType: "json",
		// 					async: false,
		// 					success: function (
		// 						data,
		// 						textStatus,
		// 						jqXHR) {
		// 						picUser = "http://10.58.132.213:8000" + data.d.pic_path + data.d.pic_name;
		// 						// sap.ui.getCore().setModel(invitation);
		// 					},
		// 					error: function (
		// 						jqXHR,
		// 						textStatus,
		// 						errorThrown) {

		// 					}
		// 				});
		// 				var sContent = "<div id='infoWin' style='line-height:1.8em;font-size:12px;'>" + "<b>Address: </b>" + invData.address + "</br>" + "<img id='userPic' src='" + picUser + "' width='10%' height='10%'/>" + "<b>    " + user.name + "</b></br>" + "</div>"
		// 				var opts = {
		// 					title: '<span id="infoTitle" style="font-size:14px;color:#0A8021">' + invData.title + '</span>'
		// 				};
		// 				var infoWindow = new BMap.InfoWindow(
		// 					sContent, opts);
		// 				this.openInfoWindow(infoWindow);
		// 				document.getElementById("infoWin").onclick = function () {
		// 					controller.getRouter().myNavToWithoutHash({
		// 						currentView: this.getView(),
		// 						targetViewName: "bwm.view.InvitationDetail",
		// 						targetViewType: "XML",
		// 						transition: "slide",
		// 						data: {
		// 							invitation: invData.id
		// 						}
		// 					});
		// 					// controller.getRouter().navTo("invitationDetail", {
		// 					// 	invitation: invData.id
		// 					// });
		// 				};
		// 				//infoWindow.setHeight(300);
		// 				// infoWindow.redraw();
		// 				document.getElementById('userPic').onload = function () {
		// 					infoWindow.redraw();
		// 				};
		// 			}, null, this));
		// 		map.addOverlay(marker);
		// 	}
		// };
		// circle = new BMap.Circle(currentPoint, keyDist);
		// map.addOverlay(circle);
		// circle.show();
	},
	/**
	 * Called when the Controller is destroyed. Use this one to
	 * free resources and finalize activities.
	 * 
	 * @memberOf bwm.view.home
	 */
	// onExit: function() {
	//
	// }
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