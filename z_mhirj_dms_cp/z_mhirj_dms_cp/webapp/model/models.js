sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {

        createLocalModel: function () {
            var projectData = {
                "DMS_Model":{
                    "DropDownsData":{},
                    "SelectedData":{}
                }
            };
            
            var oModel = new JSONModel(projectData);
            oModel.setDefaultBindingMode("OneWay");
            oModel.setSizeLimit(9999999999);
            return oModel;
        }
    };
});
