sap.ui.define([
], function () {
	"use strict";
	return {
        getSwitchState : function (status){
            return (status === undefined) ? false : status;
        }
    }
})
