/*global define*/
define(function ( ) {

    'use strict';

    return {

//        CHART_COUNTRY: "SELECT country, country_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '3' ) AND variable IN ( 'age', 'marital' ) ORDER BY variable, country, group_code",
        CHART_COUNTRY: "SELECT country, country_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{query_country}' ) AND variable IN ( '{query_variables}' ) ORDER BY variable, country, group_code",

        CL_MARITAL: "SELECT marital_code, marital_label FROM codes_marital;",
        CL_AGE : "SELECT age_range_code, age_range_label FROM codes_age_range;",
        CL_EDUCATION : "SELECT education_code, education_label FROM codes_education;",
        CL_LOCATION : "SELECT location_range_code, location_range_label FROM codes_location_range",
        CL_INCOME: "SELECT income_code, income_label FROM codes_income;",

        MAP_FI_POPULATION: "SELECT country, {query_variables} FROM master_aggregation WHERE variable = 'population';"
    };
});
