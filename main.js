/*global require*/

require([
    './submodules/fenix-ui-common/js/Compiler',
    './submodules/fenix-ui-common/js/paths',
    './submodules/fenix-ui-chart-creator/src/js/paths',
    './submodules/fenix-ui-menu/js/paths'
], function (Compiler, Common, ChartCreator, Menu) {

    'use strict';

    var menuConfig = Menu;
    menuConfig.baseUrl = '../../submodules/fenix-ui-menu/js';

    var commonConfig = Common;
    commonConfig.baseUrl = '../../submodules/fenix-ui-common/js';

    var chartCreatorConfig = ChartCreator;
    chartCreatorConfig.baseUrl = '../../submodules/fenix-ui-chart-creator/src/js';

    Compiler.resolve([menuConfig, commonConfig, chartCreatorConfig],
        {
            placeholders: {"FENIX_CDN": "//fenixapps.fao.org/repository"},
            config: {

                //Set the config for the i18n
                i18n: {
                    locale: 'en'
                },

                // The path where your JavaScripts are located
                baseUrl: './src/js',

                // Specify the paths of vendor libraries
                paths: {
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    nls: "../../i18n",
                    bootstrap: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",

                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",
                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.0.1/chaplin.min",

                    config: "../../config",
                    json: "../../json",

                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                    packery : '{FENIX_CDN}/js/packery/1.4.1/packery.pkgd.min',
                    jqueryBridget : '{FENIX_CDN}/js/jquery.bridget/1.1.0/jquery.bridget',
                    jstree : '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
                    //,swiper: '{FENIX_CDN}/js/swiper/3.07/dist/js/swiper.jquery.min'
                    q : '{FENIX_CDN}/js/q/1.1.2/q'

                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    "bootstrap": {
                        deps: ["jquery"]
                    },
                    underscore: {
                        exports: '_'
                    },
                    backbone: {
                        deps: ['underscore', 'jquery'],
                        exports: 'Backbone'
                    },
                    handlebars: {
                        exports: 'Handlebars'
                    },
                   /* swiper: {
                        deps: ['jquery']
                    },*/
                    amplify: {
                        deps: ['jquery'],
                        exports: 'amplifyjs'
                    },
                    jstree : {
                        deps: ['jquery']
                    },
                    packery : ["jquery"],
                    application: {
                        deps: ['bootstrap']
                    }
                }
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

    // Bootstrap the application
    require([
        'application',
        'routes',
        'domReady!'
    ], function (Application, routes) {

        var app = new Application({
            routes: routes,
            controllerSuffix: '-controller',
            root: '/voh/',
            pushState: false,
            scrollTo : false
        });
    });
});