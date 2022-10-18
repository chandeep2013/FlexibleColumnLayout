
sap.ui.define([
    "com/mhirj/dms/zmhirjdmscp/controller/BaseController"
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.mhirj.dms.zmhirjdmscp.controller.App", {
            onInit: function () {
                var content = window.location.hash;
                var iPos = content.search("/False/EndColumnFullScreen");
                // if(iPos < 1 && content.length > 0){
                //     window.location.href = window.location.href.split('#')[0];
                // }
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			    this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
            },
            onBeforeRouteMatched: function(oEvent) {

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
                    this.oRouter.navTo(this.currentRouteName, {layout: sLayout}, true);
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
