sap.ui.define([
    "com/mhirj/dms/zmhirjdmscp/controller/BaseController",
    "com/mhirj/dms/zmhirjdmscp/util/Formatter"
],
function(BaseController, formatter) {
    "use strict";

    return BaseController.extend("com.mhirj.dms.zmhirjdmscp.controller.DetailDetail", {
        formatter: formatter,
        onInit: function() {
            var oRouter = this.getRouter();
            if (oRouter) {
                oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
            }
        },

        onRouteMatched: function(oEvent) {
            if (oEvent.getParameter("name") === "RouteDetailDetailScreen") {
                    var oParameters = oEvent.getParameter("arguments");
                    this._DocGroup = oParameters.docGroup;
                    this._DocumentType = oParameters.DocumentType;
                    this._UNID = oParameters.UNID;
                    this._Navigation = oParameters.Navigation;
                    this.dropDownDeferred = $.Deferred();
                    this.userInfoDeferred = $.Deferred();
                    var sdocGroup = this._DocGroup;
                    this.getScreenDataVisibility(sdocGroup);
                    if (this._Navigation == "False"){
                    this.getModel().setProperty("/actionButtonsInfo/endColumn/fullScreen",null);
                    this.getModel().setProperty("/actionButtonsInfo/endColumn/exitFullScreen",null);
                    this.getModel().setProperty("/actionButtonsInfo/endColumn/closeColumn",null);
                    this.getLocalDataModel().setProperty("/DMS_Model/displayScreen",true);
                    this.getDropDownData("DMS_CONFIG_DETAILS");
                    $.when( this.dropDownDeferred ).then(function () {
                    this.getUserDetails();
                    }.bind(this))
                    }else{
                        this.dropDownDeferred.resolve();
                        this.userInfoDeferred.resolve();
                        this.getLocalDataModel().setProperty("/DMS_Model/displayScreen",false);
                    }
                    var userInfo = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo");
                    
                    var selectedDocSearchData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedDocSearchData"),
                        selectedNodeData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel"),
                        selectedData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedData/"),
                        searchData = {
                            "OrgType": userInfo.SAP_Org_Data.OrgType.toUpperCase(),
                            "OrgId": userInfo.CostCenter,
                            "DocTypeCode": selectedNodeData.hasOwnProperty("DocumentType") ? selectedNodeData.DocumentType : "",
                            "AircraftModel": selectedData.hasOwnProperty("DMS_AIRCRAFT_MODEL") ? selectedData.DMS_AIRCRAFT_MODEL : "",
                            "AircraftMSN": selectedData.hasOwnProperty("DMS_MSNEFFECTIVITY") ? selectedData.DMS_MSNEFFECTIVITY : "",
                            "UnId": selectedDocSearchData.UNID
                        };
                    // var   searchData = {
                    //         "OrgType": "ASF/MRO",
                    //         "OrgId": "1017",
                    //         "DocTypeCode": "GREO",
                    //         // "AircraftModel": "'CRJ100, CRJ200, CRJ440'",
                    //         // "AircraftMSN": "",
                    //         "UnId": "ESERVID-1832113782-1067873"
                    //     };

                    this.getDetailedScreenData(searchData);
                }
            
        },
        
        getScreenDataVisibility: function(docGroup){
            var oVisibleDetailFields={
                "RevisionNumber": true, "PartNumber": true,
                "CageCode": true, "MIPChangeRequest": true, "PartTypeLevel1": true, "PartTypeLevel2": true, "PartTypeLevel3": true,
                "InternalComments": true, "DocStatus": true, "PartSerialNumber": true, "Supplier": true, "CAR": true, "MainAta": true,
                "SubAta": true, "AircraftMSN": true, "WorkingGroup": true, "ServiceBulletinNo": true, "VenSerBulletin": true,
                "Consumable": true, "LateReturn": true, "ToolReservation": true, "RentalPeriod": true, "RentalRates": true, "Currency": true,
                "AvailableSale": true, "Publication": true, "ReferenceNumber": true, "TpubsDocStatus": true, "TRevisionNumber": true,
                "RepTRevisionNumber": true, "Criticality": true, "Incorporated": true, "UnitofWork": true, "Pageblock": true,
                "Compliance": true, "TransmittalLetterNo": true, "ImageThumbnail":true
               
              };
              if (docGroup === "01") { //CM9000 Standard Parts Library
                oVisibleDetailFields= {
                    "DocStatus": false, "PartSerialNumber": false, "Supplier": false, "CAR": false, "MainAta": false,
                    "SubAta": false, "AircraftMSN": false, "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "DocStatus": false, "Compliance": false, "TransmittalLetterNo": false
                };
              }else if (docGroup === "02") {     // Engineering Documents Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false,"ImageThumbnail":false,
                    "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false
                };
            } else if (docGroup === "04") {     // Events Documents Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "CAR": false,"ImageThumbnail":false,
                    "AircraftMSN": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "DocStatus": false, "Compliance": false, "TransmittalLetterNo": false
				
                };
            } else if (docGroup === "05") {   //   Manual Status Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3":false,
                    "InternalComments":false, "DocStatus":false, "CAR":false, "WorkingGroup":false, "ServiceBulletinNo":false, 
                    "Consumable":false, "LateReturn":false,"ToolReservation":false,"RentalPeriod":false,"RentalRates":false,"Currency":false,
                    "AvailableSale":false, "Publication":false, "ReferenceNumber":false, "ImageThumbnail":false,
                    "DocStatus":false, "Compliance":false, "TransmittalLetterNo":false
                };
            }else if (docGroup === "06") {    //  Newsletters Library
                oVisibleDetailFields = {
                    "RevisionNumber": false,"ImageThumbnail":false,
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "CAR": false, "AircraftMSN": false, "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false
                };
            }else if (docGroup === "07") {     // Parts Documents Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "CAR": false, "AircraftMSN": false, "WorkingGroup": false,"ImageThumbnail":false,
                    "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false
                };
            }else if (docGroup === "08") {    //  Service Bulletins Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3":false,
                    "InternalComments":false, "CAR":false,  "WorkingGroup":false,"ImageThumbnail":false,
                    "Consumable":false, "LateReturn":false,"ToolReservation":false,"RentalPeriod":false,"RentalRates":false,"Currency":false,
                    "AvailableSale":false, "Publication":false, "ReferenceNumber":false,  "TRevisionNumber":false,
                    "RepTRevisionNumber":false, "Incorporated":false, "UnitofWork":false, "Pageblock":false
                   };
            } else if (docGroup === "09") {    //  Service Documents Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "TpubsDocStatus": false, "TRevisionNumber": false,"ImageThumbnail":false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false
                };
            }else if (docGroup === "10") {   //Suppliers Documents Library
                oVisibleDetailFields = {
                    "PartNumber": false,
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "DocStatus": false, "PartSerialNumber": false, "Supplier": false, "CAR": false, "MainAta": false,
                    "SubAta": false, "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,"ImageThumbnail":false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false
                };
            }else if (docGroup === "11") {      //Training Documents Library
                oVisibleDetailFields = {
                    "CageCode": false, "MIPChangeRequest": false, "PartTypeLevel1": false, "PartTypeLevel2": false, "PartTypeLevel3": false,
                    "InternalComments": false, "CAR": false, "AircraftMSN": false, "WorkingGroup": false, "ServiceBulletinNo": false, "VenSerBulletin": false,
                    "Consumable": false, "LateReturn": false, "ToolReservation": false, "RentalPeriod": false, "RentalRates": false, "Currency": false,
                    "AvailableSale": false, "Publication": false, "ReferenceNumber": false, "TpubsDocStatus": false, "TRevisionNumber": false,
                    "RepTRevisionNumber": false, "Criticality": false, "Incorporated": false, "UnitofWork": false, "Pageblock": false,
                    "Compliance": false, "TransmittalLetterNo": false,"ImageThumbnail":false
                };
            }
            this.getLocalDataModel().setProperty("/DMS_Model/DetailVisibleFields", oVisibleDetailFields);
        },

        getDetailedScreenData: function(searchData) {
            
            this.setBusyOn();
            $.when( this.userInfoDeferred , this.dropDownDeferred).then(function () {
            var configDetails = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_CONFIG_DETAILS/");
            
            $.ajax({
                "url": this.getCompleteURL() + "/DMS_API/DocSetDetails",
              // "url": "/DMS_API/DocSetDetails",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "x-api-key": configDetails.DMS_Key
                },
                "data": JSON.stringify(searchData),
                "success": function(result, xhr, successData) {
                    this.getLocalDataModel().setProperty("/DMS_Model/DocSetDetails/", result.value);
                    this.setBusyOff();
                }.bind(this),
                "error": function(errorData) {
                    debugger
                    this.setBusyOff();
                }.bind(this)
            });
            }.bind(this))
        },

        downloadAttachment: function(oEvent) {
            this.setBusyOn();
            var source = oEvent.getSource(),
                selectedDocSearchData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedDocSearchData"),
                userInfo = this.getLocalDataModel().getProperty("/DMS_Model/UserInfo"),
                selectedNodeData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel"),
                selectedData = this.getLocalDataModel().getProperty("/DMS_Model/SelectedData/"),
                configDetails = this.getLocalDataModel().getProperty("/DMS_Model/DropDownsData/DMS_CONFIG_DETAILS/"),
                searchData = {
                    "OrgType": userInfo.SAP_Org_Data.OrgType.toUpperCase(),
                    "OrgId": userInfo.CostCenter,
                    "DocTypeCode": selectedNodeData.hasOwnProperty("DocumentType") ? selectedNodeData.DocumentType : "",
                    "AircraftModel": selectedData.hasOwnProperty("DMS_AIRCRAFT_MODEL") ? selectedData.DMS_AIRCRAFT_MODEL : "",
                    "AircraftMSN": selectedData.hasOwnProperty("DMS_MSNEFFECTIVITY") ? selectedData.DMS_MSNEFFECTIVITY : "",
                    "FileID": source.getBindingContext("LocalDataModel").getObject().FileID
                };
            
            $.ajax({
              "url": this.getCompleteURL() + "/DMS_API/DocSetFiles",
             // "url": "/DMS_API/DocSetFiles",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "x-api-key": configDetails.DMS_Key
                },
                "data": JSON.stringify(searchData),
                "success": function(result, xhr, successData) {
                    debugger
                    var file = new Blob([result], {
                            type: 'application/pdf'
                        }),
                        fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                    this.setBusyOff();
                }.bind(this),
                "error": function(errorData) {
                    debugger
                    this.setBusyOff();
                }.bind(this)
            });
        },

        handleBackToMainScreen: function(oEvent) {
            this.getRouter().navTo("RouteTreeScreen");
        },
        handleFullScreen: function () {
            this.bFocusFullScreenButton = true;
            // var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
            // var docNumber = this.getLocalDataModel().getProperty("/DMS_Model/SelectedDocSearchData/DocNumber");
            var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/fullScreen");
            this.getRouter().navTo("RouteDetailDetailScreen", { layout: sNextLayout, docGroup: this._DocGroup, DocumentType: this._DocumentType ,UNID: this._UNID,Navigation: "True"});
        },
        handleExitFullScreen: function () {
            this.bFocusFullScreenButton = true;
            var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
            var docNumber = this.getLocalDataModel().getProperty("/DMS_Model/SelectedDocSearchData/DocNumber");
            var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
            this.getRouter().navTo("RouteDetailDetailScreen", { layout: sNextLayout, docGroup: this._DocGroup, DocumentType: this._DocumentType ,UNID: this._UNID,
                Navigation: "True"});
        },
        handleClose: function () {
            var sNextLayout = this.getOwnerComponent().getModel().getProperty("/actionButtonsInfo/endColumn/closeColumn");
            var docGroup = this.getLocalDataModel().getProperty("/DMS_Model/SelectedTreeModel/DocumentGroup");
            var docNumber = this.getLocalDataModel().getProperty("/DMS_Model/SelectedDocSearchData/DocNumber");
            this.getRouter().navTo("RouteDetailDetailScreen", { layout: sNextLayout, docGroup: this._DocGroup, DocumentType: this._DocumentType ,UNID: this._UNID,Navigation: "True"});
        }
    });
});