/*global define*/
define(function ( ) {

    'use strict';

    return {

        CHART_COUNTRY: "SELECT country as geo, country_label as geo_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",
        CHART_REGION: "SELECT region as geo, region_label as geo_label, variable, group_code, ms, s FROM master_aggregation_region JOIN codes_region on (region = region_code) WHERE region IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, region, group_code",

        OLAP_COUNTRY: "SELECT country as geo, country_label as geo_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",
        OLAP_REGION: "SELECT region as geo, region_label as geo_label, variable, group_code, ms, s FROM master_aggregation_region JOIN codes_region on (region = region_code) WHERE region IN ( '{query_geo}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, region, group_code",

        CL_MARITAL: "SELECT marital_code as code, marital_label as label FROM codes_marital;",
        CL_AGE : "SELECT age_range_code as code, age_range_label as label FROM codes_age_range;",
        CL_EDUCATION : "SELECT education_code as code, education_label as label FROM codes_education;",
        CL_LOCATION : "SELECT location_range_code as code, location_range_label as label FROM codes_location_range",
        CL_INCOME: "SELECT income_code as code, income_label as label FROM codes_income;",
        CL_GENDER: "SELECT gender_code as code, gender_label as label FROM codes_gender;",
        CL_COUNTRY: "select distinct country_code as code, country_label as label from master_aggregation INNER JOIN codes_country ON master_aggregation.country = codes_country.country_code order by country_label",
        //CL_COUNTRY: "SELECT country_code as code, country_label as label FROM codes_country;",
        CL_REGION: "select distinct region_code as code, region_label as label from master_aggregation_region INNER JOIN codes_region ON master_aggregation_region.region = codes_region.region_code order by region_label",
        //CL_REGION: "SELECT region_code as code, region_label as label FROM codes_region;",

        MAP_FI_POPULATION: "SELECT country, round( CAST({query_variables} as numeric), 3) FROM master_aggregation WHERE variable = 'population';"    };
});
