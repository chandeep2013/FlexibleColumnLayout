sap.ui.define(['sap/ui/model/json/JSONListBinding'], function (
    JSONListBinding
  ) {
    'use strict';
    /**
     * PagingJSONListBinding
     * @class
     * @extends sap.ui.model.json.JSONListBinding
     */
    return JSONListBinding.extend('com.mhirj.dms.zmhirjdmscp.GrowingJSONListBinding', {
      getLength: function () {
        // return this.getModel()._totalCount;
        // var path = !this.sPath ? "count" : this.sPath + "/count";
        var count = this.getModel()._totalCount;
        return (count) ? count : JSONListBinding.prototype.getLength.call(this);
      },
    });
  });
  