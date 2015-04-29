/*global define*/
define(function ( ) {

    return {
        CD_REGION : 'select region_code, region_label from codes_region',
        AGGREGATION : 'select country, variable||'|'||group_code "column", ms from master_aggregation where country = "111"',
        AGGREGATION_2 : ' select country, variable||'|'||group_code "column", ms from master_aggregation where ((variable="age" and group_code<>"4")or (variable="education" and group_code<>"4" and group_code<>"5")or (variable="location" and group_code<>"4" and group_code<>"5")or (variable="gender")or (variable="population"))'
    };
});
