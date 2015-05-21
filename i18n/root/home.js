/*global define*/
define([
    'jquery',
    'i18n!nls/common'
], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {
        "map_toolbar_legend": "Click to view <em>FOOD INSECURITY</em> status on the map",
        "database_update_title": "Database Updates",
        "documents_links_title": "Documents",
        "home_intro_title": "Welcome to Voices of the Hungry Data Portal",
        "home_intro_text": "Voices of the Hungry is an initiative by FAO with financial support of United Kingdom and Belgium. The project is seeking resources partners to extend the data collection beyond 2015 and to strengthen the capacity development activities. To know more about the project and get in touch with the VOH team, please visit the VOH Home.",
        "food_insecurity": "Food Insecurity"
    });

});