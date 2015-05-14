/*global define, _:false, amplify, $*/
define([
    'handlebars',
    'views/base/view',
    'config/Config',
    'config/Services',
    'text!templates/visualization/scores.hbs',
    'text!templates/visualization/scores-result.hbs',
    'text!templates/common/error.hbs',
    'i18n!nls/visualization-scores',
    'i18n!nls/errors',
    'fx-common/WDSClient',
    'packery',
    'jqueryBridget',
    'q',
    'amplify'
], function (Handlebars, View, Config, Services, template, resultTemplate, errorTemplate, i18nLabels, i18Errors, WDSClient, Packery, bridget) {

    'use strict';

    var s = {
        GO_BTN: "#scores-go-btn",
        RESET_BTN: "#scores-reset-btn",
        ERROR_HOLDER: ".error-holder",
        FI_FORM: "#scores-fi-form",
        VARIABLE_FORM: "#scores-variables-form",
        RESULTS_CONTAINER: '#results-container',
        RESULT_SELECTOR: '.voh-result',
        CHART_CONTAINER: '[data-role="chart-container"]',
        TOTAL_CHECKBOX: "#checkbox-show-total"
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

            this.$showTotalCheckbox = this.$el.find(s.TOTAL_CHECKBOX);

            //results
            this.$resultsContainer = this.$el.find(s.RESULTS_CONTAINER);

            this.charts = [];
        },

        initComponents: function () {

            bridget('packery', Packery);

            this.$resultsContainer.packery({
                itemSelector: s.RESULT_SELECTOR,
                "percentPosition": true
            });

            this.WDSClient = new WDSClient({
                serviceUrl: Config.WDS_URL,
                datasource: Config.DB_NAME
            });

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

        initPage: function () {

            this.printDefaultSelection();
        },

        printDefaultSelection: function () {

            this.$fiForm.find('[value="' + Config.DEFAULT_FI_STATUS + '"]').prop("checked", true).change();
        },

        /* Event binding and callback */

        bindEventListeners: function () {

            this.$goBtn.on('click', _.bind(this.onClickGoBtn, this));
            this.$resetBtn.on('click', _.bind(this.onClickResetBtn, this));
        },

        onClickGoBtn: function () {

            var inputs = this.getInputs(),
                valid = this.validateInput(inputs);

            if (valid === true) {

                this.lockForm();

                this.resetError();

                this.resetResults();

                this.createRequest(inputs);

                this.search();

            } else {
                this.printError(valid);
            }
        },

        createRequest: function (inputs) {

            this.currentRequest = {
                inputs: inputs,
                processedInputs: prepareInputsForWds(inputs)
            };

            function prepareInputsForWds(inputs) {

                var result = {},
                    keys = Object.keys(inputs);

                _.each(keys, function (k) {
                    result[k] = Array.isArray(inputs[k]) ? processArray(inputs[k]) : inputs[k];
                });

                return result;
            }

            function processArray(input) {

                var result = '',
                    concat = "','";

                _.each(input, function (item) {
                    result += item + concat;
                });

                return result.substring(0, result.length - concat.length);
            }
        },

        onClickResetBtn: function () {

            this.printDefaultSelection();
        },

        /* Data request process */

        validateInput: function (inputs) {

            var errors = [];

            if (inputs.variables.length === 0) {
                errors.push('select_at_least_one_variable');
            }

            return (Object.keys(errors).length === 0) ? true : errors;
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

        getInputs: function () {

            var variables = [],
                showTotal = this.$showTotalCheckbox.is(':checked');

            $.each(this.$variablesForm.find("input[name='variable']:checked"), function () {
                variables.push($(this).val());
            });

            //Append total to variable if checked
            if (showTotal === true) {
                variables.push(this.$showTotalCheckbox.val());
            }

            return {
                status: this.$fiForm.find("input[name='status']:checked").val(),
                variables: variables,
                total: showTotal,
                //TODO
                country: ['3']
            };

        },

        search: function () {

            this.WDSClient.query({
                queryTmpl: Services.CHART_COUNTRY,
                queryVars: this.currentRequest.processedInputs,
                success: _.bind(this.onSearchSuccess, this),
                error: _.bind(this.onSearchError, this)
            });

        },

        onSearchError: function () {

            this.unlockForm();
            this.printError(['request_error']);
        },

        onSearchSuccess: function (response) {

            this.currentRequest.response = response;

            console.log(this.currentRequest)

            this.unlockForm();

            this.printResults();
        },

        /* Results rendering */

        printResults: function () {

            _.each(this.currentRequest.response, _.bind(function (row) {
                this.appendResult(this.processRowForResult(row));
            }, this));
        },

        setResultWidth: function ($template) {

            /* Add the 'w2' class to display the element with width:100%. Default width:50% */
            return (this.currentRequest.inputs.country.length > Config.COUNTRY_THRESHOLD ) ? $template.addClass('w2') : $template;
        },

        processRowForResult: function (row) {

            console.log(this.currentRequest)

            return row;
        },

        appendResult: function (model) {

            var $result = this.setResultWidth($(resultTemplate));

            // add to packery layout
            this.$resultsContainer.append($result).packery('appended', $result);

            this.renderChart(model, $result);
        },

        renderChart: function (model, $result) {

            // Chart Container
            this.charts.push("");

            $result.find(s.CHART_CONTAINER).html("Franc");
        },

        resetResults: function () {

            //Destroy charts
            _.each(this.charts, function (c) {

                if (c.hasOwnProperty('destroy')) {
                    c.destroy();
                }

            });
            this.charts = [];

            //Clear packery
            var $packeryItems = this.$resultsContainer.find(s.RESULT_SELECTOR);
            this.$resultsContainer.packery('remove', $packeryItems);
            this.$resultsContainer.packery();

        },

        /* Utils */

        resetError: function () {

            this.$errorHolder.empty();
        },

        /* Disposition */

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
