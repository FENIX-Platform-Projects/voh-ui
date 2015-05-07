/*global define*/
define([
    'controllers/base/controller',
    'views/country-view'
], function (Controller, CountryView) {
    'use strict';

    var CountryController = Controller.extend({

        show: function (params) {

            this.view = new CountryView({
                region: 'main'
            });
        }
    });

    return CountryController;
});
