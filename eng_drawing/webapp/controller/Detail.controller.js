sap.ui.define([
    "com/mhirj/engdrawing/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/f/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController,JSONModel,library) {
        "use strict";
        return BaseController.extend("com.mhirj.engdrawing.controller.Detail", {
            onInit: function () {
                var oExitButton = this.getView().byId("exitFullScreenBtn"),
                    oEnterButton = this.getView().byId("enterFullScreenBtn");
                var oRouter = this.getRouter();
                if (oRouter) {
                    oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
                }
                [oExitButton, oEnterButton].forEach(function (oButton) {
                    oButton.addEventDelegate({
                        onAfterRendering: function () {
                            if (this.bFocusFullScreenButton) {
                                this.bFocusFullScreenButton = false;
                                oButton.focus();
                            }
                        }.bind(this)
                    });
                }, this);
            },
            onRouteMatched: function (oEvent) {
                var docNo = oEvent.getParameter("arguments").docNo;
                var docTitle = oEvent.getParameter("arguments").docTitle;
                var sPath = jQuery.sap.getModulePath("com.mhirj.engdrawing", "/model/documentcollection.json");
                // initialize the model with the JSON file
                var oModel = new JSONModel(sPath);
                // set the model to the view
                this.getView().setModel(oModel, "oModel");
            },
            onListItemPress:function(){
                var documentNumber = "1234";
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                this.getRouter().navTo("DetailDetail", { layout: library.LayoutType.ThreeColumnsMidExpanded, attachmentNo: documentNumber });
            },
            handleFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.getRouter().navTo("Detail", { layout: sNextLayout, docNo: "1234", docTitle: "title" });
            },
            handleExitFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                this.getRouter().navTo("Detail", { layout: sNextLayout, docNo: "1234", docTitle: "title" });
            },
            handleClose: function () {
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
                this.getRouter().navTo("Detail", { layout: sNextLayout, docNo: "1234", docTitle: "title" });
            }
        });
    });
