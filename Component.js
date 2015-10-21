jQuery.sap.includeStyleSheet("css/bwm.css");
jQuery.sap.declare("bwm.Component");
jQuery.sap.require("bwm.MyRouter");

sap.ui.core.UIComponent
    .extend(
        "bwm.Component", {
            metadata: {
                name: "buy with me",
                version: "1.0",
                includes: [],
                dependencies: {
                    libs: ["sap.m", "sap.ui.layout"],
                    components: []
                },
                rootView: "bwm.view.App",
                config: {
                    resourceBundle: "i18n/i18n.properties",
                    serviceConfig: {
                        name: "bwm",
                        serviceUrl: "http://10.58.132.213:8000/BWM/services/bwm.xsodata/"
                    }
                },
                routing: {
                    config: {
                        routerClass: bwm.MyRouter,
                        viewType: "XML",
                        viewPath: "bwm.view",
                        targetAggregation: "pages",
                        clearTarget: false
                    },
                    routes: [{
                        pattern: "",
                        name: "navigation",
                        view: "Navigation",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "invitations",
                        name: "invitations",
                        view: "Invitations",
                        targetAggregation: "pages",
                        targetControl: "idAppControl",
                        subroutes: [{
                            pattern: "invitationDetail/{invitation}",
                            name: "invitationDetail",
                            view: "InvitationDetail"
                        }, {
                            pattern: "invitationMap/{invitation}",
                            name: "invitationDetailMap",
                            view: "InvitationDetailMap"
                        }]
                    }, {
                        pattern: "invitationsMap",
                        name: "invitationsMap",
                        view: "InvitationsMap",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "invitationDetail",
                        name: "jumpToInvitationDetail",
                        view: "InvitationDetail",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "invitationDetailMap",
                        name: "jumpToinvitationDetailMap",
                        view: "InvitationDetailMap",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "newInvitation",
                        name: "newInvitation",
                        view: "NewInvitation",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "chat/{invitation}",
                        name: "chat",
                        view: "Chat",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "mine",
                        name: "mine",
                        view: "Mine",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }, {
                        pattern: "logon",
                        name: "logon",
                        view: "Logon",
                        targetAggregation: "pages",
                        targetControl: "idAppControl"
                    }]
                }
            },
            init: function() {

                sap.ui.core.UIComponent.prototype.init.apply(this,
                    arguments);

                var mConfig = this.getMetadata().getConfig();

                // always use absolute paths relative to our own
                // component
                // (relative paths will fail if running in the Fiori
                // Launchpad)
                var rootPath = jQuery.sap.getModulePath("bwm");

                // set i18n model
                var i18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleUrl: [rootPath,
                        mConfig.resourceBundle
                    ].join("/")
                });
                this.setModel(i18nModel, "i18n");

                // Create and set domain model to the component
                var sServiceUrl = mConfig.serviceConfig.serviceUrl;

                // Mock Server
                if (jQuery.sap.getUriParameters().get("responderOn") === "true") {
                    jQuery.sap.require("sap.ui.core.util.MockServer");
                    var oMockServer = new sap.ui.core.util.MockServer({
                        rootUri: sServiceUrl
                    });
                    var sMetadataUrl = rootPath + "/model/metadata.xml";
                    var sMockdataBaseUrl = rootPath + "/model/";
                    oMockServer
                        .simulate(sMetadataUrl, sMockdataBaseUrl);
                    oMockServer.start();
                }

                var oModel = new sap.ui.model.odata.ODataModel(
                    sServiceUrl, true);
                this.setModel(oModel);

                // set device model
                var deviceModel = new sap.ui.model.json.JSONModel({
                    isTouch: sap.ui.Device.support.touch,
                    isNoTouch: !sap.ui.Device.support.touch,
                    isPhone: sap.ui.Device.system.phone,
                    isNoPhone: !sap.ui.Device.system.phone,
                    listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
                    listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
                });
                deviceModel.setDefaultBindingMode("OneWay");
                this.setModel(deviceModel, "device");

                //mock users in system
                var users = [{
                	uuid: "311c0ab7fed848c7857f8f5204faf111",
                    id: "jay",
                    name: "Zhao Jay"
   
                }, {
                	uuid: "4defa41b7b934dab9f36627b32fb7bb7",
                    id: "chunyang",
                    name: "Xu Chunyang"
                }, {
                	uuid: "81794267dc2e4e5e9619e51e37bfb1de",
                    id: "aaron",
                    name: "Shen Aaron"
                }, {
                	uuid: "877da535455a47b893b19e9ab8a1f2c2",
                    id: "xin",
                    name: "Jiang Xin"
                }, {
                	uuid: "6273876ccd96464cae261fd8c390267f",
                    id: "loring",
                    name: "Wu Loring"
                }];
                this.setModel(new sap.ui.model.json.JSONModel(users), "users");


                this.getRouter().initialize();
            }
        });
