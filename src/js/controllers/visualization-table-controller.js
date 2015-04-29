/*global define, Backbone*/
define([
    'chaplin',
    'underscore',
    'controllers/base/controller',
    'views/visualization/table-view'
], function (Chaplin, _, Controller, VisualizationView) {

    'use strict';

    var VisualizationTableController = Controller.extend({

        show: function (params) {

            this.view = new VisualizationView({
                region: 'main',
                params: params
            });
        }
    });

    return VisualizationTableController;
});
