/*global define*/
define([
    'chaplin',
    'views/base/view',
    'text!templates/visualization/table.hbs'
], function (Chaplin, View, template) {

    'use strict';

    var VisualizationView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'visualization-table',

        template: template,

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.bindEventListeners();

            this.initPage();
        },

        initPage: function () {

        },

        bindEventListeners: function () {  },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return VisualizationView;
});
