/*global define*/
define(function ( ) {

    'use strict';

    return {

        //WDS and Data
        DB_NAME : 'voh',
        WDS_URL : 'http://fenixservices.fao.org/wds/5.2.1/rest/crud',
        WDS_URL_ARRAY : 'http://fenixservices.fao.org/wds/5.2.1/rest/table/json',
        WDS_OUTPUT_TYPE : 'array',
        INDEX_GEO_CODE: 0,
        INDEX_GEO_LABEL: 1,
        INDEX_VARIABLE_CODE: 2,
        INDEX_GROUP_CODE: 3,
        INDEX_STATUS_MS: 4,
        INDEX_STATUS_S: 5,
        INDEX_GROUP_LABEL: 6,
        INDEX_VARIABLE_LABEL: 7,

        //General
        DEFAULT_FI_STATUS : 's',
        DEFAULT_GEO_GRANULARITY : 'country',
        DEFAULT_GEO_SELECTION : ['3', '79'],
        DEFAULT_VARIABLE_SELECTION : ['age', 'location', 'gender'],
        DEFAULT_SHOW_TOTAL : true,

        TWITTER_ACCOUNT_ID: "598107149366099968",

        //Visualization Scores
        GEO_SELECTION_THRESHOLD: 10,
        GEO_LAYOUT_THRESHOLD: 4,
        CHART_TYPE: "column",
        CHART_TOTAL_COLOR: "#f2a940"


    };
});
