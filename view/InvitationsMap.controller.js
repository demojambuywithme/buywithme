jQuery.sap.declare("bwm.view.InvitationsMap");
jQuery.sap.require("bwm.view.BaseController");
var invitation;
var selDist;
var selCate;
var selDisc;
var circle;
var markers;
var creator;
var mapContainer;

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
		jQuery
			.ajax({
				url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/Invitation",
				//url: "model/Invitation",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					invitation = new sap.ui.model.json.JSONModel();
					//invitation.setData(data.d.results);
					invitation.setData(data);
					// sap.ui.getCore().setModel(invitation);
				},
				error: function (jqXHR, textStatus,
					errorThrown) {
					// alert("Oh no, an error occurred");
				}
			});

		selCate = this.byId("cate");
		jQuery
			.ajax({
				url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/Category",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					var catModel = new sap.ui.model.json.JSONModel();
					catModel.setData(data.d.results);
					selCate.setModel(catModel);
				},
				error: function (jqXHR, textStatus,
					errorThrown) {
					// alert("Oh no, an error occurred");
				}
			});

		selDisc = this.byId("disc");
		jQuery
			.ajax({
				url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/DiscountType",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					var discModel = new sap.ui.model.json.JSONModel();
					discModel.setData(data.d.results);
					selDisc.setModel(discModel);
				},
				error: function (jqXHR, textStatus,
					errorThrown) {
					// alert("Oh no, an error occurred");
				}
			});
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
		var page = this.byId("mapPage");
		mapContainer = page.sId + "-cont";
		selDist = this.byId("dist");
		var geolocation = new BMap.Geolocation();
		geolocation
			.getCurrentPosition(
				function (r) {
					if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						map = new BMap.Map(
							mapContainer);
						// var point = new
						// BMap.Point(116.331398,39.897445);
						map.addControl(new BMap.NavigationControl());
						map.enableScrollWheelZoom();
						map.centerAndZoom(r.point, 17);
						var mk = new BMap.Marker(
							r.point);
						currentPoint = r.point;
						// mk.setTitle("test");
						mk.setTitle("My Position");
						var iconm = new BMap.Icon(
							'image/myPosition.ico',
							new BMap.Size(32, 32));
						mk.setIcon(iconm);
						map.addOverlay(mk);
						map.panTo(r.point);

						var keyDist = selDist
							.getSelectedKey();
						var keyCate = selCate
							.getSelectedKey();
						var keyDisc = selDisc
							.getSelectedKey();
						for (i = 0; i < invitation.oData.d.results.length; i++) {
							var cate;
							var disc;
							for (j in invitation.oData.d.results[i]) {
								if (j == "category.id") {
									cate = invitation.oData.d.results[i][j];
								};
								if (j == "discountType.id") {
									disc = invitation.oData.d.results[i][j];
								}
							}
							var invPoint = new BMap.Point(
								invitation.oData.d.results[i].longitude,
								invitation.oData.d.results[i].latitude);
							var dist = map.getDistance(
									currentPoint,
									invPoint)
								.toFixed(2);
							if (parseFloat(dist) <= parseFloat(keyDist) & cate == keyCate & disc == keyDisc) {
								// var invPoint = new
								// BMap.Point(invitation.oData[i].latitude,invitation.oData[i].longtitude);
								var marker = new BMap.Marker(
									invPoint);
								// marker.setLabel(new
								// BMap.Label(invitation.oData[i].title));
								marker.setTitle(invitation.oData.d.results[i].title);
								if (keyCate == '0550223232fd488db699a7ea9a9fdde0') {
									marker
										.setIcon('image/sports.ico');
								};
								if (keyCate == 'a8d3fea970754d6fa8a4aeb8bf3dbaed') {
									marker
										.setIcon('image/clothes.ico');
								};
								if (keyCate == 'cfe2733e8cbd408db39a5371ab6137ce') {
									marker
										.setIcon('image/food.ico');
								};
								map.addOverlay(marker);
								// markers.push(marker);
							}
						};
						circle = new BMap.Circle(
							currentPoint, keyDist);
						map.addOverlay(circle);
						circle.show();
					} else {
						alert('failed' + this.getStatus());
					}
				}, {
					enableHighAccuracy: true
				});

	},

	selChange: function (e) {
		map.clearOverlays();
		circle.remove();

		var mk = new BMap.Marker(currentPoint);
		mk.setTitle("My Position");
		var iconm = new BMap.Icon('image/myPosition.ico',
			new BMap.Size(32, 32));
		mk.setIcon(iconm);
		map.addOverlay(mk);

		var keyDist = selDist.getSelectedKey();
		var keyCate = selCate.getSelectedKey();
		var keyDisc = selDisc.getSelectedKey();
		for (i = 0; i < invitation.oData.d.results.length; i++) {
			var cate;
			var disc;
			for (j in invitation.oData.d.results[i]) {
				if (j == "category.id") {
					cate = invitation.oData.d.results[i][j];
				};
				if (j == "discountType.id") {
					disc = invitation.oData.d.results[i][j];
				}
			}
			var invData = invitation.oData.d.results[i];
			var invPoint = new BMap.Point(
				invitation.oData.d.results[i].longitude,
				invitation.oData.d.results[i].latitude);
			var dist = map.getDistance(currentPoint, invPoint)
				.toFixed(2);
			if (parseFloat(dist) <= parseFloat(keyDist) & cate == keyCate & disc == keyDisc) {
				// var invPoint = new
				// BMap.Point(invitation.oData[i].latitude,invitation.oData[i].longtitude);
				// var walking = new BMap.WalkingRoute(map,
				// {renderOptions:{map: map, autoViewport:
				// false}});
				// walking.search(currentPoint, invPoint);
				var marker = new BMap.Marker(invPoint);
				// marker.setLabel(new
				// BMap.Label(invitation.oData[i].title));
				marker.setTitle(invitation.oData.d.results[i].title);
				if (keyCate == '0550223232fd488db699a7ea9a9fdde0') {
					var icons = new BMap.Icon(
						'http://localhost:8080/bwm/image/sports.ico',
						new BMap.Size(32, 32));
					marker.setIcon(icons);
				};
				if (keyCate == 'a8d3fea970754d6fa8a4aeb8bf3dbaed') {
					var iconc = new BMap.Icon(
						'http://localhost:8080/bwm/image/clothes.ico',
						new BMap.Size(32, 32));
					marker.setIcon(iconc);
				};
				if (keyCate == 'cfe2733e8cbd408db39a5371ab6137ce') {
					var iconf = new BMap.Icon(
						'http://localhost:8080/bwm/image/food.ico',
						new BMap.Size(32, 32));
					marker.setIcon(iconf);
				};

				marker.addEventListener(
					"click",
					$.proxy(function (controller, evt) {
						// var walking = new
						// BMap.WalkingRoute(map,
						// {renderOptions:{map: map,
						// autoViewport: false}});
						// walking.search(currentPoint,
						// evt.target.getPosition());
						// var infoPage = new
						// sap.ui.view({viewName:"bwm.view.InfoWindow",
						// type:sap.ui.core.mvc.ViewType.XML});
						var title = evt.target
							.getTitle();
						var invData = null;
						for (k = 0; k < invitation.oData.d.results.length; k++) {
							if (title == invitation.oData.d.results[k].title) {
								// infoPage.setHeight(300);
								invData = invitation.oData.d.results[k];
								break;
								// infoPage.setModel(new
								// sap.ui.model.json.JSONModel());
								// break;
							}
						}

						for (j in invData) {
							if (j == "creator.id") {
								creator = invData[j];
							};
						}
						// infoPage.getController();
						// infoPage.placeAt('infoWin');
						var user = null;
						var pic_id = null;
						jQuery.ajax({
							url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/User('" + creator + "')",
							dataType: "json",
							async: false,
							success: function (
								data,
								textStatus,
								jqXHR) {
								user = data.d;
								for (j in data.d) {
									if (j == "pic.id") {
										pic_id = data.d[j];
									};
								}
								//invitation = new sap.ui.model.json.JSONModel();
								//invitation.setData(data.d.results);
								// sap.ui.getCore().setModel(invitation);
							},
							error: function (
								jqXHR,
								textStatus,
								errorThrown) {

							}
						});
						jQuery.ajax({
							url: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/Avatar('" + pic_id + "')",
							dataType: "json",
							async: false,
							success: function (
								data,
								textStatus,
								jqXHR) {
								picUser = "http://10.58.132.213:8000" + data.d.pic_path + data.d.pic_name;
								// sap.ui.getCore().setModel(invitation);
							},
							error: function (
								jqXHR,
								textStatus,
								errorThrown) {

							}
						});
						var sContent = "<div id='infoWin' style='line-height:1.8em;font-size:12px;'>" + "<b>Address: </b>" + invData.address + "</br>" + "<img id='userPic' src='" + picUser + "' width='10%' height='10%'/>" + "<b>    " + user.name + "</b></br>" + "</div>"
						var opts = {
							title: '<span id="infoTitle" style="font-size:14px;color:#0A8021">' + invData.title + '</span>'
						};
						var infoWindow = new BMap.InfoWindow(
							sContent, opts);
						this.openInfoWindow(infoWindow);
						document.getElementById("infoWin").onclick = function () {
							controller.getRouter().myNavToWithoutHash({
								currentView: this.getView(),
								targetViewName: "bwm.view.InvitationDetail",
								targetViewType: "XML",
								transition: "slide",
								data: {
									invitation: invData.id
								}
							});
							// controller.getRouter().navTo("invitationDetail", {
							// 	invitation: invData.id
							// });
						};
						//infoWindow.setHeight(300);
						// infoWindow.redraw();
						document.getElementById('userPic').onload = function () {
							infoWindow.redraw();
						};
					}, null, this));
				map.addOverlay(marker);
			}
		};
		circle = new BMap.Circle(currentPoint, keyDist);
		map.addOverlay(circle);
		circle.show();
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