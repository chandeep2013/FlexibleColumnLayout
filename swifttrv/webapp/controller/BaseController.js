sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {

	"use strict";

	return Controller.extend("bosch.SmartControls.controller.BaseController", {

		/////############## From country change ##################///////////
		onCountryFromChange: function (curEvt) {
			var that = this;
			sap.ui.core.BusyIndicator.show(-1);
			var aData = sap.ui.getCore().getModel("global").getData();
			if (aData.isCopy) {
				var detail = this.getView().getModel("detail").getData();
				var from_cnty = detail.ZZ_FMCNTRY;
				aData.FromCountrySelected = curEvt;
			} else {
				aData.screenData.ZZ_DEP_FRCNTRY_TXT = curEvt.getSource().getSelectedItem().getText();
				from_cnty = curEvt.getSource().getSelectedItem().getKey();
			}
			aData.cityfrom = [];
			var url = "DEP_LOCATIONSSet?$filter=MOLGA eq '" + from_cnty +
				"'&$format=json";
			that.oDataModel.read(url, null, null, true, function (oData, response) {
				var FromLoc = JSON.parse(response.body).d.results;
				if (FromLoc[0] !== undefined && FromLoc[0] !== null) {
					if (aData.isCopy) {
						if (aData.FromCountrySelected !== undefined) {
							that.getView().getModel("detail").getData().ZZ_FMLOC = ""; // FromLoc[0].BLAND;
						}
						that.getView().getModel("detail").getData().cityfrom = [];
						that.getView().getModel("detail").getData().cityfrom = FromLoc;
						that.getView().getModel("detail").refresh();
					} else {
						try {
							sap.ui.getCore().byId("idFromLocationC").setSelectedKey(FromLoc[0].MOLGA);
						} catch (err) {
							that.getView().getModel("detail").getData().ZZ_FMLOC = FromLoc[0].BLAND;
							that.getView().getModel("detail").getData().cityfrom = [];
							that.getView().getModel("detail").getData().cityfrom = FromLoc;
							that.getView().getModel("detail").refresh();
						}
						aData.cityfrom = FromLoc;
					}
					sap.ui.getCore().getModel("global").setData(aData);

				}
				sap.ui.core.BusyIndicator.hide();
			}, function (error) {
				sap.m.MessageToast.show("From Locations Not Found");
			});
		},
		/////############## To country change ##################///////////
		onCountryToChange: function (curEvt) {
			var that = this;
			sap.ui.core.BusyIndicator.show(-1);
			var aData = sap.ui.getCore().getModel("global").getData();
			if (aData.isCopy) {
				var detail = this.getView().getModel("detail").getData();
				var to_cnty = detail.ZZ_LAND1;
				aData.ToCountrySelected = curEvt;
			} else {
				aData.screenData.ZZ_DEP_TOCNTRY_TXT = curEvt.getSource().getSelectedItem().getText();
				to_cnty = curEvt.getSource().getSelectedItem().getKey();
			}

			aData.cityto = [];
			//curEvt.getSource().getSelectedItem().getKey()
			var url = "DEP_LOCATIONSSet?$filter=MOLGA eq '" + to_cnty +
				"'&$format=json";

			this.oDataModel.read(url, null, null, true, function (oData, response) {
				var ToLoc = JSON.parse(response.body).d.results;
				if (ToLoc[0] !== undefined && ToLoc[0] !== null) {
					if (aData.isCopy) {
						if (aData.ToCountrySelected !== undefined) {
							detail.ZZ_LOCATION_END = ""; // ToLoc[0].BLAND;
						}
						detail.cityto = [];
						detail.cityto = ToLoc;

						//added by uml6kor 20/7/2021 copy confirmation dialog
						// international
						var sModid = detail.ZZ_SMODID;
						if (aData.CurrentRequest.ZZ_DEP_FRCNTRY === detail.ZZ_LAND1) {
							detail.view.international = false;
							detail.ZZ_SMODID = "DOME";
							detail.ZZ_ZVISAT = "1";
						} else {
							detail.view.international = true;
							detail.ZZ_SMODID = "INTL";
							detail.ZZ_ZVISAT = "2";
						}
						if(detail.ZZ_SMODID !== sModid){
							for(var i=0;i<detail.TRV_HDRtoTRV_COST_ASGN.results.length;i++){
								if(detail.ZZ_SMODID == "INTL" && detail.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX == "105"){
									detail.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX  = "106" ; 
								}else if(detail.ZZ_SMODID == "DOME" && detail.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX == "106"){
									detail.TRV_HDRtoTRV_COST_ASGN.results[i].ZZ_FIPEX  = "105" ; 
								}
							}
						}
						that.getView().getModel("detail").refresh();
					} else {
						aData.cityto = ToLoc;
						try {
							sap.ui.getCore().byId("idToLocationC").setSelectedKey(ToLoc[0].MOLGA);
						} catch (err) {
							// that.getView().getModel("detail").getData().ZZ_LOCATION_END = ToLoc[0].BLAND;
							that.getView().getModel("detail").getData().cityto = [];
							that.getView().getModel("detail").getData().cityto = ToLoc;
							that.getView().getModel("detail").refresh();
						}
					}
					sap.ui.getCore().getModel("global").setData(aData);
					if (aData.isCopy === false) {
						if (aData.screenData.ZZ_DEP_TOCNTRY !== "NP") {
							if (aData.screenData.ZZ_DEP_FRCNTRY === aData.screenData.ZZ_DEP_TOCNTRY) {
								aData.screenData.ZZ_DEP_TYPE = "DOME";
							} else {
								aData.screenData.ZZ_DEP_TYPE = "INTL";
							}
						} else {
							aData.screenData.ZZ_DEP_TYPE = "DOME";
						}
						sap.ui.getCore().getModel("global").setData(aData);
					}

				}
				sap.ui.core.BusyIndicator.hide();

			}, function (error) {
				sap.m.MessageToast.show("To Locations Not Found");
			});
		},
		//////////////######### to location change #################////////////
		OnChangeLocation: function (curEvt) {
			var aData = sap.ui.getCore().getModel("global").getData();
			if (aData.isCopy) {
				var detailLoc = this.getView().getModel("detail").getData();
				var trvldataLen = detailLoc.TRV_HDRtoTRV_travel_Data.results.length;
				if (trvldataLen !== 0) {
					try {
						if (curEvt.getSource().getTooltip().indexOf("From") !== -1) {
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZSLFDPD = "00";
							detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZFRPLACE = curEvt.getSource().getSelectedItem().getText();
							detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZTOPLACE = detailLoc.ZZ_LOCATION_END;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA = detailLoc.ZZ_DATV1;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA_VALUE = new Date(detailLoc.ZZ_DATV1.substr(0, 4), detailLoc.ZZ_DATV1.substr(4, 2) - 1, detailLoc.ZZ_DATV1.substr(6, 2));
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_TRVCAT = detailLoc.ZZ_TRV_TYP;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ACTIVE = "X";

							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_ZSLFDPD = "00";
							detailLoc.TRV_HDRtoTRV_travel_Data.results[trvldataLen - 1].ZZ_ZTOPLACE = curEvt.getSource().getSelectedItem().getText(); //detailLoc.ZZ_LOCATION_END,
							detailLoc.TRV_HDRtoTRV_travel_Data.results[trvldataLen - 1].ZZ_ZFRPLACE = detailLoc.ZZ_LOCATION_END;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_BEGDA = detailLoc.ZZ_DATB1;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_BEGDA_VALUE = new Date(detailLoc.ZZ_DATB1.substr(0, 4), detailLoc.ZZ_DATB1.substr(4, 2) - 1, detailLoc.ZZ_DATB1.substr(6, 2));
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_TRVCAT = detailLoc.ZZ_TRV_TYP;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_ACTIVE = "X";

						} else if (curEvt.getSource().getTooltip().indexOf("To") !== -1) {
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZSLFDPD = "00";
							detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZFRPLACE = detailLoc.ZZ_FMLOC;
							detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ZTOPLACE = curEvt.getSource().getSelectedItem().getText();
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA = detailLoc.ZZ_DATV1;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_BEGDA_VALUE = new Date(detailLoc.ZZ_DATV1.substr(0, 4), detailLoc.ZZ_DATV1.substr(4, 2) - 1, detailLoc.ZZ_DATV1.substr(6, 2));
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_TRVCAT = detailLoc.ZZ_TRV_TYP;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[0].ZZ_ACTIVE = "X";

							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_ZSLFDPD = "00";
							detailLoc.TRV_HDRtoTRV_travel_Data.results[trvldataLen - 1].ZZ_ZFRPLACE = curEvt.getSource().getSelectedItem().getText(); //detailLoc.ZZ_LOCATION_END,
							detailLoc.TRV_HDRtoTRV_travel_Data.results[trvldataLen - 1].ZZ_ZTOPLACE = detailLoc.ZZ_FMLOC;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_BEGDA = detailLoc.ZZ_DATB1;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_BEGDA_VALUE = new Date(detailLoc.ZZ_DATB1.substr(0, 4), detailLoc.ZZ_DATB1.substr(4, 2) - 1, detailLoc.ZZ_DATB1.substr(6, 2));
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_TRVCAT = detailLoc.ZZ_TRV_TYP;
							// detailLoc.TRV_HDRtoTRV_travel_Data.results[1].ZZ_ACTIVE = "X";
						}
					} catch (err) {

					}
				}
			}

		},
		getRouter: function () {

			// ... instead of
			return UIComponent.getRouterFor(this);

		},

		// just this.getModel() ...
		getModel: function (sName) {

			// ... instead of
			return this.getView().getModel(sName);

		},

		// just this.setModel() ...
		setModel: function (oModel, sName) {

			// ... instead of
			return this.getView().setModel(oModel, sName);

		},

		// just this.getResoureBundle() ... 
		getResourceBundle: function () {

			// ... instead of
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();

		},

		// calculate something
		randomCalculations: function (fValue1, fValue2) {

			// do some calculations

		}

	});

});