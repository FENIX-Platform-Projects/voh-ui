/*global require*/

//develop
var pathProjectRoot = ".";
var projectRoot = "../..";
//var projectRoot = "http://localhost:8080";

//distribution
//var projectRoot = "http://www.fao.org/fenixrepo/voh-map/", pathProjectRoot = projectRoot;

require.config({
    config: {
        text: {
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    },
    paths: {
        compilerPaths: pathProjectRoot + '/submodules/fenix-ui-common/js/Compiler',
        commonPaths: pathProjectRoot + '/submodules/fenix-ui-common/js/paths',
        menuPaths: pathProjectRoot + '/submodules/fenix-ui-menu/js/paths',
        chartPaths: pathProjectRoot + '/submodules/fenix-ui-chart-creator/src/js/paths',
        olapPaths: pathProjectRoot + '/submodules/fenix-ui-olap/js/paths'
    }
});

require([
    "compilerPaths",
    "commonPaths",
    "chartPaths",
    "menuPaths",
    'olapPaths'
], function (Compiler, Common, ChartCreator, Menu, Olap) {

    'use strict';
    var submodules_path = projectRoot + '/submodules';

    var menuConfig = Menu;
    menuConfig.baseUrl = submodules_path + '/fenix-ui-menu/js';

    var commonConfig = Common;
    commonConfig.baseUrl = submodules_path + '/fenix-ui-common/js';

    var chartCreatorConfig = ChartCreator;
    chartCreatorConfig.baseUrl = submodules_path + '/fenix-ui-chart-creator/src/js';

    var olapConfig = Olap;
    olapConfig.baseUrl = submodules_path + '/fenix-ui-olap/js';

    Compiler.resolve([menuConfig, commonConfig, chartCreatorConfig, olapConfig],
        {

            placeholders: {"FENIX_CDN": "http://fenixrepo.fao.org/cdn"},

            config: {

                //Set the config for the i18n
                i18n: {
                    locale: 'en'
                },

                // The path where your JavaScripts are located
                baseUrl: pathProjectRoot + '/src/js',

                // Specify the paths of vendor libraries
                paths: {
                    domReady: "{FENIX_CDN}/js/requirejs/plugins/domready/2.0.1/domReady",
                    i18n: "{FENIX_CDN}/js/requirejs/plugins/i18n/2.0.4/i18n",
                    bootstrap: "{FENIX_CDN}/js/bootstrap/3.3.4/js/bootstrap.min",
                    underscore: "{FENIX_CDN}/js/underscore/1.7.0/underscore.min",

                    backbone: "{FENIX_CDN}/js/backbone/1.1.2/backbone.min",
                    handlebars: "{FENIX_CDN}/js/handlebars/2.0.0/handlebars",
                    chaplin: "{FENIX_CDN}/js/chaplin/1.1.1/chaplin.min",

                    jquery: "{FENIX_CDN}/js/jquery/2.1.1/jquery.min",

                    nls: projectRoot + "/i18n",
                    config: projectRoot + "/config",
                    json: projectRoot + "/json",

                    amplify: '{FENIX_CDN}/js/amplify/1.1.2/amplify.min',
                    packery: '{FENIX_CDN}/js/packery/1.4.3/dist/packery.pkgd.min',
                    jqueryBridget: '{FENIX_CDN}/js/jquery.bridget/1.1.0/jquery.bridget',
                    jstree: '{FENIX_CDN}/js/jstree/3.0.8/dist/jstree.min',
                    q: '{FENIX_CDN}/js/q/1.1.2/q',

                    // fenix-map-js
                    'import-dependencies': '{FENIX_CDN}/js/FENIX/utils/import-dependencies-1.0',
                    'leaflet': '{FENIX_CDN}/js/leaflet/0.7.3/leaflet',
                    'jquery.powertip': '{FENIX_CDN}/js/jquery.power.tip/1.2.0/jquery.powertip.min',
                    'jquery-ui': '{FENIX_CDN}/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
                    'jquery.i18n.properties': '{FENIX_CDN}/js/jquery/1.0.9/jquery.i18n.properties-min',
                    'jquery.hoverIntent': '{FENIX_CDN}/js/jquery.hoverIntent/1.8.0/jquery.hoverIntent.min',

                    'fenix-ui-map': '{FENIX_CDN}/fenix/fenix-ui-map/0.1.2/fenix-ui-map.src',
                    'fenix-ui-map-config': '{FENIX_CDN}/fenix/fenix-ui-map/0.1.2/fenix-ui-map-config',
                    //'bootstrap-list-filter' : "{FENIX_CDN}/js/bootstrap-list-filter/0.1.7/bootstrap-list-filter.min",
                    //'bootstrap-list-filter': "lib/bootstrap-list-filter",

                    //TODO TEMP
                    'fx-c-c/templates/base_template': projectRoot + '/src/js/tools/voh_chart_template',

                    //OLAP DEPS
                    pivot: projectRoot +"/submodules/fenix-ui-olap/js/pivot",
                    gt_msg: projectRoot +"/submodules/fenix-ui-olap/lib/grid/gt_msg_en",
                    jqueryui: projectRoot +"/submodules/fenix-ui-olap/lib/jquery-ui-1.9.2.custom.min",
                    gt_msg_grid: projectRoot +"/submodules/fenix-ui-olap/lib/grid/gt_grid_all",
                    HPivot: "{FENIX_CDN}/js/jbpivot/0.1.0-olap/jbpivot.min",
                    highcharts: "{FENIX_CDN}/js/highcharts/4.0.4/js/highcharts",

                    "nls/pivot": projectRoot + "/i18n/pivot",

                    pivotRenderersFuncs: projectRoot +"/submodules/fenix-ui-olap/js/rend/function_rendererers",
                    pivotRenderers: projectRoot +"/submodules/fenix-ui-olap/js/rend/rendererers",
                    pivotAggregatorsFuncs:projectRoot+ "/submodules/fenix-ui-olap/js/rend/function_aggregators",
                    pivotAggregators: projectRoot+"/submodules/fenix-ui-olap/js/rend/aggregators",
                    pivotDataConfig: projectRoot+ '/config/submodules/fx-olap/dataConfig',
                    pivotDataTest: projectRoot+'/submodules/fenix-ui-olap/tests/data/test.json',
                    'fx-olap/config/gridoption': projectRoot + '/config/submodules/fx-olap/gridoption',

                    "chaplin/views/layout" :  "views/layout"
                },

                // Underscore and Backbone are not AMD-capable per default,
                // so we need to use the AMD wrapping of RequireJS
                shim: {
                    bootstrap: {
                        deps: ["jquery"]
                    },
                    'bootstrap-list-filter': {
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
                    jstree: {
                        deps: ['jquery']
                    },
                    packery: ["jquery"],
                    application: {
                        deps: ['bootstrap']
                    },
                    'fenix-ui-map': {
                        deps: [
                            'jquery',
                            'jquery-ui',
                            'leaflet',
                            'fenix-ui-map-config',
                            'jquery.powertip',
                            'jquery.i18n.properties',
                            'import-dependencies',
                            'jquery.hoverIntent',
                            //'chosen'
                        ]
                    },
                    //OLAP DEPS
                    jqueryui: ['jquery'],
                    highcharts: ['jquery'],
                    gt_msg: ['jquery'],
                    gt_msg_grid: ['jquery', 'gt_msg'],
                    pivotRenderers: ['pivotRenderersFuncs'],
                    pivotAggregators: ['pivotAggregatorsFuncs', 'jquery'],
                    pivot: {
                        deps: [
                            'jquery',
                            'jqueryui',
                            'gt_msg', 'gt_msg_grid',
                            'HPivot',
                            'pivotRenderers',
                            'nls/pivot'
                        ]
                    },
                    HPivot: ['jquery', 'jqueryui']
                }
                // For easier development, disable browser caching
                // Of course, this should be removed in a production environment
                //, urlArgs: 'bust=' +  (new Date()).getTime()
            }
        });

require([
    'jquery','jquery',
    'underscore',
    'config/Config',
    'config/Services',
    'text!templates/home/home.hbs',
    'text!templates/home/database_update_item.hbs',
    'text!templates/home/document_item.hbs',
    'i18n!nls/labels',
    'handlebars',
    'text!json/home/database_updates.json',
    'text!json/home/documents.json',
    'fx-common/WDSClient',
    'amplify',
    'fenix-ui-map'
], function ($, jQuery,_, Config, Services, template, dbUpdatesTemplate, documentTemplate, i18nLabels, Handlebars, dbUpdatesModels, documentsModels, WDSClient) {

    window.FMCONFIG.BASEURL_LANG = 'http://www.fao.org/fenixrepo/cdn/fenix/fenix-ui-map/0.1.2/i18n/';
    var s = {
        MAP_TOOLBAR_FORM: '#map-toolbar-form',
        FORM_RADIO_BTNS: 'input[type="radio"][name="status"]',
        DB_UPDATES_LIST: '#db-updates-list',
        DOCUMENTS_LIST: '#documents-list',
        DOWNLOAD_MAP_BTN: '#download-map-button',
        MAP: '#map'
    };

    var HomeView = {

        attach: function () {

            //$('body').addClass('voh-home');
            //update State
            //amplify.publish('voh.state.change', {menu: 'home'});

            this.$el = $(Handlebars.compile(template)(i18nLabels)).appendTo('#wrapperMap');

            this.initVariables();
            this.initComponents();
            this.bindEventListeners();
            this.configurePage();
        },

        initVariables: function () {
            this.$mapToolbarForm = this.$el.find(s.MAP_TOOLBAR_FORM);
            this.$mapformRadioBtns = this.$mapToolbarForm.find(s.FORM_RADIO_BTNS);
        },

        initComponents: function () {

            this.WDSClient = new WDSClient({
                serviceUrl: Config.WDS_URL,
                datasource: Config.DB_NAME,
                outputType : Config.WDS_OUTPUT_TYPE
            });

            this.initMap(s.MAP);
        },

        configurePage: function () {
            //Activate the default food insecurity status on the map
            this.$mapformRadioBtns.filter('[value="' + Config.DEFAULT_FI_STATUS + '"]').prop("checked", true).change();
        },

        bindEventListeners: function () {
            //If a map toolbar radio btn is changed -> update Map
            this.$mapformRadioBtns.on('change', _.bind(this.onMapStatusChange, this));
        },

        printDatabaseUpdate: function (u) {

            var template = Handlebars.compile(dbUpdatesTemplate);
            this.$dbUpdatesList.append(template(u));
        },

        printDocuments: function (d) {
            var template = Handlebars.compile(documentTemplate);
            this.$documentsList.append(template(d));
        },


        initMap: function(d) {
            s.map = new FM.Map(d, {
                plugins: {
                    zoomcontrol: false,
                    disclaimerfao: false,
                    fullscreen: false,
                    geosearch: false,
                    mouseposition: false,
                    controlloading : false,
                    zoomResetControl: false
                },
                guiController: {
                    overlay: false,
                    baselayer: false,
                    wmsLoader: false
                }
            });
            s.map.createMap(30, 0, 2);

            s.joinlayer = new FM.layer({
                layers: 'fenix:gaul0_3857',
                layertitle: i18nLabels.food_insecurity,
                opacity: '0.7',
                joincolumn: 'adm0_code',
                joincolumnlabel: 'adm0_name',
                joindata: [],
                mu: "Index",
                legendsubtitle: "Index",
                layertype: 'JOIN',
                jointype: 'shaded',
                openlegend: false,
                defaultgfi: true,
                colorramp: 'Blues',
                lang: 'en',
                customgfi: {
                    content: {
                        en: "<div class='fm-popup'>{{adm0_name}} <div class='fm-popup-join-content'>{{{adm0_code}}} %</div></div>"
                    },
                    showpopup: true
                }
            });
            s.map.addLayer(s.joinlayer);

            s.map.addLayer(new FM.layer({
                layers: 'fenix:gaul0_line_3857',
                layertitle: 'Country Boundaries',
                urlWMS: 'http://fenix.fao.org/geoserver',
                opacity: '0.9',
                lang: 'en'
            }));
        },

        onMapStatusChange: function (e) {

            this.WDSClient.retrieve({
                payload: {
                    query: Services.MAP_FI_POPULATION,
                    queryVars: {'query_variables': $(e.currentTarget).val()},
                    outputType: "object"
                },
                success: _.bind(this.updateJoinLayer, this)
            });
        },

        updateJoinLayer: function (data) {
            //console.log('updateJoinLayer',data);
            
            if(data.length===0) return;

            data.shift();

            s.joinlayer.layer.joindata = [];
            _.each(data, _.bind(function (f) {
                var keys = Object.keys(f);
                var d = {};
                d[f[keys[0]]] = f[keys[1]];
                s.joinlayer.layer.joindata.push(d);
            }, this));

            s.joinlayer.redraw();
        }
    };

    HomeView.attach();

    });

});

