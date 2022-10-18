sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/odata/ODataModel"
], function (Controller, UIComponent, MessageBox, ODataModel) {
    "use strict";

    return Controller.extend("com.mhirj.dms.zmhirjdmscp.controller.BaseController", {
        onInit: function () {
            this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
        },

        displayErrorMessageWithAction: function(errorString, onCloseFunction) {
            MessageBox.show(
                errorString, {
                    icon: sap.m.MessageBox.Icon.ERROR,
                    title: "Error",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: onCloseFunction,
                    styleClass: "sapUiSizeCompact buttonBlack"
                }
            );
        },

        displaySuccessMessageWithAction: function(successString, onCloseFunction) {
            MessageBox.show(
                successString, {
                    icon: sap.m.MessageBox.Icon.SUCCESS,
                    title: "Success",
                    actions: [sap.m.MessageBox.Action.OK],
                    onClose: onCloseFunction,
                    styleClass: "sapUiSizeCompact buttonBlack"
                }
            );
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        getResourceBundle: function () {
            var oResourceBundle = this.getOwnerComponent().getModel("i18n")._oResourceBundle;
            return oResourceBundle;
        },

        getModel: function (sName) {
            if (sName) {
                return this.getOwnerComponent().getModel(sName);
            } else {
                return this.getOwnerComponent().getModel();
            }
        },

        getLocalDataModel: function () {
            return this.getOwnerComponent().getModel("LocalDataModel");
        },

        getApplicationID: function () {
            return this.getOwnerComponent().getManifestEntry("/sap.app").id.replaceAll(".", "");
        },

        getApplicationVersion: function () {
            return this.getOwnerComponent().getManifestEntry("/sap.app").applicationVersion.version;
        },

        getApplicationRouter: function () {
            return "/" + this.getOwnerComponent().getManifestEntry("/sap.cloud").service;
        },

        getCompleteURL: function () {
            return this.getApplicationRouter() + "." + this.getApplicationID() + "-" + this.getApplicationVersion();
        },

        // getBusyMainContentID: function() {
        //     return sap.ui.getCore().byId("container-com.mhirj.dms.zmhirjdmscp---idRootView");
        //     // return sap.ui.getCore().byId("application-DMSLIBSemObj-DMSLIB-component---idRootView");
        // },

        setBusyOn: function() {
            // var mainContent = this.getBusyMainContentID();
            // mainContent.setBusyIndicatorDelay(0);
            // mainContent.setBusy(true);

            window.appView.setBusyIndicatorDelay(0);
            window.appView.setBusy(true);
        },

        setBusyOff: function() {
            // var mainContent = this.getBusyMainContentID();
            // mainContent.setBusy(false);

            window.appView.setBusy(false);
        },

        getoAuthToken: function (successCallBack, errorCallBack) {
            $.ajax({
                "url": this.getCompleteURL() + "/getOAuthToken",
                "method": "GET",
                "success": function (result, xhr, successData) {
                    successCallBack(result, xhr, successData)
                }.bind(this),
                "error": function (errorData) {
                    errorCallBack(errorData);
                }.bind(this)
            });
        },

        readDataFromSystem: function (model, entityName, successCallBack, errorCallBack) {
            this.getModel(model).read(entityName, {
                "success": function (successData) {
                    successCallBack(successData);
                }.bind(this),
                "error": function (errorData) {
                    errorCallBack(errorData);
                }.bind(this)
            });
        },

        readDataFromSystemWithUrlParameters: function (model, entityName, urlParameters, successCallBack, errorCallBack) {
            this.getModel(model).read(entityName, {
                "urlParameters": urlParameters,
                "success": function (successData) {
                    successCallBack(successData);
                }.bind(this),
                "error": function (errorData) {
                    errorCallBack(errorData);
                }.bind(this)
            });
        },
        getDropDownData: function (dropDownName) {
            // if (this.getLocalDataModel().getProperty("/DMS_Model/").hasOwnProperty("UserInfo")) {
            //     this.userInfoDeferred.resolve();
            //     return;
            // }
            $.ajax({
               "url": this.getCompleteURL() + "/drop-down/getDropDownData",
               // "url": "/drop-down/getDropDownData",
                "method": "POST",
                "data": JSON.stringify({
                    "dropDownName": dropDownName
                }),
                "xhrFields": {
                    "withCredentials": true
                },
                "headers": {
                    "Content-Type": "application/json"
                },
                "success": function (result, xhr, successData) {
                   // this.setBusyOff();
                    var data = JSON.parse(result.value);
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/" + dropDownName, data);

                    if (dropDownName === "DMS_CONFIG_DETAILS") {
                        this.dropDownDeferred.resolve();
                        this.getScreenData();
                    }
                }.bind(this),
                "error": function (errorData) {
                    var returnValue = errorData.responseJSON.ErrorData;
                    console.log(returnValue);
                }.bind(this)
            });
        },
        getUserDetails: function () {
            if (this.getLocalDataModel().getProperty("/DMS_Model/").hasOwnProperty("UserInfo")) {
                this.userInfoDeferred.resolve();
                return;
            }

            $.ajax({
                "url": this.getCompleteURL() + "/user-info/UserInfoEntity",
              //  "url": "/user-info/UserInfoEntity",
                "method": "GET",
                "xhrFields": {
                    "withCredentials": true
                },
                "headers": {
                    "Content-Type": "application/json"
                },
                "success": function (result, xhr, successData) {
                    this.getLocalDataModel().setProperty("/DMS_Model/UserInfo/", result.value[0]);
                    this.userInfoDeferred.resolve();
                    //   this.getTreeTableData();
                    this.getBusinessPartnerData();
                }.bind(this),
                "error": function (errorData) {
                    this.userInfoDeferred.reject();
                }.bind(this)
            });
        },
        getBusinessPartnerData: function () {
            if (this.getLocalDataModel().getProperty("/DMS_Model/").hasOwnProperty("BPData")) {
                this.bpDataDeferred.resolve();
                return;
            }
           // var ifCustSup = "SUP";
            var ifCustSup = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/SAP_Org_Data/OrgType");
            var configDetails = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_CONFIG_DETAILS/"),
              oDataModel = new ODataModel (this.getCompleteURL() + "/V1/API_BUSINESS_PARTNER", {
                //oDataModel = new ODataModel("/V1/API_BUSINESS_PARTNER", {
                    "headers": {
                        "APIKey": configDetails.IMPERSONATE_USER_API_KEY
                    }
                });
            var urlParameters;
            if (ifCustSup == "CUS") {
                urlParameters = {
                    $filter: "BusinessPartnerGrouping eq 'ZCCO' and BusinessPartnerType eq ''",     //Filter for Only Customer
                    $select: "BusinessPartner,BusinessPartnerFullName,BusinessPartnerGrouping,BusinessPartnerType"
                }
            } else if (ifCustSup == "SUP") {
                urlParameters = {
                    $filter: "BusinessPartnerGrouping eq 'ZAVI' or (BusinessPartnerGrouping eq 'ZCCO' and BusinessPartnerType eq 'ZSUP')",//Filter for Only Supplier
                    $select: "BusinessPartner,BusinessPartnerFullName,BusinessPartnerGrouping,BusinessPartnerType"
                }
            } else if (ifCustSup == "ASF") {
                urlParameters = {
                    $filter: "BusinessPartnerGrouping eq 'ZCCO' and BusinessPartnerType eq 'ZASF'", //Filter for Only ASF/MRO
                    $select: "BusinessPartner,BusinessPartnerFullName,BusinessPartnerGrouping,BusinessPartnerType"
                }
            }else if (ifCustSup == "OTH") {
                urlParameters = {
                    $filter: "BusinessPartnerGrouping eq 'ZCCO' and BusinessPartnerType eq 'ZOTH'", //Filter for Only Other Support Organization
                    $select: "BusinessPartner,BusinessPartnerFullName,BusinessPartnerGrouping,BusinessPartnerType"
                }
            }

            var successCallBack = function (successData) {
                this.getLocalDataModel().setProperty("/DMS_Model/BPData/", successData.results);
                this.bpDataDeferred.resolve();
            }.bind(this),
                errorCallBack = function (errorData) {
                    this.bpDataDeferred.reject();
                }.bind(this);

            oDataModel.read("/A_BusinessPartner", {
                "urlParameters": urlParameters,
                "success": successCallBack,
                "error": errorCallBack
            });
        }

    });
});