/*global define, Backbone*/
define([
    'chaplin',
    'underscore',
    'controllers/base/controller',
    'views/visualization/scores-view'
], function (Chaplin, _, Controller, VisualizationView) {

    'use strict';

    var VisualizationScoresController = Controller.extend({

        show: function (params) {

            this.view = new VisualizationView({
                region: 'main',
                params: params
            });
        }
    });

    return VisualizationScoresController;
});
