/*global define*/
define(function ( ) {

    'use strict';

    return {

        //WDS and Data
        DB_NAME : 'voh',
        WDS_URL : 'http://fenixapps2.fao.org/wds_5/rest/fenix/query',
        WDS_URL_ARRAY : 'http://fenixapps2.fao.org/wds_5/rest/table/json',
        WDS_OUTPUT_TYPE : 'object',

        //General
        DEFAULT_FI_STATUS : 's',
        DEFAULT_GEO_GRANULARITY : 'country',
        DEFAULT_GEO_SELECTION : ['3', '79'],
        DEFAULT_VARIABLE_SELECTION : ['age', 'location', 'gender'],
        DEFAULT_SHOW_TOTAL : true,

        TWITTER_ACCOUNT_ID: "598107149366099968",

        //Visualization Scores
        GEO_SELECTION_THRESHOLD: 999,
        CHART_TYPE: "column",
        CHART_TOTAL_COLOR: "red"


    };
});
