sap.ui.define([
    "com/mhirj/dms/zmhirjdmscp/controller/BaseController",
    "com/mhirj/dms/zmhirjdmscp/util/Formatter",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/f/library',
    'com/mhirj/dms/zmhirjdmscp/controls/GrowingJSONModel'
],
    function (BaseController, formatter, ODataModel, Filter, FilterOperator, fioriLibrary, GrowingJSONModel) {
        "use strict";

        return BaseController.extend("com.mhirj.dms.zmhirjdmscp.controller.Detail", {
            formatter: formatter,
            _textControl:{},
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
                if (oEvent.getParameter("name") === "RouteDetailScreen") {
                    this.setBusyOff();
                    this._msn ='';
                    this._aircraftModel ='';
                    var oTreeModel = this.getView().getModel("DmsTableModel");
                    var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
                    var docTypeName = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentTypeName");
                    var idBPCombobox = this.getView().byId("idBPCombobox");
                    var roles = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/Groups").find(obj => obj.value === 'Workzone_Supports_Admin');
                    if (oTreeModel) {
                        oTreeModel.setData(null);
                        this.getView().byId("idDMSTableTitle").setText(null);
                    }
                    if ($.isEmptyObject(roles)) {
                        idBPCombobox.setVisible(false);
                    } else {
                        idBPCombobox.setVisible(true);;
                    }
                    this.dynamicControls(docGroup, docTypeName);
                    var sUserType = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/UserType");
                    sUserType = sUserType.toUpperCase();
                    if (sUserType == "EMPLOYEE") {
                        this.getAssignedAircraftModels("");
                    } else {
                        var sBusinessPartner = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo/SAP_Org_Data/BusinessPartner");
                        this.getAssignedAircraftModels(sBusinessPartner);
                    }
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA", []);
                }
            },
            dynamicControls: function (docGroup, docTypeName) {
                var dynamicJson = [];
                var oVisibleColumns = {
                    "tableIssuedDate": false,
                    "tableDocNumber": false,
                    "tableTitle": false,
                    "tableMainAta": false,
                    "tableRev": false,
                    "tableImageThumbnail": false,
                    "tableWorkingGroup": false,
                    "tableTRevisionNo": false
                };

                if (docGroup === "01") {  //CM9000 Standard Parts Library
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO1", []);
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO2", []);
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO3", []);

                    this.preparePartTypeInfo(docTypeName, null, null, null);
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": false,
                        "tableImageThumbnail": true,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/PART_TYPE_INFO1",
                        "source": "PART_TYPE_INFO1",
                        "controlText": this.getResourceBundle().getText("partType")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/PART_TYPE_INFO2",
                        "source": "PART_TYPE_INFO2",
                        "controlText": this.getResourceBundle().getText("partType1")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/PART_TYPE_INFO3",
                        "source": "PART_TYPE_INFO3",
                        "controlText": this.getResourceBundle().getText("partType2")
                    }];
                } else if (docGroup === "02") {     // Engineering Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": true,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson.push({
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_MSNEFFECTIVITY",
                        "controlText": this.getResourceBundle().getText("msne")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SUPPLIERS_LIST",
                        "source": "DMS_SUPPLIERS_LIST",
                        "controlText": this.getResourceBundle().getText("supplier")
                    });
                } else if (docGroup === "03") {     // Engineering Drawings
                    dynamicJson = [];
                } else if (docGroup === "04") {     // Events Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": false,
                        "tableTRevisionNo": false,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": false,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": true,

                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_EVENT_WORKING_GOUP",
                        "source": "DMS_EVENT_WORKING_GOUP",
                        "controlText": this.getResourceBundle().getText("eventWorkingGroup")
                    }];
                } else if (docGroup === "05") {   //   Manual Status Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": true
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_TRA_NUMBER",
                        "controlText": this.getResourceBundle().getText("traNumber")
                    }];
                } else if (docGroup === "06") {    //  Newsletters Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": false,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }];
                } else if (docGroup === "07") {     // Parts Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_PART_NUMBER",
                        "controlText": this.getResourceBundle().getText("partNumber")
                    }];
                } else if (docGroup === "08") {    //  Service Bulletins Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": true,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SUPPLIERS_LIST",
                        "source": "DMS_SUPPLIERS_LIST",
                        "controlText": this.getResourceBundle().getText("supplier")
                    }];
                } else if (docGroup === "09") {    //  Service Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": true,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_MSNEFFECTIVITY",
                        "controlText": this.getResourceBundle().getText("msne")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA",
                        "source": "DMS_SEL_SUB_ATA",
                        "controlText": this.getResourceBundle().getText("sas")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_SUPPLIERS_LIST",
                        "source": "DMS_SUPPLIERS_LIST",
                        "controlText": this.getResourceBundle().getText("supplier")
                    }];
                } else if (docGroup === "10") {   //Suppliers Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": true,
                        "tableTitle": true,
                        "tableMainAta": false,
                        "tableRev": true,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }];

                } else if (docGroup === "11") {      //Training Documents Library
                    oVisibleColumns = {
                        "tableIssuedDate": true,
                        "tableDocNumber": false,
                        "tableTitle": true,
                        "tableMainAta": true,
                        "tableRev": false,
                        "tableImageThumbnail": false,
                        "tableWorkingGroup": false,
                        "tableTRevisionNo": false
                    };
                    dynamicJson = [{
                        "controlName": "DateRange",
                        "source": "DMS_DATE_RANGE",
                        "controlText": this.getResourceBundle().getText("dateRange")
                    }, {
                        "controlName": "TextField",
                        "source": "DMS_SEARCH",
                        "controlText": this.getResourceBundle().getText("search")
                    }, {
                        "controlName": "MultiComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO",
                        "source": "DMS_AIRCRAFT_MODEL",
                        "controlText": this.getResourceBundle().getText("aircraftModel")
                    }, {
                        "controlName": "ComboBox",
                        "entityName": "/DMS_Model/DropDownsData/DMS_MAIN_ATA",
                        "source": "DMS_MAIN_ATA",
                        "controlText": this.getResourceBundle().getText("mmc")
                    }];
                }
                this.getLocalDataModel().setProperty("/DMS_Model/Table_Visible_Columns", oVisibleColumns);
                this.createDynamicControls(dynamicJson);
            },
            createDynamicControls: function (dynamicJson) {
                var idFlexBoxFilters = this.getView().byId("idFlexBoxFilters"),
                    flexBox1 = new sap.m.FlexBox(),
                    flexBox2 = new sap.m.FlexBox(),
                    submitButton = new sap.m.FlexBox({
                        "items": [
                            new sap.m.FlexBox({
                                "direction": "Column",
                                "width": "100%",
                                "items": [
                                    new sap.m.Label({
                                        "text": ""
                                    }),
                                    new sap.m.FlexBox({
                                        "width": "100%",
                                        "items": [
                                            new sap.m.Button({
                                                "text": this.getResourceBundle().getText("btnSubmit"),
                                                "press": this.submitSearchData.bind(this)
                                            }),
                                            new sap.m.Button({
                                                "text": this.getResourceBundle().getText("btnReset"),
                                                "press": this.resetData.bind(this)
                                            }).addStyleClass("sapUiTinyMarginBegin")
                                        ]
                                    })
                                ]
                            })
                        ]
                    });

                idFlexBoxFilters.removeAllItems();
                if (dynamicJson && (dynamicJson.length > 0)) {
                    for (var ctr = 0; ctr < dynamicJson.length; ctr++) {
                        var control = null,
                            controlName = dynamicJson[ctr].controlName,
                            controlText = dynamicJson[ctr].controlText,
                            entityName = dynamicJson[ctr].hasOwnProperty("entityName") ? ("LocalDataModel>" + dynamicJson[ctr].entityName) : null,
                            source = dynamicJson[ctr].hasOwnProperty("source") ? dynamicJson[ctr].source : null;

                        if (controlName === "DateRange") {
                            var currentDate = new Date();
                            var oneYearFromNow = new Date();
                            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1);
                            control = new sap.m.DateRangeSelection({
                                "dateValue": oneYearFromNow,
                                "secondDateValue": currentDate,
                                "change": this.handleDateRangeSelection.bind(this)
                            }).data("source", source, true);
                            var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                                pattern: "dd-MM-yyyy"
                            }),
                                fromDate = oFormat.format(oneYearFromNow),
                                toDate = oFormat.format(currentDate);
                            this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/DMS_DATE_RANGE", {
                                "DATE_FROM": fromDate,
                                "DATE_TO": toDate
                            });
                            this._dateControl = control;
                        } else if (controlName === "TextField") {
                            control = new sap.m.Input({
                                "liveChange": this.handleInputLiveChange.bind(this)
                            }).data("source", source, true);
                            this._textControl[source] = control;
                        } else if (controlName === "MultiComboBox") {
                            control = new sap.m.MultiComboBox({
                                "showSelectAll": true,
                                "selectionFinish": this.handleMultiDropDownSelectionFinish.bind(this)
                            }).data("source", source, true);
                            if (source === "DMS_AIRCRAFT_MODEL") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>BuSort2}",
                                    "text": "{LocalDataModel>BuSort2}"
                                }));
                            }
                            this._multiComboControl = control;
                        }
                        else if (controlName === "ComboBox") {
                            control = new sap.m.ComboBox({
                                "selectionChange": this.handleDropDownSelectionChange.bind(this)
                            }).data("source", source, true);

                            if (source === "PART_TYPE_INFO1") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>PartTypeL0}",
                                    "text": "{LocalDataModel>PartTypeL0}"
                                }));
                                this._comboPartTypeInfo1Control = control;
                            } else if (source === "PART_TYPE_INFO2") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>PartTypeL1}",
                                    "text": "{LocalDataModel>PartTypeL1}"
                                }));
                                this._comboPartTypeInfo2Control = control;
                            } else if (source === "PART_TYPE_INFO3") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>PartTypeL2}",
                                    "text": "{LocalDataModel>PartTypeL2}"
                                }));
                                this._comboPartTypeInfo3Control = control;
                            } else if (source === "DMS_MAIN_ATA") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>MainATA}",
                                    "text": "{LocalDataModel>MainATA}"
                                }));
                                this._comboMainAtaControl = control;
                            } else if (source === "DMS_SEL_SUB_ATA") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>SubATA}",
                                    "text": "{LocalDataModel>SubATA}"
                                }));
                                this._control = control;
                            } else if (source === "DMS_EVENT_WORKING_GOUP") {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>Event}",
                                    "text": "{LocalDataModel>Event}"
                                }));
                                this._comboEventWorkingGroupControl = control;
                               
                            } else {
                                control.bindItems(entityName, new sap.ui.core.ListItem({
                                    "key": "{LocalDataModel>key}",
                                    "text": "{LocalDataModel>value}"
                                }));
                                this._comboControl = control;
                            }
                        }

                        var flexBox = new sap.m.FlexBox({
                            "items": [
                                new sap.m.FlexBox({
                                    "direction": "Column",
                                    "width": "100%",
                                    "items": [
                                        new sap.m.Label({
                                            "text": controlText
                                        }),
                                        control
                                    ]
                                })
                            ]
                        });

                        if (ctr <= 3) {
                            flexBox1.addItem(flexBox);
                        } else {
                            flexBox2.addItem(flexBox)
                        }
                    }

                    if ((flexBox1.getItems().length > 0) && (flexBox2.getItems().length > 0)) {
                        flexBox2.addItem(submitButton);
                        idFlexBoxFilters.addItem(
                            new sap.m.FlexBox({
                                "direction": "Column",
                                "items": [
                                    flexBox1.addStyleClass("dynamicFlexBox"),
                                    flexBox2.addStyleClass("dynamicFlexBox sapUiTinyMarginTop")
                                ]
                            })
                        )
                    } else if (flexBox1.getItems().length > 0) {
                        flexBox1.addItem(submitButton);
                        idFlexBoxFilters.addItem(
                            new sap.m.FlexBox({
                                "direction": "Column",
                                "items": [
                                    flexBox1.addStyleClass("dynamicFlexBox1")
                                ]
                            })
                        )
                    } else if (flexBox2.getItems().length > 0) {
                        flexBox2.addItem(submitButton);
                        idFlexBoxFilters.addItem(
                            new sap.m.FlexBox({
                                "direction": "Column",
                                "items": [
                                    flexBox2.addStyleClass("dynamicFlexBox1")
                                ]
                            })
                        )
                    }
                } else {
                    return;
                }
            },
            preparePartTypeInfo: function (documentTypeName, partType0, partType1, partType2) {
                var showResult = null,
                    uniqueResult = [],
                    finalResult = [],
                    partTypeInfo = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_PART_TYPE_INFO"),
                    result = $.grep(partTypeInfo, function (item) {
                        if (documentTypeName && (partType0 === null) && (partType1 === null) && (partType2 === null)) {
                            showResult = "partType0";
                            return (documentTypeName === item.PartTypeLT);
                        } else if (documentTypeName && partType0 && (partType1 === null) && (partType2 === null)) {
                            showResult = "partType1";
                            return ((documentTypeName === item.PartTypeLT) && (partType0 === item.PartTypeL0));
                        } else if (documentTypeName && partType0 && partType1 && (partType2 === null)) {
                            showResult = "partType2";
                            // return (documentTypeName === item.PartTypeL1)
                            return ((documentTypeName === item.PartTypeLT) && (partType0 === item.PartTypeL0) && (partType1 === item.PartTypeL1));
                        }
                    }.bind(this));

                if ((showResult === "partType0") && result && (result.length > 0)) {
                    $.each(result, function (i, el) {
                        if ($.inArray(el.PartTypeL0, uniqueResult) === -1) {
                            uniqueResult.push(el.PartTypeL0);
                            finalResult.push(el);
                        }
                    }.bind(this));
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO1", finalResult);
                } else if ((showResult === "partType1") && result && (result.length > 0)) {
                    $.each(result, function (i, el) {
                        if ($.inArray(el.PartTypeL1, uniqueResult) === -1) {
                            uniqueResult.push(el.PartTypeL1);
                            finalResult.push(el);
                        }
                    }.bind(this));
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO2", finalResult);
                } else if ((showResult === "partType2") && result && (result.length > 0)) {
                    $.each(result, function (i, el) {
                        if ($.inArray(el.PartTypeL2, uniqueResult) === -1) {
                            uniqueResult.push(el.PartTypeL2);
                            finalResult.push(el);
                        }
                    }.bind(this));
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO3", finalResult);
                }
            },

            handleDateRangeSelection: function (oEvent) {
                $.sap.require("sap.ui.core.format.DateFormat");
                var source = oEvent.getSource(),
                    dataSource = source.data("source"),
                    oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: "dd-MM-yyyy"
                    }),
                    fromDate = oFormat.format(oEvent.getParameter("from")),
                    toDate = oFormat.format(oEvent.getParameter("to"));

                this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/" + dataSource, {
                    "DATE_FROM": fromDate,
                    "DATE_TO": toDate
                });
            },
            handleMultiDropDownSelectionFinish: function (oEvent) {
                var selectedItems = oEvent.getParameter("selectedItems");
                var sAircraftsModels;
                for (var i = 0; i < selectedItems.length; i++) {
                    if (selectedItems[i].getKey() != "") {
                        if (sAircraftsModels) {
                            sAircraftsModels = sAircraftsModels + "," + "'" + selectedItems[i].getKey() + "'";
                        } else {
                            sAircraftsModels = "'" + selectedItems[i].getKey() + "'";
                        }

                    }
                }
                this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/DMS_AIRCRAFT_MODEL", sAircraftsModels);
            },

            handleDropDownSelectionChange: function (oEvent) {
                var key = null,
                    key1 = null,
                    key2 = null,
                    source = oEvent.getSource(),
                    dataSource = source.data("source"),
                    docTypeName = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentTypeName");

                this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/" + dataSource, source.getSelectedItem().getKey());
                if (dataSource === "PART_TYPE_INFO1") {
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO2", []);
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO3", []);

                    key = source.getSelectedItem().getKey();
                    this.preparePartTypeInfo(docTypeName, key, null, null);
                } else if (dataSource === "PART_TYPE_INFO2") {
                    this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/PART_TYPE_INFO3", []);

                    key = this.getLocalDataModel().getProperty("/DMS_Model/SelectedData/PART_TYPE_INFO1"),
                        key1 = source.getSelectedItem().getKey();
                    this.preparePartTypeInfo(docTypeName, key, key1, null);
                } else if (dataSource === "DMS_MAIN_ATA") {
                    this._control.setSelectedKey(null);
                    var aSubAta = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_SUB_ATA");
                    var sSelMainAta = oEvent.getSource().getSelectedKey();
                    if (sSelMainAta && sSelMainAta.length != 0) {
                        var sMainAta = sSelMainAta.slice(0,3);
                        var aSelectedSubAta = aSubAta.filter(o => o["SubATA"].slice(0,3)==sMainAta);
                        this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA", aSelectedSubAta);
                    } else {
                        this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/DMS_SEL_SUB_ATA", []);
                    }
                }
            },

            handleInputLiveChange: function (oEvent) {
                var source = oEvent.getSource(),
                    dataSource = source.data("source");
                this.getLocalDataModel().setProperty("/DMS_Model/SelectedData/" + dataSource, source.getValue());
            },
            submitSearchData: function (oEvent) {
                this._pageload = 1;
                this._oDMSDataModel = new GrowingJSONModel();
                this.getView().setModel(this._oDMSDataModel, 'DmsTableModel');
                var dmsTable = this.getView().byId("idDMSTable"),
                    dmsTemplate = dmsTable.getBindingInfo("items").template,
                    userInfo = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo"),
                    orgType = userInfo.SAP_Org_Data.OrgType.toUpperCase(),
                    selectedNodeData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel"),
                    selectedData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedData/");
                var sOrgType ="";
                   if(orgType =="CUS"){
                    sOrgType ="Customers"
                   }else if(orgType =="SUP"){
                    sOrgType ="Suppliers"
                   }else if(orgType =="ASF"){
                    sOrgType ="ASF/MRO" 
                   }else if (orgType == "OTH"){
                    sOrgType ="Other Support Organization"
                   }
                this._searchData = {
                   // "OrgType": userInfo.SAP_Org_Data.OrgType.toUpperCase(),
                    "OrgType": sOrgType,
                    "OrgId": userInfo.CostCenter,
                    "DocTypeCode": selectedNodeData.hasOwnProperty("DocumentType") ? selectedNodeData.DocumentType : "",
                    "AircraftModel": selectedData.hasOwnProperty("DMS_AIRCRAFT_MODEL") ? selectedData.DMS_AIRCRAFT_MODEL : this._aircraftModel,
                    "AircraftMSN": selectedData.hasOwnProperty("DMS_MSNEFFECTIVITY") ? selectedData.DMS_MSNEFFECTIVITY : this._msn,
                    "MainATA": selectedData.hasOwnProperty("DMS_MAIN_ATA") ? selectedData.DMS_MAIN_ATA : "",
                    "SubATA": selectedData.hasOwnProperty("DMS_SEL_SUB_ATA") ? selectedData.DMS_SEL_SUB_ATA : "",
                    "Supplier": selectedData.hasOwnProperty("DMS_SUPPLIERS_LIST") ? selectedData.DMS_SUPPLIERS_LIST : "",
                    "PartNumber": selectedData.hasOwnProperty("DMS_PART_NUMBER") ? selectedData.DMS_PART_NUMBER : "",
                    "TRevisionNumber": selectedData.hasOwnProperty("DMS_TRA_NUMBER") ? selectedData.DMS_TRA_NUMBER : "",
                    "WorkingGroup": selectedData.hasOwnProperty("DMS_EVENT_WORKING_GOUP") ? selectedData.DMS_EVENT_WORKING_GOUP : "",
                    "PartTypeLevel1": selectedData.hasOwnProperty("PART_TYPE_INFO1") ? selectedData.PART_TYPE_INFO1 : "",
                    "PartTypeLevel2": selectedData.hasOwnProperty("PART_TYPE_INFO2") ? selectedData.PART_TYPE_INFO2 : "",
                    "PartTypeLevel3": selectedData.hasOwnProperty("PART_TYPE_INFO3") ? selectedData.PART_TYPE_INFO3 : "",
                    "DateFrom": selectedData.hasOwnProperty("DMS_DATE_RANGE") ? selectedData.DMS_DATE_RANGE.DATE_FROM : "",
                    "DateTo": selectedData.hasOwnProperty("DMS_DATE_RANGE") ? selectedData.DMS_DATE_RANGE.DATE_TO : "",
                    "FsKeyword": selectedData.hasOwnProperty("DMS_SEARCH") ? selectedData.DMS_SEARCH : "",
                    "PageNo": "1",
                    "PageSize": "25"
                }

                this.getDMSData(this._searchData);

            },
            resetData: function (oEvent) {
                if (this._dateControl) {
                    this._dateControl.setDateValue(null);
                    this._dateControl.setSecondDateValue(null);
                }
                if (this._textControl['DMS_SEARCH']) {
                    this._textControl['DMS_SEARCH'].setValue(null);
                }
                if (this._textControl['DMS_MSNEFFECTIVITY']) {
                    this._textControl['DMS_MSNEFFECTIVITY'].setValue(null);
                }
                if (this._textControl['DMS_TRA_NUMBER']) {
                    this._textControl['DMS_TRA_NUMBER'].setValue(null);
                }
                if (this._textControl['DMS_PART_NUMBER']) {
                    this._textControl['DMS_PART_NUMBER'].setValue(null);
                }
                if (this._multiComboControl) {
                    this._multiComboControl.setSelectedKeys(null);
                }
                if (this._comboMainAtaControl) {
                    this._comboMainAtaControl.setSelectedKey(null);
                }
                if (this._comboPartTypeInfo1Control) {
                    this._comboPartTypeInfo1Control.setSelectedKey(null);
                }
                if (this._comboPartTypeInfo2Control) {
                    this._comboPartTypeInfo2Control.setSelectedKey(null);
                }
                if (this._comboPartTypeInfo3Control) {
                    this._comboPartTypeInfo3Control.setSelectedKey(null);
                }
                if (this._comboEventWorkingGroupControl) {
                    this._comboEventWorkingGroupControl.setSelectedKey(null);
                }
                if (this._control) {
                    this._control.setSelectedKey(null);
                }
                if (this._comboControl) {
                    this._comboControl.setSelectedKey(null);
                }
            },
            getDMSData: function (searchData) {
                var configDetails = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_CONFIG_DETAILS/");
                $.ajax({
                   "url": this.getCompleteURL() + "/DMS_API/DocSearch",
                  //  "url": "/DMS_API/DocSearch",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "x-api-key": configDetails.DMS_Key
                    },
                    "data": JSON.stringify(searchData),
                    "success": function (result, xhr, successData) {
                        this._oDMSDataModel._totalCount = result["@odata.count"];
                        var aTableData = this.getView().getModel("DmsTableModel").getData();
                        if (aTableData.length) {
                            aTableData = aTableData.concat(result.value);
                            var titleText = this.getResourceBundle().getText("tableCountText", [aTableData.length, result["@odata.count"]]);
                            this.getView().getModel("DmsTableModel").setData(aTableData);
                        } else {
                            var titleText = this.getResourceBundle().getText("tableCountText", [result.value.length, result["@odata.count"]]);
                            this.getView().getModel("DmsTableModel").setData(result.value);
                        }
                        this._oDataCount = result["@odata.count"];
                        this._pageload = this._pageload + 1;
                        var idDMSTableTitle = this.getView().byId("idDMSTableTitle");
                        idDMSTableTitle.setText(titleText);

                    }.bind(this),
                    "error": function (errorData) {
                    }.bind(this)
                });
            },
            handleBPComboboxChangeEvent: function (oEvent) {

                var source = oEvent.getSource(),
                    selectedObj = source.getSelectedItem().getBindingContext("LocalDataModel").getObject();
                var sBusinessPartner = selectedObj.BusinessPartner;
                this.getAssignedAircraftModels(sBusinessPartner);
            },
            getAssignedAircraftModels: function (sPartner) {
                if (sPartner == "") {
                    var urlParameters = {}
                } else {
                    while (sPartner.length < 10) sPartner = "0" + sPartner;

                    var urlParameters = {
                        $filter: "Partner1 eq '" + sPartner + "'"
                    };
                }
                var successCallBack = function (successData) {

                    if (successData.results.length > 0) {
                        this.getLocalDataModel().setProperty("/DMS_Model/FLEET_Data", successData.results);
                        var tempArray = [], sortArray = [];
                        var sAircraftMsn, sAircraftModel;
                        $.each(successData.results, function (i, el) {
                            if(sAircraftMsn){
                                sAircraftMsn = sAircraftMsn +"," +"'"+el.Partner+"'";
                            }else{
                                sAircraftMsn = "'" + el.Partner+"'";
                            }
                            if ($.inArray(el.BuSort2, tempArray) === -1) {
                                tempArray.push(el.BuSort2);
                                sortArray.push(el)
                            }
                        });
                        for (var index = 0; index < sortArray.length; index++) {
                            if(sAircraftModel){
                                sAircraftModel = sAircraftModel +"," +"'"+sortArray[index].BuSort2+"'";
                            }else{
                                sAircraftModel = "'" + sortArray[index].BuSort2+"'";
                            }
                            
                        }
                        this._msn = sAircraftMsn;
                        this._aircraftModel = sAircraftModel;

                        this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO", sortArray);
                    } else {
                        this.getLocalDataModel().setProperty("/DMS_Model/FLEET_Data", []);
                        this.getLocalDataModel().setProperty("/DMS_Model/DropDownsData/DMS_AIRCRAFT_INFO", []);
                    }
                }.bind(this),
                    errorCallBack = function (errorData) {
                       }.bind(this)

                this.readDataFromSystemWithUrlParameters("FLEET_SAP_Data_Model", "/FLEET_INFOSet", urlParameters, successCallBack, errorCallBack);

            },
            handleTableItemPress: function (oEvent) {
                var source = oEvent.getSource(),
                    selectedContext = source.getBindingContext("DmsTableModel").getObject();
                var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
                var docType = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentType");
                this.getLocalDataModel().setProperty("/DMS_Model/SelectedDocSearchData", selectedContext);
                this.getRouter().navTo("RouteDetailDetailScreen", { layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded, docGroup: docGroup, DocumentType: docType, UNID: selectedContext.UNID, Navigation: "True" });
            },
            handleFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
                var docType = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentType");
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/fullScreen");
                this.getRouter().navTo("RouteDetailScreen", { layout: sNextLayout, docGroup: docGroup, DocumentType: docType });
            },
            handleExitFullScreen: function () {
                this.bFocusFullScreenButton = true;
                var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
                var docType = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentType");
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
                this.getRouter().navTo("RouteDetailScreen", { layout: sNextLayout, docGroup: docGroup, DocumentType: docType });
            },
            handleClose: function () {
                var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/midColumn/closeColumn");
                var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
                var docType = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentType");
                this.getRouter().navTo("RouteDetailScreen", { layout: sNextLayout, docGroup: docGroup, DocumentType: docType });
            },
            onMoreDataLoad: function (oEvent) {
              if (oEvent.getParameter("reason") == "Growing") {
                    if (this._pageload && this._oDataCount) {
                        // this._pageload = this._pageload ++ ;
                        var iRequestCount = (this._pageload - 1) * 4;
                        if (iRequestCount < this._oDataCount) {                    
                            this._searchData["PageNo"]=this._pageload
                            this.getDMSData(this._searchData);
                        }
                    }
                }
            }

        });
    });
