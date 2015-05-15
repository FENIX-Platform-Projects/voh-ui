/*global define, _:false, $, console, amplify, FM*/
define([
    'views/base/view',
    'config/Config',
    'config/Services',
    'text!templates/home/home.hbs',
    'text!templates/home/database_update_item.hbs',
    'text!templates/home/document_item.hbs',
    'i18n!nls/home',
    'handlebars',
    'text!json/home/database_updates.json',
    'text!json/home/documents.json',
    'fx-common/WDSClient',
    'amplify',
    'fenix-ui-map'
], function (View, Config, Services, template, dbUpdatesTemplate, documentTemplate, i18nLabels, Handlebars, dbUpdatesModels, documentsModels, WDSClient) {

    'use strict';

    var s = {
        MAP_TOOLBAR_FORM: '#map-toolbar-form',
        FORM_RADIO_BTNS: 'input[type="radio"][name="status"]',
        DB_UPDATES_LIST: '#db-updates-list',
        DOCUMENTS_LIST: '#documents-list',
        DOWNLOAD_MAP_BTN: '#download-map-button',
        MAP: '#map',
        TWITTER_WIDG_ID : "twitter-wjs"
    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        getTemplateData: function () {

            var lables =  i18nLabels;
            lables.twitter_account_id = Config.TWITTER_ACCOUNT_ID;

            return lables;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish('voh.state.change', {menu: 'home'});

            this.initVariables();
            this.initComponents();
            this.bindEventListeners();
            this.configurePage();
        },

        initVariables: function () {

            this.$mapToolbarForm = this.$el.find(s.MAP_TOOLBAR_FORM);
            this.$mapformRadioBtns = this.$mapToolbarForm.find(s.FORM_RADIO_BTNS);

            //database updates
            this.$dbUpdatesList = this.$el.find(s.DB_UPDATES_LIST);

            //document list
            this.$documentsList = this.$el.find(s.DOCUMENTS_LIST);

            //document list
            this.$downloadMapBtn = this.$el.find(s.DOWNLOAD_MAP_BTN);

        },

        initComponents: function () {

            this.initDatabaseUpdatesList();
            this.initDocumentsLinkList();

            this.initTwitterWidget(document,"script", s.TWITTER_WIDG_ID);

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

            //If the download btn is clicked
            this.$downloadMapBtn.on('click', _.bind(this.onClickDownloadMap, this));

        },

        //Page section initialization
        initDatabaseUpdatesList: function () {

            _.each(JSON.parse(dbUpdatesModels), _.bind(this.printDatabaseUpdate, this));
        },

        printDatabaseUpdate: function (u) {

            var template = Handlebars.compile(dbUpdatesTemplate);
            this.$dbUpdatesList.append(template(u));
        },

        initDocumentsLinkList: function () {
            _.each(JSON.parse(documentsModels), _.bind(this.printDocuments, this));
        },

        printDocuments: function (d) {
            var template = Handlebars.compile(documentTemplate);
            this.$documentsList.append(template(d));
        },


        initMap: function(d) {
            s.map = new FM.Map(d, {
                plugins: {
                    zoomcontrol: 'bottomright',
                    disclaimerfao: true,
                    fullscreen: true,
                    geosearch: true,
                    mouseposition: false,
                    controlloading : true,
                    zoomResetControl: true
                },
                guiController: {
                    overlay: false,
                    baselayer: true,
                    wmsLoader: false
                }
            });
            s.map.createMap(0, 0, 2);

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
                openlegend: true,
                defaultgfi: true,
                colorramp: 'OrRd',
                lang: 'en',
                customgfi: {
                    content: {
                        en: "<div class='fm-popup'>{{adm0_name}} <div class='fm-popup-join-content'>{{{adm0_code}}} Index</div></div>"
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

            this.setMapStatus($(e.currentTarget).val());
            this.WDSClient.query({
                queryTmpl: Services.MAP_FI_POPULATION,
                queryVars: {'query_variables': $(e.currentTarget).val()},
                success: _.bind(this.updateJoinLayer, this),
                error: _.bind(this.onUpdateJoinLayerError, this)
            });
        },

        onUpdateJoinLayerError: function(e) {

        },

        updateJoinLayer: function (data) {
            s.joinlayer.layer.joindata = [];
            _.each(data, _.bind(function (f) {
                var keys = Object.keys(f);
                var d = {};
                d[f[keys[0]]] = f[keys[1]];
                s.joinlayer.layer.joindata.push(d);
            }, this));
            s.joinlayer.redraw();
        },


        onClickDownloadMap: function (e) {

            this.downloadMap();
        },

        downloadMap: function () {
            //console.log('download Map');
        },

        setMapStatus: function (status) {

            //console.log("SET MAP STAUTS: " + status);

        },

        unbindEventListeners: function () {

            this.$mapformRadioBtns.off();
            this.$downloadMapBtn.off();

        },

        initTwitterWidget : function (d,s,id) {
                var js, fjs = d.getElementsByTagName(s)[0],
                    p = /^http:/.test(d.location) ? 'http' : 'https';
                js = d.createElement(s);
                js.id = id;
                js.src = p + "://platform.twitter.com/widgets.js";
                fjs.parentNode.insertBefore(js, fjs);
        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return HomeView;
});
