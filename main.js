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
                    q : '{FENIX_CDN}/js/q/1.1.2/q',


                    // fenix-map-js
                    'import-dependencies': '{FENIX_CDN}/js/FENIX/utils/import-dependencies-1.0',
                    leaflet: '{FENIX_CDN}/js/leaflet/0.7.3/leaflet',
                    'jquery.power.tip': '{FENIX_CDN}/js/jquery.power.tip/1.2.0/jquery.powertip.min',
                    'jquery-ui':   '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                    'jquery.i18n.properties': '{FENIX_CDN}/js/jquery/1.0.9/jquery.i18n.properties-min',
                    'jquery.hoverIntent': '{FENIX_CDN}/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',

                    'fenix-ui-map': '{FENIX_CDN}/js/fenix-ui-map/0.1/fenix-ui-map.min',
                    'fenix-ui-map-config': '{FENIX_CDN}/js/fenix-ui-map/0.1/fenix-ui-map-config',

                    //OLAP DEPS
					pivot:      "../../submodules/fenix-ui-olap/js/pivot",
					gt_msg:     "../../submodules/fenix-ui-olap/lib/grid/gt_msg_en",					
					jqueryui:   "../../submodules/fenix-ui-olap/lib/jquery-ui-1.9.2.custom.min",
					gt_msg_grid:"../../submodules/fenix-ui-olap/lib/grid/gt_grid_all",
					HPivot:     "//fenixapps.fao.org/repository/js/jbpivot/0.1.0-olap/jbpivot.min",
					highcharts: "//fenixapps.fao.org/repository/js/highcharts/4.0.4/js/highcharts",					

					"nls/pivot":  "../../i18n/pivot",

					pivotRenderersFuncs:   "../../submodules/fenix-ui-olap/js/rend/function_rendererers",
					pivotRenderers:        "../../submodules/fenix-ui-olap/js/rend/rendererers",
					pivotAggregatorsFuncs: "../../submodules/fenix-ui-olap/js/rend/function_aggregators",
					pivotAggregators:      "../../submodules/fenix-ui-olap/js/rend/aggregators",
					pivotDataConfig:         '../../submodules/fenix-ui-olap/config/dataConfig1',
					pivotDataTest:       '../../submodules/fenix-ui-olap/tests/data/test.json'
                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    bootstrap: {
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
                    },
                    'fenix-ui-map': {
                        deps: [
                            'jquery',
                            'jquery-ui',
                            'leaflet',
                            'fenix-ui-map-config',
                            'jquery.power.tip',
                            'jquery.i18n.properties',
                            'import-dependencies',
                            'jquery.hoverIntent',
                            //'chosen'
                        ]
                    },
                    //OLAP DEPS
					jqueryui: ['jquery'],
					highcharts:  ['jquery'],
					gt_msg:      ['jquery'],
					gt_msg_grid: ['jquery','gt_msg'],
					pivotRenderers: ['pivotRenderersFuncs'],	
					pivotAggregators: ['pivotAggregatorsFuncs','jquery'],			
					pivot: {
					    deps: [
					        'jquery',
					        'jqueryui',
							'gt_msg','gt_msg_grid',
							'HPivot',
							'pivotRenderers',
							'nls/pivot'
					    ]
					},
					HPivot: ['jquery','jqueryui']                    
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