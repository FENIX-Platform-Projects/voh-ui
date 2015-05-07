/*global define, _:false, $*/
define([
    'views/base/view',
    'text!templates/standards/standards.hbs',
    'text!templates/standards/download_item.hbs',
    'i18n!nls/standards',
    'handlebars',
    'text!json/standards/downloads.json'
], function (View, template, itemTemplate, i18nLabels, Handlebars, downloadModels) {

    'use strict';

    var s = {
        standards_LIST: "#standards-list"
    };

    var StandardsView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'standards',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.initVariables();
            this.initComponents();
            this.bindEventListeners();
            this.configurePage();
        },

        initVariables: function () {

            this.$standardsList = this.$el.find(s.standards_LIST);
        },

        initComponents: function () {
            this.initDownloadList();
        },


        initDownloadList: function () {

            _.each(JSON.parse(downloadModels), _.bind(this.printDownloads, this));
        },

        printDownloads : function (d) {

            var template = Handlebars.compile(itemTemplate);
            this.$standardsList.append(template(d));
        },

        bindEventListeners: function () {
        },

        configurePage: function () {
        },

        unbindEventListeners: function () {

        },

        dispose: function () {

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }


    });

    return StandardsView;
});
