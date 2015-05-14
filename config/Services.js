/*global define*/
define(function ( ) {

    'use strict';

    return {

//        CHART_COUNTRY: "SELECT country, country_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '3' ) AND variable IN ( 'age', 'marital' ) ORDER BY variable, country, group_code",
        CHART_COUNTRY: "SELECT country, country_label, variable, group_code, ms, s FROM master_aggregation JOIN codes_country on (country = country_code) WHERE country IN ( '{country}' ) AND variable IN ( '{variables}' ) ORDER BY variable, country, group_code",

        CD_MARITAL: "SELECT marital_code, marital_label FROM codes_marital;",
        CD_AGE : "SELECT age_range_code, age_range_label FROM codes_age_range;",
        CD_EDUCATION : "SELECT education_code, education_label FROM codes_education;",
        CD_LOCATION : "SELECT location_range_code, location_range_label FROM codes_location_range",
        CD_INCOME: "SELECT income_code, income_label FROM codes_income;",
        CD_GENDER: "SELECT gender_code, gender_label FROM codes_gender;"

    };
});
