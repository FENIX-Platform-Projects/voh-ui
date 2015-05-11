/*global define, _:false, $, console, amplify*/
define([
    'views/base/view',
    'config/Config',
    'text!templates/home/home.hbs',
    'text!templates/home/database_update_item.hbs',
    'text!templates/home/document_item.hbs',
    'i18n!nls/home',
    'handlebars',
    'text!json/home/database_updates.json',
    'text!json/home/documents.json',
    'amplify'
], function (View, Config, template, dbUpdatesTemplate, documentTemplate, i18nLabels, Handlebars, dbUpdatesModels, documentsModels) {

    'use strict';

    var s = {
        MAP_TOOLBAR_FORM: '#map-toolbar-form',
        FORM_RADIO_BTNS: 'input[type="radio"][name="status"]',
        DB_UPDATES_LIST: '#db-updates-list',
        DOCUMENTS_LIST: '#documents-list',
        DOWNLOAD_MAP_BTN: '#download-map-button'
    };

    var HomeView = View.extend({

        autoRender: true,

        className: 'home',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
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

        },

        configurePage: function () {

            //Activate the default food insecurity status on the map
            this.$mapformRadioBtns.filter('[value="' + Config.DEFAULT_IF_STATUS + '"]').prop("checked", true).change();
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


        onMapStatusChange: function (e) {

            this.setMapStatus($(e.currentTarget).val());
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

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }
    });

    return HomeView;
});
