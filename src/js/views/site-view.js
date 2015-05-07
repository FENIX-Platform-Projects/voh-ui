/*global define*/
define([
    'chaplin',
    'underscore',
    'globals/State',
    'views/base/view',
    'fx-menu/start',
    'i18n!nls/site',
    'text!templates/site.hbs'
], function (Chaplin, _, State, View, Menu, i18nLabels, template) {

    'use strict';

    var SiteView = View.extend({

        container: 'body',

        id: 'site-container',

        regions: {
            main: '#main-container'
        },

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            var path = State.path.split("/");

            //Top Menu
            this.topMenu = new Menu({
                url: 'config/submodules/fx-menu/top_menu.json',
                active: path[ (path.length - 1 )],
                container: '#top-menu-container',
                callback: _.bind(this.bindEventListeners, this),
                breadcrumb : {
                    active : true,
                    container : "#breadcrumb-container",
                    showHome : true
                },
                footer : {
                    active : true,
                    container : "#footer-menu-container"
                }
            });
        },

        bindEventListeners : function () {

            this.subscribeEvent('dispatcher:dispatch', _.bind(function (a,b,c) {
                var path = State.path.split("/");
                this.topMenu.select(path[ (path.length - 1 )]);

            }, this));
        }

    });

    return SiteView;
});
