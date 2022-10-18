MainsessionURL = oStorage.get("sessionURL");
sap.ui.define([
    "com/mhirj/engdrawing/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("com.mhirj.engdrawing.controller.Terms", {
        onInit: function () {
            var data = oStorage.get("appSessionData");
            console.log(data[0].TermsAndConditions);
            this.setBusyOff();
        },
        onAccept: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Master", {
                layout: "OneColumn"
            });
        },
        onReject: function () {
            var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
            var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                target: {
                    semanticObject: "workzone",
                    action: "home"
                },
            })) || "";
            
            oCrossAppNavigator.toExternal({
                target: {
                    shellHash: hash
                }
            });
        },
        setDialogBusyOff: function () {
            this.notificationDialog.setBusy(false);
        },
        onSelect: function(oEvent) {
            var check = oEvent.getParameter("selected");
            
            if (check === true) {
                var sessionvalue = [{
                    TermsAndConditions:check, 
                  }]
                oStorage.put("appSessionData", sessionvalue); 
                this.getView().byId("idAccept").setEnabled(true);
            } else {
                this.getView().byId("idAccept").setEnabled(false);
            }
        }

    });

});