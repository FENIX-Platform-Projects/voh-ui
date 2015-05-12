/*global define, _:false, amplify, $*/
define([
    'handlebars',
    'views/base/view',
    'config/Config',
    'text!templates/visualization/scores.hbs',
    'text!templates/visualization/scores-result.hbs',
    'text!templates/common/error.hbs',
    'i18n!nls/visualization-scores',
    'i18n!nls/errors',
    'packery',
    'jqueryBridget',
    'amplify'
], function ( Handlebars, View, Config, template, resultTemplate, errorTemplate, i18nLabels, i18Errors, Packery, bridget) {

    'use strict';

    var s = {
        GO_BTN: "#scores-go-btn",
        RESET_BTN: "#scores-reset-btn",
        ERROR_HOLDER: ".error-holder",
        FI_FORM: "#scores-if-form",
        VARIABLE_FORM: "#scores-variables-form",
        RESULTS_CONTAINER: '#results-container',
        RESULT_SELECTOR: '.voh-result'
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
            this.$fiForm = this.$el.find(s.FI_FORM);
            this.$variablesForm = this.$el.find(s.VARIABLE_FORM);

            //results
            this.$resultsContainer = this.$el.find(s.RESULTS_CONTAINER);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish('voh.state.change', {menu: 'scores'});

            this.initVariables();

            this.bindEventListeners();

            this.initComponents();

            this.initPage();
        },

        printDefaultSelection: function () {

            this.$fiForm.find('[value="' + Config.DEFAULT_IF_STATUS + '"]').prop("checked", true).change();
        },

        initComponents: function () {

            bridget( 'packery', Packery );

            this.$resultsContainer.packery({
                itemSelector: s.RESULT_SELECTOR,
                "percentPosition": true
            });
        },

        appendResult : function ( model ) {

            var $result = $(resultTemplate);

            // add to packery layout
            this.$resultsContainer.append( $result ).packery( 'appended', $result );

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
            this.$errorHolder.html(template({error: i18Errors[errors[0]]}));
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

        onSearchError: function () {
            this.unlockForm();
            this.printError(['request_error']);
        },

        onSearchSuccess: function (models) {
            this.unlockForm();


        },

        onClickResetBtn: function () {

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
