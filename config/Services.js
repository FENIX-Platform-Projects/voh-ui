/*global define*/
define(function ( ) {

    'use strict';

    return {

        CHART_COUNTRY: "SELECT country as geo, country_label as geo_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",
        CHART_REGION: "SELECT geo, geo_label, variable, group_code, ms, s FROM master_aggregation_region JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",

        OLAP_COUNTRY: "SELECT country as geo, country_label as geo_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",
        OLAP_REGION: "SELECT geo, geo_label, variable, group_code, ms, s FROM master_aggregation_region JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",

        CL_MARITAL: "SELECT marital_code as code, marital_label FROM codes_marital;",
        CL_AGE : "SELECT age_range_code as code, age_range_label FROM codes_age_range;",
        CL_EDUCATION : "SELECT education_code as code, education_label FROM codes_education;",
        CL_LOCATION : "SELECT location_range_code as code, location_range_label FROM codes_location_range",
        CL_INCOME: "SELECT income_code as code, income_label FROM codes_income;",
        CL_GENDER: "SELECT gender_code as code, gender_label FROM codes_gender;",
        CL_COUNTRY: "SELECT country_code as code, country_label as label FROM codes_country;",
        CL_REGION: "SELECT region_code as code, region_label as label FROM codes_region;",

        MAP_FI_POPULATION: "SELECT country, {query_variables} FROM master_aggregation WHERE variable = 'population';"
    };
});
