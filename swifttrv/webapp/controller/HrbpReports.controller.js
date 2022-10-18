sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/controls/Popover",
	"com/bosch/hr/swift_trv/model/formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/m/MessageBox"
], function (Controller, FeedItem, Popover, formatter, Export, ExportTypeCSV, FlattenedDataset, MessageBox) {
	"use strict";

	return Controller.extend("com.bosch.hr.swift_trv.controller.HrbpReports", {
		formatter: formatter,
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.bosch.hr.swift_trv.view.Reports
		 */
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.getRoute("HrbpReports").attachPatternMatched(this._onvizCharts, this);
		},
		onAfterRendering: function () {
			this.sServiceUrl = "/sap/opu/odata/sap/ZE2E_DEP_NWGS_SRV/";
			this.oDataModel = new sap.ui.model.odata.ODataModel(this.sServiceUrl);
			/*	sap.ui.core.BusyIndicator.show(-1);
				var SelectionModel = new sap.ui.model.json.JSONModel();
				var url = "DepSecBuF4Help?$format=json";
				this.oDataModel.read(url, null, null, true, function (oData, response) {
					var ModelRes = JSON.parse(response.body).d.results;
					if (ModelRes[0] !== undefined && ModelRes[0] !== null) {
						that.Bunit = [];
						that.Dept = [];
						that.Sect = [];
						for (var i = 0; i < ModelRes.length; i++) {
							if (ModelRes[i].Level === "BUNT") {
								that.Bunit.push(ModelRes[i]);
							} else if (ModelRes[i].Level === "SECT") {
								that.Sect.push(ModelRes[i]);
							} else if (ModelRes[i].Level === "DEPT") {
								that.Dept.push(ModelRes[i]);
							}
						}
						SelectionModel.setData(that.Bunit);
						that.getView().setModel(SelectionModel, "ModelSelection");
					}
					sap.ui.core.BusyIndicator.hide();
				}, function (error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show("Locations Not Found for the selected country");
				});*/
		},
		onSelectDeptButton: function () {
			this.getView().getModel("ModelSelection").setData(this.Dept);
		},
		onSelectSectButton: function () {
			this.getView().getModel("ModelSelection").setData(this.Sect);
		},
		onSelectBUButton: function () {
			this.getView().getModel("ModelSelection").setData(this.Bunit);
		},
		_onvizCharts: function () {
			var that = this;
			/// list of Models
			var AsgModelData = [{
				"Type": "LTX",
				"Desc": "LTX"
			}, {
				"Type": "NCX",
				"Desc": "NCX"
			}, {
				"Type": "STA",
				"Desc": "STA"
			}, {
				"Type": "STVA",
				"Desc": "STVA"
			}, {
				"Type": "STAPP",
				"Desc": "STAPP"
			}, {
				"Type": "STX",
				"Desc": "STX"
			}, {
				"Type": "VA",
				"Desc": "VA"
			}, {
				"Type": "VN",
				"Desc": "VN"
			}, {
				"Type": "BDEP",
				"Desc": "BOSCH DEPUTATION"
			}, {
				"Type": "LDEP",
				"Desc": "LOCAL DEPUTATION"
			}, {
				"Type": "IDEP",
				"Desc": "INLAND DEPUTATION"
			},  {
				"Type": "TRFR",
				"Desc": "INLAND TRANSFER"
			}, {
				"Type": "TRNG",
				"Desc": "DEPUTATION TRAINING"
			}];
			var AsgModelDataModel = new sap.ui.model.json.JSONModel();
			AsgModelDataModel.setData(AsgModelData);
			this.getView().setModel(AsgModelDataModel, "AsgModelData");
			sap.ui.getCore().setModel(AsgModelDataModel, "AsgModelData");
			this.UIFilters = [];
			this.handleShowLess();

			var global = sap.ui.getCore().getModel("global").getData();
			var CountryModel = new sap.ui.model.json.JSONModel();
			CountryModel.setData(global.country);
			CountryModel.setSizeLimit(global.country.length);
			that.getView().setModel(CountryModel, "country");
			var oView = this.getView();
			//this.expandmyChart(oView, "idVizFrame1", "Cell1");
			this.popOverChart(oView, "idVizFrame1", "idPopOver1");
			this.popOverChart(oView, "idVizFrame2", "idPopOver2");
			this.popOverChart(oView, "idVizFrame3", "idPopOver3");

			this.twoSeriesChart(oView, "idVizFrame1", "valueAxisFeed1");
			this.twoSeriesChart(oView, "idVizFrame2", "valueAxisFeed2");
			this.twoSeriesChart(oView, "idVizFrame3", "valueAxisFeed3");
			var YearArray = [];
			var YearModel = new sap.ui.model.json.JSONModel();
			var currentYear = new Date().getFullYear();
			for (var i = 2000; i < currentYear + 1; i++) {
				YearArray.push({
					"text": i
				});
			}
			YearModel.setData(YearArray);
			this.getView().setModel(YearModel, "Year");
			this.SelectedPage = "detail";

			var html1 = this.getView().byId("html1");
			var html2 = this.getView().byId("html2");
			var html3 = this.getView().byId("html3");
			html1.setContent("<div><ul><li>Please select only one value in selection Criteria in Country or Year,</li>" +
				"<li> If multiple values selected, 'Year' will be considered in X-Axis by default.</li>" +
				"</ul></div>");
			html2.setContent("<div><ul><li>Please select only one value in selection Criteria in Country or Year,</li>" +
				"<li> If multiple values selected, 'Year' will be considered in X-Axis by default.</li>" +
				"</ul></div>");
			html3.setContent("<div><ul><li>Please select only one value in selection Criteria in Country or Year,</li>" +
				"<li> If multiple values selected, 'Year' will be considered in X-Axis by default.</li>" +
				"</ul></div>");
		},
		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitContObj().toDetail(this.createId(sToPageId));
			this.SelectedPage = sToPageId;
		},
		handleShowMore: function () {

			var array = ["idHrbpAsgType", "idHrbpFamilyAcc", "idHrbpDurationCheck", "idHrbpActiveCases",
				"idHrbpActiveCasesL", "idHrbpDurationCheckL", "idHrbpFamilyAccL", "idHrbpAsgTypeL"
			];
			for (var i = 0; i < array.length; i++) {
				this.getView().byId(array[i]).setVisible(true);
			}
			this.getView().byId("idButtonShowMore").setVisible(false);
			this.getView().byId("idButtonShowLess").setVisible(true);
		},
		handleShowLess: function () {

			var array = ["idHrbpAsgType", "idHrbpFamilyAcc", "idHrbpDurationCheck", "idHrbpActiveCases",
				"idHrbpActiveCasesL", "idHrbpDurationCheckL", "idHrbpFamilyAccL", "idHrbpAsgTypeL"
			];
			for (var i = 0; i < array.length; i++) {
				this.getView().byId(array[i]).setVisible(false);
			}
			this.getView().byId("idButtonShowMore").setVisible(true);
			this.getView().byId("idButtonShowLess").setVisible(false);
		},
		onPressPECountriesYes: function () {
			this.getView().byId("idHrbpCountry").setEnabled(false);
			this.getView().byId("idHrbpCountry").setSelectedKeys([]);
			this.getView().byId("idHrbpAsgType").setEnabled(false);
			this.getView().byId("idHrbpAsgType").setSelectedKeys([]);
			this.getView().byId("idHrbpLoc").setEnabled(false);
			this.getView().byId("idHrbpLoc").setSelectedKeys([]);
			for (var i = 0; i < this.UIFilters.length; i++) {
				if (this.UIFilters[i] === "PELoc") {
					var index = this.UIFilters.indexOf("PELoc");
					if (index > -1) {
						this.UIFilters.splice(index, 1);
					}
				}
			}
			index = this.UIFilters.indexOf("Country");
			if (index > -1) {
				this.UIFilters.splice(index, 1);
			}
			index = this.UIFilters.indexOf("Location");
			if (index > -1) {
				this.UIFilters.splice(index, 1);
			}
			this.UIFilters.push("PELoc");
		},
		onPressPECountriesNo: function () {
			this.getView().byId("idHrbpCountry").setEnabled(true);
			this.getView().byId("idHrbpLoc").setEnabled(true);
			this.getView().byId("idHrbpLoc").setSelectedKeys([]);
			var index = this.UIFilters.indexOf("PELoc");
			if (index > -1) {
				this.UIFilters.splice(index, 1);
			}
		},
		handleClearSearchFilters: function () {
			this.UIFilters = [];
			this.getView().byId("idHerbpYear").setSelectedKeys([]);
			this.getView().byId("idHrbpTravelType").setSelectedKeys([]);
			this.getView().byId("idHrbpCountry").setSelectedKeys([]);
			this.getView().byId("idHrbpCountry").setEnabled(true);
			this.getView().byId("idHrbpLoc").setEnabled(false);
			this.getView().byId("idHrbpLoc").setSelectedKeys([]);
			this.getView().byId("idHrbpAsgType").setSelectedKeys([]);
			this.getView().byId("idHrbpPELoc").setEnabled(true);
			this.getView().byId("idHrbpPELoc").setSelectedKey("No");
			this.getView().byId("idHrbpFamilySP").setSelectedKey("");
			this.getView().byId("idHrbpFamilyAcc").setSelectedKey("");
			this.getView().byId("idHrbpAsgType").setEnabled(false);
			this.getView().byId("idHrbpFamilySP").setEnabled(false);
			this.getView().byId("idHrbpFamilyAcc").setEnabled(false);
		},
		handleClearSearchFiltersTicket: function () {
			this.getView().byId("idHerbpTicketYear").setSelectedKeys([]);
			this.getView().byId("idHerbpTicketType").setSelectedKeys([]);
			this.getView().byId("idHrbpTicketCountry").setSelectedKeys([]);
			this.getView().byId("idHerbpTicketYear").setEnabled(true);
			this.getView().byId("idHerbpTicketType").setEnabled(true);
			this.getView().byId("idHrbpTicketCountry").setEnabled(true);
		},
		handleClearCargoSearchFilters: function () {
			this.getView().byId("idHrbpCargoCountry").setSelectedKeys([]);
			this.getView().byId("idHrbpVendor").setSelectedKeys([]);
			this.getView().byId("idHerbpCargoYear").setSelectedKeys([]);
		},
		onYearChange: function () {
			var year = this.getView().byId("idHerbpYear").getSelectedKeys();
			if (year.length !== 0) {
				// Filters into Single array
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "Year") {
						var index = this.UIFilters.indexOf("Year");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("Year");
				//this.onPressPECountriesYes();
				/*this.getView().byId("idHrbpPELoc").setEnabled(false);
				this.getView().byId("idHrbpPELoc").setSelectedKey("No");
				this.getView().byId("idHrbpAsgType").setEnabled(false);
				this.getView().byId("idHrbpAsgType").setSelectedKeys([]);
				this.getView().byId("idHrbpFamilySP").setEnabled(false);
				this.getView().byId("idHrbpFamilySP").setSelectedKey("");*/
			} else {
				//this.onPressPECountriesNo();
				index = this.UIFilters.indexOf("Year");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
				/*this.getView().byId("idHrbpPELoc").setEnabled(true);
				this.getView().byId("idHrbpAsgType").setEnabled(true);
				this.getView().byId("idHrbpFamilySP").setEnabled(true);*/
			}
		},
		onTrvTypeChange: function () {
			var HrbpTravelType = this.getView().byId("idHrbpTravelType").getSelectedKeys();
			if (HrbpTravelType.length !== 0) {
				for (var k = 0; k < HrbpTravelType.length; k++) {
					if (HrbpTravelType[k] === "DEPU") {
						this.getView().byId("idHrbpAsgType").setEnabled(true);
						this.getView().byId("idHrbpFamilySP").setEnabled(true);
						this.getView().byId("idHrbpFamilyAcc").setEnabled(true);
						return;
					} else {
						this.getView().byId("idHrbpAsgType").setSelectedKeys([]);
						this.getView().byId("idHrbpAsgType").setEnabled(false);
						this.getView().byId("idHrbpFamilySP").setEnabled(false);
						this.getView().byId("idHrbpFamilySP").setSelectedKey("");
						this.getView().byId("idHrbpFamilyAcc").setSelectedKey("");
						this.getView().byId("idHrbpFamilyAcc").setEnabled(false);
					}
				}
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "TrvType") {
						var index = this.UIFilters.indexOf("TrvType");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("TrvType");
			} else {
				index = this.UIFilters.indexOf("TrvType");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
				this.getView().byId("idHrbpAsgType").setSelectedKeys([]);
				this.getView().byId("idHrbpAsgType").setEnabled(false);
				this.getView().byId("idHrbpFamilySP").setEnabled(false);
				this.getView().byId("idHrbpFamilySP").setSelectedKey("");
				this.getView().byId("idHrbpFamilyAcc").setEnabled(false);
				this.getView().byId("idHrbpFamilyAcc").setSelectedKey("");
			}
		},
		onAssignMentChange: function () {
			var AssignMent = this.getView().byId("idHrbpAsgType").getSelectedKeys();
			if (AssignMent.length !== 0) {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "AssignMentModel") {
						var index = this.UIFilters.indexOf("AssignMentModel");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("AssignMentModel");
			} else {
				var index = this.UIFilters.indexOf("AssignMentModel");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}
		},
		onDurationCheck: function () {
			var HrbpDuration = this.getView().byId("idHrbpDurationCheck").getSelectedKey();
			if (HrbpDuration !== "0") {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] == "DurationCheck") {
						var index = this.UIFilters.indexOf("DurationCheck");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("DurationCheck");
			} else {
				index = this.UIFilters.indexOf("DurationCheck");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}
		},
		onFamilyChange: function () {
			var Family = this.getView().byId("idHrbpFamilySP").getSelectedKey();
			if (Family !== "0") {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "FamilyTravels") {
						var index = this.UIFilters.indexOf("FamilyTravels");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("FamilyTravels");
			} else {
				index = this.UIFilters.indexOf("FamilyTravels");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}
		},
		onSelectActiveCases: function () {

			var ActiveCases = this.getView().byId("idHrbpActiveCases").getSelected();
			if (ActiveCases === true) {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "Active") {
						var index = this.UIFilters.indexOf("Active");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("Active");
			} else {
				index = this.UIFilters.indexOf("Active");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}

		},
		onFamilyAccChange: function () {
			var FamilyAcc = this.getView().byId("idHrbpFamilyAcc").getSelectedKey();
			if (FamilyAcc !== "0") {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "FamilyAcc") {
						var index = this.UIFilters.indexOf("FamilyAcc");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("FamilyAcc");
			} else {
				index = this.UIFilters.indexOf("FamilyAcc");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}
		},
		HrbpSecBUDeptValSelection: function () {
			var loc = this.getView().byId("idHrbpSecBUDeptValSelection").getSelectedKeys();
			if (loc.length !== 0) {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "DeptSecBU") {
						var index = this.UIFilters.indexOf("DeptSecBU");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("DeptSecBU");
			} else {
				index = this.UIFilters.indexOf("DeptSecBU");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}

		},
		onLocationChange: function () {
			var loc = this.getView().byId("idHrbpLoc").getSelectedKeys();
			if (loc.length !== 0) {
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "Location") {
						var index = this.UIFilters.indexOf("Location");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("Location");
			} else {
				index = this.UIFilters.indexOf("Location");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
			}
		},
		/////############## country change ##################///////////
		onCountryChange: function (curEvt) {
			var that = this;
			var country = this.getView().byId("idHrbpCountry").getSelectedKeys();
			if (country.length !== 0) {
				// Filters into Single array
				for (var i = 0; i < this.UIFilters.length; i++) {
					if (this.UIFilters[i] === "Country") {
						var index = this.UIFilters.indexOf("Country");
						if (index > -1) {
							this.UIFilters.splice(index, 1);
						}
					}
				}
				this.UIFilters.push("Country");
				this.getView().byId("idHrbpLoc").setEnabled(true);
			} else {
				index = this.UIFilters.indexOf("Country");
				if (index > -1) {
					this.UIFilters.splice(index, 1);
				}
				try {
					that.getView().byId("idHrbpLoc").setEnabled(false);
					that.getView().getModel("location").setData([]);
					that.getView().getModel("Assignment").setData([]);
					that.getView().getModel("location").refresh(true);
					that.getView().getModel("Assignment").refresh(true);
				} catch (err) {}
			}
			if (curEvt.getSource().getSelectedKeys().length === 0 || curEvt.getSource().getSelectedKeys().length > 1) {
				this.getView().byId("idHrbpLoc").setEnabled(false);
				this.getView().byId("idHrbpLoc").setSelectedKeys([]);
			} else {
				sap.ui.core.BusyIndicator.show(-1);
				this.getView().byId("idHrbpLoc").setEnabled(true);
				var locationModel = new sap.ui.model.json.JSONModel();
				var url = "DEP_LOCATIONSSet?$filter=MOLGA eq '" + curEvt.getSource().getSelectedKeys() +
					"'&$format=json";
				this.oDataModel.read(url, null, null, true, function (oData, response) {
					var FromLoc = JSON.parse(response.body).d.results;
					if (FromLoc[0] !== undefined && FromLoc[0] !== null) {
						locationModel.setData(FromLoc);
						//that.getView().byId("idLocationR").setSelectedKey(FromLoc[0].MOLGA);
						that.getView().setModel(locationModel, "location");
					}
					sap.ui.core.BusyIndicator.hide();
				}, function (error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show("Locations Not Found for the selected country");
				});
			}
			var AssignmentModel = new sap.ui.model.json.JSONModel();
			this.oDataModel.read("/AsgModelsF4Set?$filter=ToCountry eq '" + curEvt.getSource().getSelectedKeys() +
				"'&$format=json", null, null, true,
				function (oData, response) {
					var Assignment = JSON.parse(response.body).d.results;
					if (Assignment[0] !== undefined && Assignment[0] !== null) {
						AssignmentModel.setData(Assignment);
						that.getView().setModel(AssignmentModel, "Assignment");
					}
					sap.ui.core.BusyIndicator.hide();
				},
				function (error) {
					sap.ui.core.BusyIndicator.hide();
					sap.m.MessageToast.show("Assignment Model Not Found for the selected country");
				});

		},
		getSplitContObj: function () {
			var result = this.byId("SplitContDemo");
			if (!result) {
				sap.m.MessageToast.error("SplitApp object can't be found");
			}
			return result;
		},
		twoSeriesChart: function (oView, sChart, seriesId) {
			if (sChart === "idVizFrame1") {
				var value = ["DEPU", "BUSR", "INFO", "SECO"];
			} else if (sChart === "idVizFrame2") {
				value = ["DEPUTicketCost", "INFOTicketCost", "BUSRTicketCost", "SECOTicketCost"];
			} else if (sChart === "idVizFrame3") {
				value = ["AAL", "DHL"];
			}

			var oVizFrame = oView.byId(sChart);
			var feedValueAxis1 = this.getView().byId(seriesId);
			oVizFrame.removeFeed(feedValueAxis1);
			feedValueAxis1.setValues(value);
			oVizFrame.addFeed(feedValueAxis1);
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true,
						type: "value"
					},
					drawingEffect: "glossy"
				},
				title: {
					text: "Column Chart"
				},
				legendGroup: {
					layout: {
						position: "right"
					}
				}
			});

		},
		popOverChart: function (oView, sChart, sPopOverId) {
			var oVizFrame = oView.byId(sChart);
			var oPopOver = this.getView().byId(sPopOverId);
			oPopOver.connect(oVizFrame.getVizUid());
		},
		navButtonPress: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Dashboard", {
				layout: "OneColumn"
			});
		},
		handleSearchButtonPress: function () {
			var that = this;
			var year = this.getView().byId("idHerbpYear").getSelectedKeys().toString();
			var country = this.getView().byId("idHrbpCountry").getSelectedKeys().toString();
			var asgType = this.getView().byId("idHrbpAsgType").getSelectedKeys().toString();
			var toLoc = this.getView().byId("idHrbpLoc").getSelectedKeys().toString();
			var peLoc = this.getView().byId("idHrbpPELoc").getSelectedKey();
			var sponsor = this.getView().byId("idHrbpFamilySP").getSelectedKey();
			if (peLoc === "Yes") {
				var PECountries = "X";
			} else {
				PECountries = "";
			}
			if (sponsor === "1" || sponsor === 1) {
				var family = "X";
			} else if (sponsor === "2" || sponsor === 2) {
				family = "Y";
			} else {
				family = "";
			}
			var Accom = this.getView().byId("idHrbpFamilyAcc").getSelectedKey();
			if (Accom === "1" || Accom === 1) {
				var Accompined = "X";
			} else if (Accom === "2" || Accom === 2) {
				Accompined = "Y";
			} else {
				Accompined = "";
			}
			var Duration = this.getView().byId("idHrbpDurationCheck").getSelectedKey();
			if (Duration === "1" || Duration === 1) {
				var ndays = "UP6";
			} else if (Duration === "2" || Duration === 2) {
				ndays = "MR6";
			} else {
				ndays = "";
			}
			var checkbox = this.getView().byId("idHrbpActiveCases").getSelected();
			if (checkbox === true) {
				var Active = "X";
			} else {
				Active = "";
			}
			if (this.SelectedPage === "detail") {
				if (this.UIFilters.length === 0) {
					MessageBox.error("Select atleast one filter");
					return;
				}
				var Report = "Travel";
				var HerbpTicketType = "";
				var vendor = "";
				var trvType = this.getView().byId("idHrbpTravelType").getSelectedKeys().toString();
			} else if (this.SelectedPage === "detailTicketing") {
				Report = "Ticket";
				year = this.getView().byId("idHerbpTicketYear").getSelectedKeys().toString();
				country = this.getView().byId("idHrbpTicketCountry").getSelectedKeys().toString();
				asgType = "";
				toLoc = "";
				PECountries = "";
				HerbpTicketType = this.getView().byId("idHerbpTicketType").getSelectedKeys().toString();
				vendor = "";
				trvType = "";
				Active = "";
				ndays = "";
				Accompined = "";
				family = "";
				if (year === "" && country === "" && HerbpTicketType === "") {
					MessageBox.error("Select atleast one filter");
					return;
				}
			} else if (this.SelectedPage === "detailCargo") {
				Report = "Cargo";
				year = this.getView().byId("idHerbpCargoYear").getSelectedKeys().toString();
				country = this.getView().byId("idHrbpCargoCountry").getSelectedKeys().toString();
				vendor = this.getView().byId("idHrbpVendor").getSelectedKeys().toString();
				asgType = "";
				toLoc = "";
				PECountries = "";
				HerbpTicketType = "";
				trvType = "";
				Active = "";
				ndays = "";
				Accompined = "";
				family = "";
				if (year === "" && country === "" && vendor === "") {
					MessageBox.error("Select atleast one filter");
					return;
				}
			}
			sap.ui.core.BusyIndicator.show(-1);
			var url = "AnalyticRepSet?$filter=PeLoc eq '" + PECountries + "' and Year eq '" + year + "' and Country eq '" + country +
				"' and ToLoc eq '" + toLoc + "' and AsgType eq '" + asgType + "' and Family eq '" + family + "'and ReportName eq '" + Report +
				"' and Trvcat eq'" + HerbpTicketType + "' and TrvKey eq '" + trvType + "' and FamilyAccomp eq '" + Accompined +
				"' and Ndays eq '" + ndays + "' and Active eq '" + Active + "' and Vendor eq '" + vendor + "'&$format=json";
			var vizModel = new sap.ui.model.json.JSONModel();
			var vizModelTicket = new sap.ui.model.json.JSONModel();
			var vizModelCargo = new sap.ui.model.json.JSONModel();
			//vizModel.setSizeLimit(200);
			//vizModelTicket.setSizeLimit(200);
			//vizModelCargo.setSizeLimit(200);
			this.oDataModel.read(url, null, null, true,
				function (oData, response) {
					var vizData = JSON.parse(response.body).d;
					//vizData.results[0] !== undefined && 
					if (vizData.results[0] !== null) {
						if (that.SelectedPage === "detail") {
							vizModel.setData(vizData);
							that.getView().setModel(vizModel, "vizData");
							that._ArrangeDataForVizTravel(vizData);
							that.getView().byId("idDownloadVizFrame1").setVisible(true);
							that.HRBPTravelTrendsTableLength = vizData.results.length;
							that.getView().byId("idHRBPTravelTrendsTable").setText("Records (" + vizData.results.length + ")");
						} else if (that.SelectedPage === "detailTicketing") {
							vizModelTicket.setData(vizData);
							that.getView().setModel(vizModelTicket, "vizDataT");
							that._ArrangeDataForVizTicket(vizData);
							that.getView().byId("idDownloadVizFrame2").setVisible(true);
							that.HRBPTicketingTableLength = vizData.results.length;
							that.getView().byId("idHRBPTicketingTable").setText("Records (" + vizData.results.length + ")");
						} else if (that.SelectedPage === "detailCargo") {
							vizModelCargo.setData(vizData);
							that.getView().setModel(vizModelCargo, "vizDataC");
							that._ArrangeDataForVizCargo(vizData);
							that.getView().byId("idDownloadVizFrame3").setVisible(true);
							that.HRBPCargoTableLength = vizData.results.length;
							that.getView().byId("idHRBPCargoTable").setText("Records (" + vizData.results.length + ")");
						}
						if (vizData.results.length === 0) {
							sap.m.MessageToast.show("No Data Found for selected Filters..!");
						}
					}
					sap.ui.core.BusyIndicator.hide();
				},
				function (error) {
					sap.m.MessageToast.show("No Data Found for selected Filters..!");
					sap.ui.core.BusyIndicator.hide();
				});
		},
		TravelVIZChart: function (index, ResponseData, i, ViZData) {
			if (index > -1) {
				if (ResponseData[i].TrvKey === "DEPU") {
					ViZData[index].DEPU = ViZData[index].DEPU + 1;
					ViZData[index].DEPUAvgDuration = ViZData[index].DEPUAvgDuration + parseInt(ResponseData[i].Ndays, 0);
				} else if (ResponseData[i].TrvKey === "BUSR") {
					ViZData[index].BUSR = ViZData[index].BUSR + 1;
					ViZData[index].BUSRAvgDuration = ViZData[index].BUSRAvgDuration + parseInt(ResponseData[i].Ndays, 0);
				} else if (ResponseData[i].TrvKey === "INFO") {
					ViZData[index].INFO = ViZData[index].INFO + 1;
					ViZData[index].INFOAvgDuration = ViZData[index].INFOAvgDuration + parseInt(ResponseData[i].Ndays, 0);
				} else if (ResponseData[i].TrvKey === "SECO") {
					ViZData[index].SECO = ViZData[index].SECO + 1;
					ViZData[index].SECOAvgDuration = ViZData[index].SECOAvgDuration + parseInt(ResponseData[i].Ndays, 0);
				}
			} else {
				ViZData.push({
					"Year": ResponseData[i].Year,
					"Country": ResponseData[i].Country,
					"DEPU": ResponseData[i].TrvKey === "DEPU" ? 1 : 0,
					"BUSR": ResponseData[i].TrvKey === "BUSR" ? 1 : 0,
					"INFO": ResponseData[i].TrvKey === "INFO" ? 1 : 0,
					"SECO": ResponseData[i].TrvKey === "SECO" ? 1 : 0,
					"DEPUAvgDuration": ResponseData[i].TrvKey === "DEPU" ? parseInt(ResponseData[i].Ndays, 0) : 0,
					"BUSRAvgDuration": ResponseData[i].TrvKey === "BUSR" ? parseInt(ResponseData[i].Ndays, 0) : 0,
					"INFOAvgDuration": ResponseData[i].TrvKey === "INFO" ? parseInt(ResponseData[i].Ndays, 0) : 0,
					"SECOAvgDuration": ResponseData[i].TrvKey === "SECO" ? parseInt(ResponseData[i].Ndays, 0) : 0
				});
			}
		},
		_ArrangeDataForVizTravel: function (Data) {
			var ViZData = [];
			var ResponseData = Data.results;
			var SelectedYears = this.getView().byId("idHerbpYear").getSelectedKeys();
			var SelectedCountries = this.getView().byId("idHrbpCountry").getSelectedKeys();
			var peLoc = this.getView().byId("idHrbpPELoc").getSelectedKey();
			if (SelectedYears.length >= SelectedCountries.length) {
				var xaxis = "Year";
			}
			if (xaxis !== "Year") { //&& SelectedCountries.length >= 2
				xaxis = "Country";
			}
			if (peLoc === "Yes") {
				xaxis = "Country";
				SelectedCountries = ["JP", "US", "GB", "FR", "DE"];
			}
			for (var i = 0; i < ResponseData.length; i++) {

				//////################ x-axis Year ##################//////
				//####################################################////
				if (xaxis === "Year") {
					if (SelectedYears.length === 0) {
						var arrangeYear = this.getView().getModel("Year").getData();
						for (var a = 0; a < arrangeYear.length; a++) {
							SelectedYears.push(arrangeYear[a].text.toString());
						}
					}
					for (var j = 0; j < SelectedYears.length; j++) {
						if (ResponseData[i].Year === SelectedYears[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (var k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Year === SelectedYears[j]) {
									var index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.TravelVIZChart(index, ResponseData, i, ViZData);
						}
					}
				} else if (xaxis === "Country") {
					for (j = 0; j < SelectedCountries.length; j++) {
						//////################ x-axis Country ##################//////
						//####################################################///////
						if (ResponseData[i].Country === SelectedCountries[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Country === SelectedCountries[j]) {
									index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.TravelVIZChart(index, ResponseData, i, ViZData);
						}
					}
				}
			}
			////Calculate average travel duration depu,busr,info,seco
			for (i = 0; i < ViZData.length; i++) {
				try {
					ViZData[i].DEPUAvgDuration = Math.floor(ViZData[i].DEPUAvgDuration / ViZData[i].DEPU);
				} catch (err) {
					ViZData[i].DEPUAvgDuration = 0;
				}
				try {
					ViZData[i].BUSRAvgDuration = Math.floor(ViZData[i].BUSRAvgDuration / ViZData[i].BUSR);
				} catch (err) {
					ViZData[i].BUSRAvgDuration = 0;
				}
				try {
					ViZData[i].INFOAvgDuration = Math.floor(ViZData[i].INFOAvgDuration / ViZData[i].INFO);
				} catch (err) {
					ViZData[i].INFOAvgDuration = 0;
				}
				try {
					ViZData[i].SECOAvgDuration = Math.floor(ViZData[i].SECOAvgDuration / ViZData[i].SECO);
				} catch (err) {
					ViZData[i].SECOAvgDuration = 0;
				}
			}
			Data.chart = ViZData;
			this.getView().getModel("vizData").setData(Data);
			this.getView().getModel("vizData").refresh();
			//var Country = ["Year"];
			var oVizFrame = this.getView().byId("idVizFrame1");
			var feeds = oVizFrame.getFeeds();
			try {

				//	oVizFrame.getDataset().getDimensions()[0].mBindingInfos.value.parts[0].path = "Year";
				var dataset = {
					data: {
						path: "vizData>/chart"
					}
				};
				if (xaxis === "Year") {
					var dim = [{
						"name": "Year",
						"value": "{vizData>Year}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Year");
				} else if (xaxis === "Country") {
					dim = [{
						"name": "Country",
						"value": "{vizData>Country}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Country");
				}

				dataset.dimensions = dim;
				dataset.measures = [{
					"name": "DEPU",
					"value": "{vizData>DEPU}"
				}, {
					"name": "BUSR",
					"value": "{vizData>BUSR}"
				}, {
					"name": "INFO",
					"value": "{vizData>INFO}"
				}, {
					"name": "SECO",
					"value": "{vizData>SECO}"
				}, {
					"name": "DEPUAvgDuration",
					"value": "{vizData>DEPUAvgDuration}"
				}, {
					"name": "BUSRAvgDuration",
					"value": "{vizData>BUSRAvgDuration}"
				}, {
					"name": "INFOAvgDuration",
					"value": "{vizData>INFOAvgDuration}"
				}, {
					"name": "HOMEAvgDuration",
					"value": "{vizData>HOMEAvgDuration}"
				}];
				var oDataset = new FlattenedDataset(dataset);
				oVizFrame.setDataset(oDataset);
				//	oVizFrame.getDataset().getDimensions()[0].mBindingInfos.value.parts[0].path = "Country";

			} catch (err) {}

			for (i = 0; i < feeds.length; i++) {
				if (feeds[i].getUid() === "categoryAxis") {
					var categoryAxisFeed = feeds[i];
					oVizFrame.removeFeed(categoryAxisFeed);
					if (xaxis === "Year") {
						var feed = ["Year"];
					} else if (xaxis === "Country") {
						feed = ["Country"];

					}
					categoryAxisFeed.setValues(feed);
					oVizFrame.addFeed(categoryAxisFeed);
					break;
				}
			}
			var value = ["DEPU", "BUSR", "INFO", "SECO", "DEPUAvgDuration", "BUSRAvgDuration", "INFOAvgDuration", "HOMEAvgDuration"];
			oVizFrame = this.getView().byId("idVizFrame1");
			oVizFrame.setVizType("combination");
			var feedValueAxis1 = this.getView().byId("valueAxisFeed1");
			oVizFrame.removeFeed(feedValueAxis1);
			feedValueAxis1.setValues(value);
			oVizFrame.addFeed(feedValueAxis1);
			oVizFrame.setVizProperties({
				title: {
					text: 'Combination Chart'
				},
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar', 'bar', 'bar', 'line', 'line', 'line'],
						secondaryAxis: ['line', 'line', 'line']
					},
					colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
				}
			});
		},
		TicketVIZChart: function (index, ResponseData, i, ViZData) {
			if (index > -1) {
				if (ResponseData[i].TrvKey === "DEPU") {
					ViZData[index].DEPU = ViZData[index].DEPU + 1;
					ViZData[index].DEPUTicketCost = ViZData[index].DEPUTicketCost + parseInt(ResponseData[i].TicketAmount, 0);
				} else if (ResponseData[i].TrvKey === "BUSR") {
					ViZData[index].BUSR = ViZData[index].BUSR + 1;
					ViZData[index].BUSRTicketCost = ViZData[index].BUSRTicketCost + parseInt(ResponseData[i].TicketAmount, 0);
				} else if (ResponseData[i].TrvKey === "INFO") {
					ViZData[index].INFO = ViZData[index].INFO + 1;
					ViZData[index].INFOTicketCost = ViZData[index].INFOTicketCost + parseInt(ResponseData[i].TicketAmount, 0);
				} else if (ResponseData[i].TrvKey === "SECO") {
					ViZData[index].SECO = ViZData[index].SECO + 1;
					ViZData[index].SECOTicketCost = ViZData[index].SECOTicketCost + parseInt(ResponseData[i].TicketAmount, 0);
				}
			} else {
				ViZData.push({
					"Year": ResponseData[i].Year,
					"Country": ResponseData[i].Country,
					"DEPU": ResponseData[i].TrvKey === "DEPU" ? 1 : 0,
					"BUSR": ResponseData[i].TrvKey === "BUSR" ? 1 : 0,
					"INFO": ResponseData[i].TrvKey === "INFO" ? 1 : 0,
					"SECO": ResponseData[i].TrvKey === "SECO" ? 1 : 0,
					"DEPUTicketCost": ResponseData[i].TrvKey === "DEPU" ? parseInt(ResponseData[i].TicketAmount, 0) : 0,
					"BUSRTicketCost": ResponseData[i].TrvKey === "BUSR" ? parseInt(ResponseData[i].TicketAmount, 0) : 0,
					"INFOTicketCost": ResponseData[i].TrvKey === "INFO" ? parseInt(ResponseData[i].TicketAmount, 0) : 0,
					"SECOTicketCost": ResponseData[i].TrvKey === "SECO" ? parseInt(ResponseData[i].TicketAmount, 0) : 0,
					"DEPUAvgTicketCost": 0,
					"BUSRAvgTicketCost": 0,
					"INFOAvgTicketCost": 0,
					"SECOAvgTicketCost": 0
				});
			}
		},
		_ArrangeDataForVizTicket: function (Data) {
			var ViZData = [];
			var ResponseData = Data.results;
			var SelectedYears = this.getView().byId("idHerbpTicketYear").getSelectedKeys();
			var SelectedCountries = this.getView().byId("idHrbpTicketCountry").getSelectedKeys();
			if (SelectedYears.length >= SelectedCountries.length) {
				var xaxis = "Year";
			}
			if (xaxis !== "Year") { //&& SelectedCountries.length >= 2
				xaxis = "Country";
			}
			for (var i = 0; i < ResponseData.length; i++) {
				//////################ x-axis Year ##################//////
				//####################################################////
				if (xaxis === "Year") {
					if (SelectedYears.length === 0) {
						var arrangeYear = this.getView().getModel("Year").getData();
						for (var a = 0; a < arrangeYear.length; a++) {
							SelectedYears.push(arrangeYear[a].text.toString());
						}
					}
					for (var j = 0; j < SelectedYears.length; j++) {
						if (ResponseData[i].Year === SelectedYears[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (var k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Year === SelectedYears[j]) {
									var index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.TicketVIZChart(index, ResponseData, i, ViZData);
						}
					}
				} else if (xaxis === "Country") {
					for (j = 0; j < SelectedCountries.length; j++) {
						//////################ x-axis Country ##################//////
						//####################################################///////
						if (ResponseData[i].Country === SelectedCountries[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Country === SelectedCountries[j]) {
									index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.TicketVIZChart(index, ResponseData, i, ViZData);
						}
					}
				}
			}
			////Calculate average ticket cost depu,busr,info,seco
			for (i = 0; i < ViZData.length; i++) {
				try {
					ViZData[i].DEPUAvgTicketCost = Math.floor(ViZData[i].DEPUTicketCost / ViZData[i].DEPU);
				} catch (err) {
					ViZData[i].DEPUAvgTicketCost = 0;
				}
				try {
					ViZData[i].BUSRAvgTicketCost = Math.floor(ViZData[i].BUSRTicketCost / ViZData[i].BUSR);
				} catch (err) {
					ViZData[i].BUSRAvgTicketCost = 0;
				}
				try {
					ViZData[i].INFOAvgTicketCost = Math.floor(ViZData[i].INFOTicketCost / ViZData[i].INFO);
				} catch (err) {
					ViZData[i].INFOAvgTicketCost = 0;
				}
				try {
					ViZData[i].SECOAvgTicketCost = Math.floor(ViZData[i].SECOTicketCost / ViZData[i].SECO);
				} catch (err) {
					ViZData[i].SECOAvgTicketCost = 0;
				}
			}
			Data.chart = ViZData;
			this.getView().getModel("vizDataT").setData(Data);
			this.getView().getModel("vizDataT").refresh();
			var oVizFrame = this.getView().byId("idVizFrame2");
			var feeds = oVizFrame.getFeeds();
			try {

				var dataset = {
					data: {
						path: "vizDataT>/chart"
					}
				};
				if (xaxis === "Year") {
					var dim = [{
						"name": "Year",
						"value": "{vizDataT>Year}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Year");
				} else if (xaxis === "Country") {
					dim = [{
						"name": "Country",
						"value": "{vizDataT>Country}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Country");
				}

				dataset.dimensions = dim;
				dataset.measures = [{
					"name": "DEPUTicketCost",
					"value": "{vizDataT>DEPUTicketCost}"
				}, {
					"name": "BUSRTicketCost",
					"value": "{vizDataT>BUSRTicketCost}"
				}, {
					"name": "INFOTicketCost",
					"value": "{vizDataT>INFOTicketCost}"
				}, {
					"name": "SECOTicketCost",
					"value": "{vizDataT>SECOTicketCost}"
				}, {
					"name": "DEPUAvgTicketCost",
					"value": "{vizDataT>DEPUAvgTicketCost}"
				}, {
					"name": "BUSRAvgTicketCost",
					"value": "{vizDataT>BUSRAvgTicketCost}"
				}, {
					"name": "INFOAvgTicketCost",
					"value": "{vizDataT>INFOAvgTicketCost}"
				}, {
					"name": "SECOAvgTicketCost",
					"value": "{vizDataT>SECOAvgTicketCost}"
				}];
				var oDataset = new FlattenedDataset(dataset);
				oVizFrame.setDataset(oDataset);
			} catch (err) {}

			for (i = 0; i < feeds.length; i++) {
				if (feeds[i].getUid() === "categoryAxis") {
					var categoryAxisFeed = feeds[i];
					oVizFrame.removeFeed(categoryAxisFeed);
					if (xaxis === "Year") {
						var feed = ["Year"];
					} else if (xaxis === "Country") {
						feed = ["Country"];
					}
					categoryAxisFeed.setValues(feed);
					oVizFrame.addFeed(categoryAxisFeed);
					break;
				}
			}

			var value = ["DEPUTicketCost", "BUSRTicketCost", "INFOTicketCost", "SECOTicketCost", "DEPUAvgTicketCost", "BUSRAvgTicketCost",
				"INFOAvgTicketCost", "SECOAvgTicketCost"
			];
			oVizFrame.setVizType("stacked_combination");
			var feedValueAxis1 = this.getView().byId("valueAxisFeed2");
			oVizFrame.removeFeed(feedValueAxis1);
			feedValueAxis1.setValues(value);
			oVizFrame.addFeed(feedValueAxis1);
			oVizFrame.setVizProperties({
				title: {
					text: 'Combination Chart'
				},
				plotArea: {
					dataShape: {
						primaryAxis: ['bar', 'bar', 'bar', 'bar', 'line', 'line', 'line'],
						secondaryAxis: ['line', 'line', 'line']
					},
					colorPalette: ["#8189F7", "#E8743B", "#19A979", "#ED4A7B", "#8189F7", "#E8743B", "#19A979", "#ED4A7B"]
				}
			});
		},
		CargoVIZChart: function (index, ResponseData, i, ViZData) {
			if (index > -1) {
				if (ResponseData[i].CargoType === "AAL") {
					ViZData[index].AAL = ViZData[index].AAL + 1;
				} else if (ResponseData[i].CargoType === "DHL") {
					ViZData[index].DHL = ViZData[index].DHL + 1;
				}
			} else {
				ViZData.push({
					"Year": ResponseData[i].Year,
					"AAL": ResponseData[i].CargoType === "AAL" ? 1 : 0,
					"DHL": ResponseData[i].CargoType === "DHL" ? 1 : 0
				});
			}
		},
		_ArrangeDataForVizCargo: function (Data) {
			var ViZData = [];
			var ResponseData = Data.results;
			var SelectedYears = this.getView().byId("idHerbpCargoYear").getSelectedKeys();
			var SelectedCountries = this.getView().byId("idHrbpCargoCountry").getSelectedKeys();
			if (SelectedYears.length >= SelectedCountries.length) {
				var xaxis = "Year";
			}
			if (xaxis !== "Year") { //&& SelectedCountries.length >= 2
				xaxis = "Country";
			}

			for (var i = 0; i < ResponseData.length; i++) {

				//////################ x-axis Year ##################//////
				//####################################################////
				if (xaxis === "Year") {
					if (SelectedYears.length === 0) {
						var arrangeYear = this.getView().getModel("Year").getData();
						for (var a = 0; a < arrangeYear.length; a++) {
							SelectedYears.push(arrangeYear[a].text.toString());
						}
					}
					for (var j = 0; j < SelectedYears.length; j++) {
						if (ResponseData[i].Year === SelectedYears[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (var k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Year === SelectedYears[j]) {
									var index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.CargoVIZChart(index, ResponseData, i, ViZData);
						}
					}
				} else if (xaxis === "Country") {
					for (j = 0; j < SelectedCountries.length; j++) {
						//////################ x-axis Country ##################//////
						//####################################################///////
						if (ResponseData[i].Country === SelectedCountries[j]) {
							//	var index = ViZData.findIndex(x => x.Year === SelectedYears[j]);
							for (k = 0; k < ViZData.length; k++) {
								if (ViZData[k].Country === SelectedCountries[j]) {
									index = k;
									break;
								} else {
									index = -1;
								}
							}
							this.CargoVIZChart(index, ResponseData, i, ViZData);
						}
					}
				}
			}
			Data.chart = ViZData;
			this.getView().getModel("vizDataC").setData(Data);
			this.getView().getModel("vizDataC").refresh();
			//	Country = ["Year"];
			var oVizFrame = this.getView().byId("idVizFrame3");
			var feeds = oVizFrame.getFeeds();
			try {
				oVizFrame.getDataset().getDimensions()[0].setName("Year");
				if (xaxis === "Year") {
					var dim = [{
						"name": "Year",
						"value": "{vizDataC>Year}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Year");
				} else if (xaxis === "Country") {
					dim = [{
						"name": "Country",
						"value": "{vizDataC>Country}"
					}];
					oVizFrame.getDataset().getDimensions()[0].setName("Country");
				}
				var dataset = {
					data: {
						path: "vizDataC>/chart"
					}
				};
				dataset.dimensions = dim;
				dataset.measures = [{
					"name": "AAL",
					"value": "{vizDataC>AAL}"
				}, {
					"name": "DHL",
					"value": "{vizDataC>DHL}"
				}];
				var oDataset = new FlattenedDataset(dataset);
				oVizFrame.setDataset(oDataset);
				//	oVizFrame.getDataset().getDimensions()[0].mBindingInfos.value.parts[0].path = "Country";

			} catch (err) {}

			for (i = 0; i < feeds.length; i++) {
				if (feeds[i].getUid() === "categoryAxis") {
					var categoryAxisFeed = feeds[i];
					oVizFrame.removeFeed(categoryAxisFeed);
					if (xaxis === "Year") {
						var feed = ["Year"];
					} else if (xaxis === "Country") {
						feed = ["Country"];
					}
					categoryAxisFeed.setValues(feed);
					oVizFrame.addFeed(categoryAxisFeed);
					break;
				}
			}

			var value = ["AAL", "DHL"];
			oVizFrame.setVizType("stacked_column");
			var feedValueAxis1 = this.getView().byId("valueAxisFeed3");
			oVizFrame.removeFeed(feedValueAxis1);
			feedValueAxis1.setValues(value);
			oVizFrame.addFeed(feedValueAxis1);
		},
		onPressDetailBack: function () {
			var oSplitApp = this.getView().byId("SplitContDemo");
			if (oSplitApp.getMode() == "ShowHideMode") {
				oSplitApp.setMode("HideMode");
				this.getView().byId("detail").setShowNavButton(false);
				/*this.getView().byId("idHRBPDepSecBUSMButton").setWidth("18rem");
				this.getView().byId("idHrbpSecBUDeptValSelection").setWidth("21.5rem");*/
			} else {
				oSplitApp.setMode("ShowHideMode");
				this.getView().byId("detail").setShowNavButton(true);
				/*this.getView().byId("idHRBPDepSecBUSMButton").setWidth("13.5rem");
				this.getView().byId("idHrbpSecBUDeptValSelection").setWidth("16.5rem");*/
			}

		},
		onListItemReportPress: function (evt) {
			var chart = this.getView().byId("idVizFrame1");
			var SelectedId = evt.getParameters("listitem").listItem.getId();
			if (SelectedId.indexOf("idBarChart") !== -1) {
				chart.setVizType("bat");
			} else if (SelectedId.indexOf("idColChart") !== -1) {
				chart.setVizType("column");
			} else if (SelectedId.indexOf("idLineChart") !== -1) {
				chart.setVizType("line");
			}
		},
		selectData: function (evt) {
			var that = this;
			var sChart = evt.getSource().getVizUid();
			this.pop = evt.getSource().getVizUid().split("")[evt.getSource().getVizUid().split("").length - 1];
			this.oVizFrame = this.getView().byId(sChart);
			var modelData = this.getView().getModel("vizData").getData().chart;
			var sel = this.getView().byId(sChart).vizSelection();
			for (var i = 0; i < modelData.length; i++) {
				if (modelData[i].Year === sel[0].data.Year) {
					if (sel[0].data.DEPU) {
						this.Average = modelData[i].DEPUAvgDuration;
					} else if (sel[0].data.BUSR) {
						this.Average = modelData[i].BUSRAvgDuration;
					} else if (sel[0].data.INFO) {
						this.Average = modelData[i].INFOAvgDuration;
					} else if (sel[0].data.SECO) {
						this.Average = modelData[i].SECOAvgDuration;
					}
					break;
				}
			}
			this.chartPopover = new Popover();
			this.chartPopover.setActionItems([{
				type: "action",
				text: "Average Travel Duration" + " - " + that.Average
			}]);

			this.oVizFrame.attachSelectData(that.fnSwitchPop(), that);
		},
		fnSwitchPop: function () {
			this.chartPopover.connect(this.oVizFrame.getVizUid());
		},
		onPressExportCSV: sap.m.Table.prototype.exportData || function (oEvent) {
			var that = this;
			var columnsToDownload = [];
			columnsToDownload = [{
				name: "Deputation Request No",
				template: {
					content: {
						path: "DepReq"
					}
				}
			}, {
				name: "Travel Request No",
				template: {
					content: {
						path: "TrvReq"
					}
				}
			}, {
				name: "Employee No",
				template: {
					content: {
						path: "EmpNo"
					}
				}
			}, {
				name: "Employee Name",
				template: {
					content: {
						path: "EmpName"
					}
				}
			}, {
				name: "Travel Type",
				template: {
					content: {
						path: "TrvKey"
					}
				}
			}, {
				name: "From Location",
				template: {
					content: {
						path: "FromLoc"
					}
				}
			}, {
				name: "To Country",
				template: {
					content: {
						path: "Country",
						formatter: function (country) {
							try {
								if (country) {
									var countryList = sap.ui.getCore().getModel("global").getData().country;
									for (var i = 0; i < countryList.length; i++) {
										if (countryList[i].MOLGA === country) {
											return countryList[i].LTEXT;
										}
									}
								}
								return country;
							} catch (exc) {
								return country;
							}
						}
					}
				}
			}, {
				name: "To Location",
				template: {
					content: {
						path: "ToLoc"
					}
				}
			}, {
				name: "Start Date",
				template: {
					content: {
						path: "Begda",
						formatter: function (Begda) {
							if (Begda !== "00000000" && Begda !== "" && Begda !== null) {
								return Begda.substring(6, 8) + "/" + Begda.substring(4, 6) + "/" + Begda.substring(0, 4);
							} else {
								return "";
							}
						}
					}
				}
			}, {
				name: "End Date",
				template: {
					content: {
						path: "Endda",
						formatter: function (Endda) {
							if (Endda !== "00000000" && Endda !== "" && Endda !== null) {
								return Endda.substring(6, 8) + "/" + Endda.substring(4, 6) + "/" + Endda.substring(0, 4);
							} else {
								return "";
							}
						}
					}
				}
			}, {
				name: "Duration",
				template: {
					content: {
						path: "Ndays"
					}
				}
			}, {
				name: "Assignment Type",
				template: {
					content: {
						path: "AsgType",
						formatter: function (val) {
							if (val !== "" && val !== null) {
								var asgData = that.getView().getModel("AsgModelData").getData();
								for (var i = 0; i < asgData.length; i++) {
									if (val === asgData[i].Type) {
										return asgData[i].Desc;
									}
								}
							}
						}
					}
				}
			}, {
				name: "Level",
				template: {
					content: {
						path: "Level"
					}
				}
			}];
			if (this.SelectedPage === "detail") {
				this.getView().getModel("vizData").setSizeLimit(that.HRBPTravelTrendsTableLength);
				var ModelTodownload = this.getView().getModel("vizData");
				columnsToDownload.push({
					name: "Family Accompanied",
					template: {
						content: {
							path: "FamilyAccomp"
						}
					}
				}, {
					name: "Family sponsorship",
					template: {
						content: {
							path: "Family"
						}
					}
				}, {
					name: "Conversion/New Request",

					template: {
						content: {
							path: "Conversion",
							formatter: function (sValue) {
								if (sValue !== "" && sValue !== null && sValue !== undefined) {
									return sValue;
								} else {
									return "New";
								}
							}
						}
					}
				}, {
					name: "Section",
					template: {
						content: {
							path: "Section"
						}
					}
				}, {
					name: "Business Unit",
					template: {
						content: {
							path: "Buint"
						}
					}
				}, {
					name: "Department",
					template: {
						content: {
							path: "Dept"
						}
					}
				}, {
					name: "Group",
					template: {
						content: {
							path: "Group"
						}
					}
				});
			} else if (this.SelectedPage === "detailTicketing") {
				this.getView().getModel("vizDataT").setSizeLimit(that.HRBPTicketingTableLength);
				ModelTodownload = this.getView().getModel("vizDataT");
				columnsToDownload.push({
					name: "Ticket Cost",
					template: {
						content: {
							path: "TicketAmount"
						}
					}
				}, {
					name: "Travel Class",
					template: {
						content: {
							path: "TicketType"
						}
					}
				}, {
					name: "Airline",
					template: {
						content: {
							path: "AirLines"
						}
					}
				});
			} else if (this.SelectedPage === "detailCargo") {
				this.getView().getModel("vizDataC").setSizeLimit(that.HRBPCargoTableLength);
				ModelTodownload = this.getView().getModel("vizDataC");
				columnsToDownload.push({
					name: "CargoType",
					template: {
						content: {
							path: "CargoType"
						}
					}
				}, {
					name: "Vendor",
					template: {
						content: {
							path: "Vendor"
						}
					}
				}, {
					name: "MovementDate",
					template: {
						content: {
							path: "CargoMvmntDate"
						}
					}
				});
			}
			//////////////////////////////Download CSV File /////////////////////////////////	
			var oExport = new sap.ui.core.util.Export({
				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
					//	separatorChar : ";",
					charset: "utf-8",
				}),
				// Pass in the model created above
				models: ModelTodownload,
				// binding information for the rows aggregation
				rows: {
					path: "/results"
				},
				// column definitions with column name and binding info for the content
				columns: columnsToDownload
			});
			oExport.generate().done(function (sContent) {
				//	console.log(sContent);
			}).always(function () {
				this.destroy();
			});
			// download exported file
			oExport.saveFile().catch(function (oError) {
				sap.m.MessageToast.show("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},

		ExportCSVPDF: function () {
			if (this.SelectedPage === "detail") {
				var chartValue = this.getView().byId("idVizFrame1");
				var val = this.getView().byId("idChartContainer1").getSelectedContent().getTitle();
			} else if (this.SelectedPage === "detailTicketing") {
				chartValue = this.getView().byId("idVizFrame2");
				val = this.getView().byId("idChartContainer2").getSelectedContent().getTitle();
			} else if (this.SelectedPage === "detailCargo") {
				chartValue = this.getView().byId("idVizFrame3");
				val = this.getView().byId("idChartContainer3").getSelectedContent().getTitle();
			}

			if (val === "Viz") {
				this.onPressDownloadPDF(chartValue);
			} else {
				this.onPressExportCSV();
			}
		},

		onPressDownloadPDF: function (chartValue) {
			/*if (this.SelectedPage === "detail") {
				var chartValue = this.getView().byId("idVizFrame1");
			} else if (this.SelectedPage === "detailTicketing") {
				chartValue = this.getView().byId("idVizFrame2");
			} else if (this.SelectedPage === "detailCargo") {
				chartValue = this.getView().byId("idVizFrame3");
			}*/
			var sSVG = chartValue.exportToSVGString({
				width: 800,
				height: 600
			});

			sSVG = sSVG.replace(/translate /gm, "translate");
			var oCanvasHTML = document.createElement("canvas");
			oCanvasHTML.width = 800;
			oCanvasHTML.height = 600;

			var ctx = oCanvasHTML.getContext('2d');
			var data = sSVG;
			var DOMURL = window.URL || window.webkitURL || window;
			var img1 = new Image();
			var svg = new Blob([data], {
				type: 'image/svg+xml'
			});
			var url = DOMURL.createObjectURL(svg);
			img1.onload = function () {
				ctx.drawImage(img1, 0, 10);
				DOMURL.revokeObjectURL(url);
				var sImageData = oCanvasHTML.toDataURL("image/png");
				var oPDF = new jsPDF();
				oPDF.addImage(sImageData, "png", 5, 10, 180, 160);
				oPDF.save("Report");
			};
			img1.src = url;
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.bosch.hr.swift_trv.view.Reports
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.bosch.hr.swift_trv.view.Reports
		 */

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.bosch.hr.swift_trv.view.Reports
		 */
		//	onExit: function() {
		//
		//	}

	});

});