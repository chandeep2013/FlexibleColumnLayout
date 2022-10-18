sap.ui.define([
    "com/mhirj/dms/zmhirjdmscp/controller/BaseController",
    "com/mhirj/dms/zmhirjdmscp/util/Formatter",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/f/library'
],
    function (BaseController, formatter, ODataModel, Filter, FilterOperator, fioriLibrary) {
        "use strict";

        return BaseController.extend("com.mhirj.dms.zmhirjdmscp.controller.TreeList", {
            formatter: formatter,
            onInit: function () {
                var oRouter = this.getRouter();
                if (oRouter) {
                    oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
                }
            },

            onRouteMatched: function (oEvent) {
                if (oEvent.getParameter("name") === "RouteTreeScreen") {
                    // this.setBusyOff();
                    this.dropDownDeferred = $.Deferred();
                    this.getDropDownData("DMS_CONFIG_DETAILS");
                }
            },

           
            getScreenData: function () {
                this.userInfoDeferred = $.Deferred();
                this.treeTableDataDeferred = $.Deferred();
             //   this.bpDataDeferred = $.Deferred();

                this.getUserDetails();
                this.getTreeTableData();
                //  this.getBusinessPartnerData();

             //   $.when(this.bpDataDeferred, this.userInfoDeferred, this.treeTableDataDeferred).then(function () {
                $.when( this.userInfoDeferred, this.treeTableDataDeferred).then(function () {
                    // this.getDropDownData("DMS_CONFIG_DETAILS");
                    //this.getDropDownData("DMS_AIRCRAFT_INFO");
                    this.getDropDownData("DMS_SUPPLIERS_LIST");
                    this.getDropDownData("DMS_MAIN_ATA");
                    this.getDropDownData("DMS_SUB_ATA");
                    this.getDropDownData("DMS_PART_TYPE_INFO");
                    this.getDropDownData("DMS_EVENT_WORKING_GOUP");

                    var idTree = this.getView().byId("idTree");
                    idTree.onItemExpanderPressed(idTree.getItems()[0], true);

                    this.setBusyOff();
                }.bind(this))
            },

            setDialogBusyOn: function () {
                this.notificationDialog.setBusyIndicatorDelay(0);
                this.notificationDialog.setBusy(true);
            },

            setDialogBusyOff: function () {
                this.notificationDialog.setBusy(false);
            },

           
            getTreeTableData: function () {
                if (this.getLocalDataModel().getProperty("/DMS_Model/").hasOwnProperty("TreeModel")) {
                    this.treeTableDataDeferred.resolve();
                    return;
                }

                var isCustSup = "C";
                // var isCustSup = "S";
                $.ajax({
                    "url": this.getCompleteURL() + "/my-dms/getTreeTable(isCustSup='" + isCustSup + "')",
                   // "url": "/my-dms/getTreeTable(isCustSup='" + isCustSup + "')",
                    "method": "GET",
                    "xhrFields": {
                        "withCredentials": true
                    },
                    "success": function (result, xhr, successData) {
                        var treeArray = [];
                        if (result.value.length > 0) {
                            treeArray = result.value;
                        }

                        this.getLocalDataModel().setProperty("/DMS_Model/TreeModel", treeArray);

                        if (treeArray.length > 0) {
                            var idTree = this.getView().byId("idTree");
                            idTree.onItemExpanderPressed(idTree.getItems()[0], true);
                        }

                        this.treeTableDataDeferred.resolve();
                    }.bind(this),
                    "error": function (errorData) {
                        debugger
                        this.treeTableDataDeferred.reject();
                        var returnValue = errorData.responseJSON.ErrorData;
                        console.log(returnValue);
                    }.bind(this)
                });
            },



            selectedTreeItemPress: function (oEvent) {
                //   var idBPCombobox = this.getView().byId("idBPCombobox"),
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1);
                var listItem = oEvent.getSource(),
                    path = listItem.getBindingContext("LocalDataModel").getPath(),
                    parentPath = path.substring(0, path.split("/", 4).join("/").length),
                    parent = this.getLocalDataModel().getProperty(path + "/parent"),
                    docTypeName = "",
                    bookMarkString = "";
                 //   dynamicJson = [];

                // if (idBPCombobox && !idBPCombobox.getVisible()){
                //     idBPCombobox.setVisible(true);
                // }

                this.getLocalDataModel().setProperty("/DMS_Model/SelectedTreeModel", {});
                this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/", {});
                

                if (parent !== null) {
                    var docGroup = this.getLocalDataModel().getProperty(parentPath + "/code"),
                        docGroupName = this.getLocalDataModel().getProperty(parentPath + "/name"),

                        docTypeName = this.getLocalDataModel().getProperty(path + "/name"),
                        docTypeCode = this.getLocalDataModel().getProperty(path + "/code"),
                        bookMarkString = docGroupName + " / " + docTypeName;

                    this.getLocalDataModel().setProperty("/DMS_Model/SelectedTreeModel", {
                        "DocumentType": docTypeCode,
                        "DocumentTypeName": docTypeName,
                        "DocumentGroup": docGroup,
                        "DocumentGroupName": docGroupName,
                        "LibType": this.getLocalDataModel().getProperty(parentPath + "/libtype")
                    });
                }

                this.getLocalDataModel().setProperty("/DMS_Model/BookMarkString", bookMarkString);
                this.getRouter().navTo("RouteDetailScreen", { layout: oNextUIState.layout, docGroup: docGroup,DocumentType: docTypeCode });
            },

            resetData: function (oEvent) {
                debugger
            },

          
            dialogTreeBatchRead: function () {
                this.dialogReadSuccessHandler = function (successData, response) {
                    this.oDataModel.detachBatchRequestCompleted(this.dialogReadSuccessHandler);

                    if (this.notificationDialog) {
                        this.notificationDialog.destroy(true);
                        this.notificationDialog = null;
                    }

                    this.notificationDialog = sap.ui.xmlfragment("notificationDialogFragment",
                        "com.mhirj.dms.zmhirjdmscp.view.fragments.NotificationDialog", this);

                    this.getView().addDependent(this.notificationDialog);

                    this.setBusyOff();
                    this.notificationDialog.open();

                }.bind(this);
                this.dialogReadErrorHandler = function (errorData, response) {
                    this.oDataModel.detachBatchRequestFailed(this.dialogReadErrorHandler);
                    this.setBusyOff();
                }.bind(this);

                var treeData = this.getLocalDataModel().getProperty("/DMS_Model/TreeModel"),
                    orgID = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/CostCenter/"),
                    emailID = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/Email/"),
                    usertype="C";


                if (treeData.length > 0) {
                    var mParams = {
                        "success": function (successData, response) {
                            var data = this.getLocalDataModel().getProperty("/DMS_Model/TreeModel/"),
                                firstIndex = -1,
                                secondIndex = -1,
                                result = data.find(function (value, index) {
                                    if (value.name === successData.doctype_Text) {
                                        firstIndex = index;
                                        return value.Categories.find(function (innerValue, innerIndex) {
                                            if (innerValue.code === successData.doctype) {
                                                secondIndex = innerIndex;
                                                return innerIndex;
                                            }
                                        }.bind(this))
                                    }
                                }.bind(this));

                            if (firstIndex !== -1 && secondIndex !== -1) {
                                var x = this.getLocalDataModel().getProperty("/DMS_Model/TreeModel/" + firstIndex + "/Categories/" + secondIndex);
                                if (x.hasOwnProperty("subscribedformail")) {
                                    x.subscribedformail = successData.subscribedformail;
                                } else {
                                    x["subscribedformail"] = successData.subscribedformail;
                                }

                                if (x.hasOwnProperty("userstatus")) {
                                    x.userstatus = successData.userstatus;
                                } else {
                                    x["userstatus"] = successData.userstatus;
                                }

                                this.getLocalDataModel().setProperty("/DMS_Model/TreeModel/" + firstIndex + "/Categories/" + secondIndex, x);
                            }
                        }.bind(this)
                    }
                    for (var x = 0; x < treeData.length; x++) {
                        if (treeData[x].Categories.length > 0) {
                            for (var y = 0; y < treeData[x].Categories.length; y++) {
                                var docType = treeData[x].Categories[y].code;
                                this.oDataModel.read("/ZZ1_DMS_NOTIF_SUB(orgid='" + orgID + "',mailid='" + emailID + "',doctype='" + docType + "',usertype='" + usertype + "')", mParams);
                            }
                        }
                    }

                    this.oDataModel.attachBatchRequestCompleted(null, this.dialogReadSuccessHandler);
                    this.oDataModel.attachBatchRequestFailed(null, this.dialogReadErrorHandler);
                }
            },

            openEmailNotificationDialog: function (oEvent) {
                this.setBusyOn();
                this.createOnlyRecords = [];
                this.updateOnlyRecords = [];
                this.createUpdateRecords = [];
                this.oDataModel = this.getModel("DMS_SAP_Data_Model");
                this.successMessage = null;
                this.onCloseFunction = null;

                this.dialogTreeBatchRead();

            },

            switchChange: function (oEvent) {
                var eMail = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/Email/"),
                    userstatus = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/Active/"),
                    orgType = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/SAP_Org_Data/OrgType/"),
                    orgId = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/CostCenter/"),
                    source = oEvent.getSource(),
                    switchState = source.getState(),
                    docType = source.getBindingContext("LocalDataModel").getObject().code,
                    obj = {
                        "orgid": orgId,
                        "mailid": eMail,
                        "doctype": docType,
                        "orgtype": orgType,
                        "userstatus": userstatus,
                        "subscribedformail": switchState,
                        "usertype": "C"
                    }

                this.createUpdateRecords.push(obj);
            },

            notificationCancel: function (oEvent) {
                this.notificationDialog.close();
                this.notificationDialog.destroy(true);
                this.notificationDialog = null;
            },

            notificationSave: function (oEvent) {
                if (this.createUpdateRecords.length > 0) {
                    this.setDialogBusyOn();
                    this.successMessage = this.getResourceBundle().getText("emailNotificationSaved");
                    this.onCloseFunction = function (oEvent) {
                        this.setDialogBusyOff();
                        this.notificationCancel();
                    }.bind(this);

                    this.notificationBatchRead();
                }
            },

            notificationBatchUpdate: function () {
                this.updateSuccessHandler = function (successData, response) {
                    this.oDataModel.detachBatchRequestCompleted(this.updateSuccessHandler);
                    this.notificationUpdateDeferred.resolve();
                }.bind(this);
                this.updateErrorHandler = function (errorData, response) {
                    this.oDataModel.detachBatchRequestFailed(this.updateErrorHandler);
                    this.notificationUpdateDeferred.reject();
                }.bind(this);


                for (var x = 0; x < this.updateOnlyRecords.length; x++) {
                    this.oDataModel.update("/ZZ1_DMS_NOTIF_SUB(orgid='" + this.updateOnlyRecords[x].orgid + "',mailid='" + this.updateOnlyRecords[x].mailid + "',doctype='" + this.updateOnlyRecords[x].doctype + "',usertype='" + this.updateOnlyRecords[x].usertype + "')", this.updateOnlyRecords[x], null);
                }

                this.oDataModel.attachBatchRequestCompleted(null, this.updateSuccessHandler);
                this.oDataModel.attachBatchRequestFailed(null, this.updateErrorHandler);
            },

            notificationBatchCreate: function () {
                this.createSuccessHandler = function (successData, response) {
                    this.oDataModel.detachBatchRequestCompleted(this.createSuccessHandler);
                    this.notificationCreateDeferred.resolve();
                }.bind(this);
                this.createErrorHandler = function (errorData, response) {
                    this.oDataModel.detachBatchRequestFailed(this.createErrorHandler);
                    this.notificationCreateDeferred.reject();
                }.bind(this);

                for (var x = 0; x < this.createOnlyRecords.length; x++) {
                    this.oDataModel.create("/ZZ1_DMS_NOTIF_SUB", this.createOnlyRecords[x], null);
                }

                this.oDataModel.attachBatchRequestCompleted(null, this.createSuccessHandler);
                this.oDataModel.attachBatchRequestFailed(null, this.createErrorHandler);
            },

            notificationBatchRead: function () {
                this.readSuccessHandler = function (successData, response) {
                    this.oDataModel.detachBatchRequestCompleted(this.readSuccessHandler);
                    for (var x = 0; x < successData.mParameters.requests.length; x++) {
                        var data = successData.mParameters.requests[x],
                            url = data.url,
                            orgId = data.url.substring(data.url.indexOf('orgid=') + 7, data.url.indexOf('mailid') - 2),
                            eMailID = data.url.substring(data.url.indexOf('mailid=') + 8, data.url.indexOf('doctype') - 2),
                            // docType = data.url.substring(data.url.indexOf('doctype=') + 9, data.url.indexOf('?sap-client') - 2),
                            docType = data.url.substring(data.url.indexOf("doctype=") + 9, data.url.indexOf('usertype') - 2),
                            usertype = data.url.substring(data.url.indexOf("usertype=") + 10, data.url.lastIndexOf(")") - 1),
                            result = this.createUpdateRecords.filter(function (value, index, array) {
                                return ((value.orgid === orgId) && (value.mailid === eMailID) && (value.doctype === docType) &&(value.usertype === usertype))
                            }.bind(this));

                        if (data.response.statusCode === "200") {
                            if (result.length > 0) {
                                this.updateOnlyRecords.push(result[0]);
                            }
                        } else {
                            if (result.length > 0) {
                                this.createOnlyRecords.push(result[0]);
                            }
                        }
                    }

                    if ((this.createOnlyRecords.length > 0) && (this.updateOnlyRecords.length > 0)) {
                        this.notificationCreateDeferred = $.Deferred();
                        this.notificationUpdateDeferred = $.Deferred();
                        this.notificationBatchCreate();
                        this.notificationBatchUpdate();

                        $.when(this.notificationCreateDeferred, this.notificationUpdateDeferred).then(function () {
                            this.displaySuccessMessageWithAction(this.successMessage, this.onCloseFunction);
                        }.bind(this))
                    } else if (this.createOnlyRecords.length > 0) {
                        this.notificationCreateDeferred = $.Deferred();
                        this.notificationBatchCreate();

                        $.when(this.notificationCreateDeferred).then(function () {
                            this.displaySuccessMessageWithAction(this.successMessage, this.onCloseFunction);
                        }.bind(this))
                    } else if (this.updateOnlyRecords.length > 0) {
                        this.notificationUpdateDeferred = $.Deferred();
                        this.notificationBatchUpdate();

                        $.when(this.notificationUpdateDeferred).then(function () {
                            this.displaySuccessMessageWithAction(this.successMessage, this.onCloseFunction);
                        }.bind(this))
                    } else {
                        this.setDialogBusyOff();
                    }
                }.bind(this);
                this.readErrorHandler = function (errorData, response) {
                    this.oDataModel.detachBatchRequestFailed(this.readErrorHandler);
                    this.setDialogBusyOff();
                    debugger
                }.bind(this);

                for (var x = 0; x < this.createUpdateRecords.length; x++) {
                    var orgID = this.createUpdateRecords[x].orgid,
                        emailID = this.createUpdateRecords[x].mailid,
                        docType = this.createUpdateRecords[x].doctype,
                        usertype=this.createUpdateRecords[x].usertype;

                    this.oDataModel.read("/ZZ1_DMS_NOTIF_SUB(orgid='" + orgID + "',mailid='" + emailID + "',doctype='" + docType + "',usertype='" + usertype + "')", null);
                }

                this.oDataModel.attachBatchRequestCompleted(null, this.readSuccessHandler);
                this.oDataModel.attachBatchRequestFailed(null, this.readErrorHandler);
            }
        });
    });
