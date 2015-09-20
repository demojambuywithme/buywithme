jQuery.sap.declare("bwm.view.InvitationsMap");
jQuery.sap.require("bwm.view.BaseController");
var invitation;
var selDist;
var selCate;
var selDisc;
var circle;
var markers;
var sContent =
	"<div id='infoWin'>"+ 
	"</div>";
var infoWindow = new BMap.InfoWindow(sContent);

bwm.view.BaseController.extend("bwm.view.InvitationsMap", {
	
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf bwm.view.home
     */
      onInit: function() {
    	  //invitation = new sap.ui.model.json.JSONModel();
    	  //invitation.loadData("model/Invitation.json",false, false);
    	  jQuery.ajax({
    	        url: "model/Invitation.json",
    	        dataType: "json",
    	        async: false,
    	        success: function(data, textStatus, jqXHR) { 
    	            invitation = new sap.ui.model.json.JSONModel();
    	            invitation.setData(data);
    	            //sap.ui.getCore().setModel(invitation);
    	        },
    	        error: function(jqXHR, textStatus, errorThrown) {
    	            //alert("Oh no, an error occurred");
    	        }
    	    });
    	  
    	  selCate = this.byId("cate");
    	  jQuery.ajax({
    	        url: "model/Category.json",
    	        dataType: "json",
    	        async: false,
    	        success: function(data, textStatus, jqXHR) { 
    	            var catModel = new sap.ui.model.json.JSONModel();
    	            catModel.setData(data);  
    	            selCate.setModel(catModel);
    	        },
    	        error: function(jqXHR, textStatus, errorThrown) {
    	            //alert("Oh no, an error occurred");
    	        }
    	  });
    	  
    	  selDisc = this.byId("disc");
    	  jQuery.ajax({
    	        url: "model/DiscountType.json",
    	        dataType: "json",
    	        async: false,
    	        success: function(data, textStatus, jqXHR) { 
    	            var discModel = new sap.ui.model.json.JSONModel();
    	            discModel.setData(data);  
    	            selDisc.setModel(discModel);
    	        },
    	        error: function(jqXHR, textStatus, errorThrown) {
    	            //alert("Oh no, an error occurred");
    	        }
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
      onAfterRendering: function() {  
    	selDist = this.byId("dist");
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				map = new BMap.Map("__page1-scroll");
				//var point = new BMap.Point(116.331398,39.897445);
				map.centerAndZoom(r.point,17);
				var mk = new BMap.Marker(r.point);
				currentPoint = r.point;
				//mk.setTitle("test");
				mk.setTitle("My Position");
				var iconm = new BMap.Icon('image/myPosition.ico', new BMap.Size(32,32));
				mk.setIcon(iconm);
				map.addOverlay(mk);
				map.panTo(r.point);
				//alert('您的位置：'+r.point.lng+','+r.point.lat);
				
				var keyDist = selDist.getSelectedKey();
				var keyCate = selCate.getSelectedKey();
				var keyDisc = selDisc.getSelectedKey();
				for(i=0; i<invitation.oData.length; i++){
					var cate;
					var disc;
					for(j in invitation.oData[i]){
						if(j=="category.id"){
							cate = invitation.oData[i][j];
						};
						if(j=="discountType.id"){
							disc = invitation.oData[i][j];
						}
					}
					var invPoint = new BMap.Point(invitation.oData[i].longitude, invitation.oData[i].latitude);
					var dist = map.getDistance(currentPoint, invPoint).toFixed(2);
					if (parseFloat(dist) <= parseFloat(keyDist) 
							& cate == keyCate 
							& disc == keyDisc){
						//var invPoint = new BMap.Point(invitation.oData[i].latitude,invitation.oData[i].longtitude);
						var marker = new BMap.Marker( invPoint );
						//marker.setLabel(new BMap.Label(invitation.oData[i].title));
						marker.setTitle(invitation.oData[i].title);
						if (keyCate == '0550223232fd488db699a7ea9a9fdde0'){
							marker.setIcon('image/sports.ico');
						};
						if (keyCate == 'a8d3fea970754d6fa8a4aeb8bf3dbaed'){
							marker.setIcon('image/clothes.ico');
						};
						if (keyCate == 'cfe2733e8cbd408db39a5371ab6137ce'){
							marker.setIcon('image/food.ico');
						};
						
						marker.addEventListener("click", function(evt){          
							   this.openInfoWindow(infoWindow);
							   //图片加载完毕重绘infowindow
							   var infoPage = sap.ui.view({viewName:"bwm.view.InfoWindow", type:sap.ui.core.mvc.ViewType.XML});
							   var title = evt.target.getTitle();
							   for(k=0; k<invitation.oData.length; k++){
								   if(title == invitation.oData[k].title){
									   infoPage.setModel(new sap.ui.model.json.JSONModel(invitation.oData[k]));
									   break;
								   }
							   }
							   infoPage.placeAt('infoWin');
							   //infoWindow.redraw(); 
							   //document.getElementById('infoWin').onload = function (){
								   //alert('open');
								   //infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
							   //};
							});
						map.addOverlay(marker);
						//markers.push(marker);
					}
				};
		    	circle = new BMap.Circle(currentPoint, keyDist);
		    	map.addOverlay(circle);
		    	circle.show();
			}	
			else {
				alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true});
		
      },

    selChange: function(e){
    	map.clearOverlays();
    	circle.remove();
    	
    	var mk = new BMap.Marker(currentPoint);
		mk.setTitle("My Position");
		var iconm = new BMap.Icon('image/myPosition.ico', new BMap.Size(32,32));
		mk.setIcon(iconm);
		map.addOverlay(mk);
		
    	var keyDist = selDist.getSelectedKey();
		var keyCate = selCate.getSelectedKey();
		var keyDisc = selDisc.getSelectedKey();
		for(i=0; i<invitation.oData.length; i++){
			var cate;
			var disc;
			for(j in invitation.oData[i]){
				if(j=="category.id"){
					cate = invitation.oData[i][j];
				};
				if(j=="discountType.id"){
					disc = invitation.oData[i][j];
				}
			}
			var invData = invitation.oData[i];
			var invPoint = new BMap.Point(invitation.oData[i].longitude, invitation.oData[i].latitude);
			var dist = map.getDistance(currentPoint, invPoint).toFixed(2);
			if (parseFloat(dist) <= parseFloat(keyDist)
					& cate == keyCate 
					& disc == keyDisc){
				//var invPoint = new BMap.Point(invitation.oData[i].latitude,invitation.oData[i].longtitude);
				//var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: false}});
				//walking.search(currentPoint, invPoint);
				var marker = new BMap.Marker( invPoint );
				//marker.setLabel(new BMap.Label(invitation.oData[i].title));
				marker.setTitle(invitation.oData[i].title);
				if (keyCate == '0550223232fd488db699a7ea9a9fdde0'){
					var icons = new BMap.Icon('http://localhost:8080/bwm/image/sports.ico', new BMap.Size(32,32));
					marker.setIcon(icons);
				};
				if (keyCate == 'a8d3fea970754d6fa8a4aeb8bf3dbaed'){
					var iconc = new BMap.Icon('http://localhost:8080/bwm/image/clothes.ico', new BMap.Size(32,32));
					marker.setIcon(iconc);
				};
				if (keyCate == 'cfe2733e8cbd408db39a5371ab6137ce'){
					var iconf = new BMap.Icon('http://localhost:8080/bwm/image/food.ico', new BMap.Size(32,32));
					marker.setIcon(iconf);
				};
				marker.addEventListener("click", function(evt){          
				   //var walking = new BMap.WalkingRoute(map, {renderOptions:{map: map, autoViewport: false}});
				   //walking.search(currentPoint, evt.target.getPosition());
				   this.openInfoWindow(infoWindow);
				   //图片加载完毕重绘infowindow
				   infoWindow.setHeight(300);
				   var infoPage = sap.ui.view({viewName:"bwm.view.InfoWindow", type:sap.ui.core.mvc.ViewType.XML});
				   var title = evt.target.getTitle();
				   for(k=0; k<invitation.oData.length; k++){
					   if(title == invitation.oData[k].title){
						   infoPage.setModel(new sap.ui.model.json.JSONModel(invitation.oData[k]));
						   break;
					   }
				   }
				   //infoPage.getController();
				   infoPage.placeAt('infoWin');
				   
				   //infoWindow.redraw(); 
				   //document.getElementById('infoWin').onload = function (){
					   //alert('open');
					   //infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
				   //};
				});
				map.addOverlay(marker);
			}
		};
    	circle = new BMap.Circle(currentPoint, keyDist);
    	map.addOverlay(circle);
    	circle.show();
    },
    toInvitations: function(){
		this.getRouter().navTo("invitations");
    },
    toMine: function(){
		this.getRouter().navTo("mine");
    }
    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf bwm.view.home
     */
    //  onExit: function() {
    //
    //  }

});
