sap.ui.define([
    "com/mhirj/engdrawing/controller/BaseController",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,JSONModel) {
        "use strict";
        return BaseController.extend("com.mhirj.engdrawing.controller.DetailDetail", {
            onInit: function () {
                var oRouter = this.getRouter();
                if (oRouter) {
                    oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
                }
            },
            onRouteMatched: function (oEvent) {
                var docNo = oEvent.getParameter("arguments").attachmentNo;
                var sPath = jQuery.sap.getModulePath("com.mhirj.engdrawing", "/model/documentcollection.json");
                // initialize the model with the JSON file
                var oModel = new JSONModel(sPath);
                // set the model to the view
                this.getView().setModel(oModel, "oModel");
            },
            handleBackToMainScreen: function(oEvent) {
                this.getRouter().navTo("Master");
            },
            handleFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/fullScreen");
                this.getRouter().navTo("DetailDetail", { layout: sNextLayout, attachmentNo: "1234"});
            },
            handleExitFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
                this.getRouter().navTo("DetailDetail", { layout: sNextLayout, attachmentNo: "1234"});
            },
            handleClose: function () {
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/closeColumn");
                this.getRouter().navTo("DetailDetail", { layout: sNextLayout, docGroup: this._DocGroup, attachmentNo: "1234"});
            }
        });
    });
