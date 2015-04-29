/*global define, _:false*/
define([
    'chaplin',
    'handlebars',
    'views/base/view',
    'config/Config',
    'text!templates/visualization/scores.hbs',
    'text!templates/common/error.hbs',
    'i18n!nls/visualization-scores',
    'i18n!nls/errors'
], function (Chaplin, Handlebars, View, Config, template, errorTemplate, i18nLabels, i18Errors) {

    'use strict';

    var s = {
        GO_BTN: "#scores-go-btn",
        RESET_BTN: "#scores-reset-btn",
        ERROR_HOLDER: ".error-holder",
        IF_FORM: "#scores-if-form",
        VARIABLE_FORM: "#scores-variables-form"
    };

    var VisualizationView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'visualization-scores',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        initVariables: function () {

            this.$goBtn = this.$el.find(s.GO_BTN);
            this.$resetBtn = this.$el.find(s.RESET_BTN);
            this.$errorHolder = this.$el.find(s.ERROR_HOLDER);

            //forms
            this.$ifForm = this.$el.find(s.IF_FORM);
            this.$variablesForm = this.$el.find(s.VARIABLE_FORM);

        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this.initVariables();

            this.bindEventListeners();

            this.initPage();
        },

        printDefaultSelection: function () {

            this.$ifForm.find('[value="'+Config.DEFAULT_IF_STATUS+'"]').prop("checked", true).change();
        },

        initPage: function () {

            this.printDefaultSelection();
        },

        bindEventListeners: function () {

            this.$goBtn.on('click', _.bind(this.onClickGoBtn, this));
            this.$resetBtn.on('click', _.bind(this.onClickResetBtn, this));
        },

        onClickGoBtn: function () {

            var inputs = this.getInputs(),
                valid = this.validateInput(inputs);

            if (valid === true) {
                this.lockForm();
                this.search(inputs);
            } else {
                this.printError(valid);
            }
        },

        validateInput: function (inputs) {
            //TODO inplement
            return true;
        },

        printError: function (errors) {

            var template = Handlebars.compile(errorTemplate);
            this.$errorHolder.html(template({error: i18Errors[errors[0]] }));
        },

        lockForm: function () {
            this.$goBtn.attr('disabled', 'disabled');
            this.$resetBtn.attr('disabled', 'disabled');
        },
        unlockForm: function () {
            this.$goBtn.removeAttr('disabled');
            this.$resetBtn.removeAttr('disabled');

        },

        resetError: function () {

            this.$errorHolder.empty();
        },

        getInputs: function () {
            return {};
        },

        search: function () {

           this.onSearchError();

        },

        onSearchError : function () {
            this.unlockForm();
            this.printError(['request_error']);
        },

        onSearchSuccess : function ( models ) {
            this.unlockForm();


        },

        onClickResetBtn: function () {
            alert("reset")
            this.printDefaultSelection();
        },

        unbindEventListeners: function () {

            this.$goBtn.off();
            this.$resetBtn.off();
        },

        dispose: function () {

            this.unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });

    return VisualizationView;
});
