jQuery.sap.declare("bwm.view.InvitationsMap");
jQuery.sap.require("bwm.view.BaseController");
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
		this.getComponent().getModel().read('/Invitation', {
			success: $.proxy(function (data) {
				dfd.resolve(data.results);
			}, this)
		});

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
			oModel.read("/User('" + invData["creator.id"] + "')", {
				success: dfd.resolve
			});
			return dfd;
		}


		var readAvatar = function (creator) {
			var dfd = $.Deferred();
			oModel.read("/Avatar('" + creator["pic.id"] + "')", {
				success: function (avatar) {
					dfd.resolve(creator, avatar)
				}
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
			infoWindow.addEventListener('open', function () {
				$('#infoWin').on('click', function () {

					controller.getRouter().myNavToWithoutHash({
						currentView: controller.getView(),
						targetViewName: "bwm.view.InvitationDetail",
						targetViewType: "XML",
						transition: "slide",
						data: {
							invitation: invData.id
						}
					});
				});
				$("#userPic").load(function () {
					$("#userPic").off('load');
					infoWindow.redraw();
				});
			});
			evt.target.openInfoWindow(infoWindow);

			infoWindow.addEventListener('close', function () {
				$('#infoWin').remove();
				$("#userPic").remove();
			});

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