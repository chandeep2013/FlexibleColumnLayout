sap.ui.define([
    "com/mhirj/engdrawing/controller/BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.mhirj.engdrawing.controller.Master", {
            onInit: function () {
                var oRouter = this.getRouter();
                if (oRouter) {
                    oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
                }
            },
            onRouteMatched: function (oEvent) {
                this.setBusyOff();
            },
            onSearch:function(){
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                documentNumber = this.getView().byId("idDocNo").getValue(),
                documentTitle = this.getView().byId("idDocTitle").getValue();
                if(documentNumber == "" || documentTitle ==""){
                    this.displayErrorMessageWithAction("Enter mandatory fields");
                }else{
                    this.getRouter().navTo("Detail", { layout: oNextUIState.layout, docNo: documentNumber,docTitle: documentTitle });
                }
            },
            setDialogBusyOff: function () {
                this.notificationDialog.setBusy(false);
            },
        });
    });
