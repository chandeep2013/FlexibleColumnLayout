sap.ui.define(
    ['com/mhirj/dms/zmhirjdmscp/controls/GrowingJSONListBinding', 'sap/ui/model/json/JSONModel'],
    function (GrowingListBinding, JSONModel) {
      'use strict';
      /**
       * PagingJSONModel
       * @class
       * @extends sap.ui.model.json.JSONModel
       */
      return JSONModel.extend('com.mhirj.dms.zmhirjdmscp.GrowingJSONModel', {
        bindList: function (sPath, oContext, aSorters, aFilters, mParameters) {
          return new GrowingListBinding(
            this,
            sPath,
            oContext,
            aSorters,
            aFilters,
            mParameters
          );
        },
      });
    }
  );
  