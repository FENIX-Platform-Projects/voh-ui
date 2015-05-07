/*global define*/
define([
    'controllers/base/controller',
    'views/standards-view'
], function (Controller, CountryView) {
    'use strict';

    var StandardsController = Controller.extend({

        show: function (params) {

            this.view = new CountryView({
                region: 'main'
            });
        }
    });

    return StandardsController;
});
