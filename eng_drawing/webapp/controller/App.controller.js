MainsessionURL = oStorage.get("sessionURL");
sap.ui.define([
    "com/mhirj/engdrawing/controller/BaseController"
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.mhirj.engdrawing.controller.App", {
            onInit: function () {
                var content = window.location.hash;
                var contentPos = content.search('/Detail');
                var iPos = content.search("/False/EndColumnFullScreen");
                if (iPos < 0 && contentPos > 0) {
                    window.location.href = window.location.href.split('/Detail')[0].slice(0, -1);
                }

                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

                var data = oStorage.get("appSessionData");
                //console.log(data[0].TermsAndConditions);
                if (data[0].TermsAndConditions == true) {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("Master", {
                        layout: "OneColumn"
                    });
                }
            },
            onBeforeRouteMatched: function (oEvent) {

                var oModel = this.getOwnerComponent().getModel();

                var sLayout = oEvent.getParameters().arguments.layout;

                // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
                if (!sLayout) {
                    var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                    sLayout = oNextUIState.layout;
                }

                // Update the layout of the FlexibleColumnLayout
                if (sLayout) {
                    oModel.setProperty("/layout", sLayout);
                }
            },

            onRouteMatched: function (oEvent) {
                var sRouteName = oEvent.getParameter("name"),
                    oArguments = oEvent.getParameter("arguments");

                this._updateUIElements();

                // Save the current route name
                this.currentRouteName = sRouteName;
            },

            onStateChanged: function (oEvent) {
                var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
                    sLayout = oEvent.getParameter("layout");

                this._updateUIElements();

                // Replace the URL with the new layout if a navigation arrow was used
                if (bIsNavigationArrow) {
                    this.oRouter.navTo(this.currentRouteName, { layout: sLayout }, true);
                }
            },

            // Update the close/fullscreen buttons visibility
            _updateUIElements: function () {
                var oModel = this.getOwnerComponent().getModel();
                var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
                oModel.setData(oUIState);
            },

            onExit: function () {
                this.oRouter.detachRouteMatched(this.onRouteMatched, this);
                this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            }

        });
    });
