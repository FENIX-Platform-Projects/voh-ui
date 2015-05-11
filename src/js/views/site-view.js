/*global define, amplify*/
define([
    'jquery',
    'chaplin',
    'underscore',
    'globals/State',
    'views/base/view',
    'fx-menu/start',
    'i18n!nls/site',
    'text!templates/site.hbs'
], function ($, Chaplin, _, State, View, Menu, i18nLabels, template) {

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

            this.bindEventListeners();
            this.initComponents();
        },

        bindEventListeners : function () {
            amplify.subscribe('voh.state.change', this, this.onStateUpdate);
        },

        initComponents : function () {

            //Top Menu
            this.topMenu = new Menu({
                url: 'config/submodules/fx-menu/top_menu.json',
                //active: State.menu,
                container: '#top-menu-container',
                callback: _.bind(this.onMenuRendered, this),
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

        onMenuRendered : function () {

            this.onMenuUpdate();
            amplify.subscribe('voh.menu.update', this, this.onMenuUpdate);
        },

        onStateUpdate : function ( s ) {

            State = $.extend(true, State, s);

            amplify.publish("voh.menu.update");
        },

        onMenuUpdate : function () {
            this.topMenu.select(State.menu);
        }

    });

    return SiteView;
});
