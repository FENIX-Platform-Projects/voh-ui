/*global define, _:false, amplify, $*/
define([
    'handlebars',
    'views/base/view',
    'config/Config',
    'config/Services',
    'text!templates/visualization/scores.hbs',
    'text!templates/visualization/scores-result.hbs',
    'text!templates/common/error.hbs',
    'text!templates/common/courtesy-message.hbs',
    'i18n!nls/visualization-scores',
    'i18n!nls/errors',
    'fx-common/WDSClient',
    'fx-c-c/start',
    'packery',
    'jqueryBridget',
    'q',
    'jstree',
    'amplify'
], function (Handlebars, View, C, Services, template, resultTemplate, errorTemplate, courtesyMessageTemplate, i18nLabels, i18Errors, WDSClient, ChartCreator, Packery, bridget) {

    'use strict';

    var s = {
        GO_BTN: "#scores-go-btn",
        RESET_BTN: "#scores-reset-btn",
        ERROR_HOLDER: ".error-holder",
        COURTESY_MESSAGE_HOLDER: ".courtesy-message-holder",
        FI_FORM: "#scores-fi-form",
        VARIABLE_FORM: "#scores-variables-form",
        RESULTS_CONTAINER: '#results-container',
        RESULT_SELECTOR: '.voh-result',
        CHART_CONTAINER: '[data-role="chart-container"]',
        TOTAL_CHECKBOX: "#checkbox-show-total",
        GEO_SELECTOR: "#geo-selector",
        GEO_GRANULARITY_FORM: "#geo-granularity-form"
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
            this.$courtesyMessageHolder = this.$el.find(s.COURTESY_MESSAGE_HOLDER);

            //forms
            this.$fiForm = this.$el.find(s.FI_FORM);
            this.$variablesForm = this.$el.find(s.VARIABLE_FORM);
            this.$geoGranularityForm = this.$el.find(s.GEO_GRANULARITY_FORM);

            this.$showTotalCheckbox = this.$el.find(s.TOTAL_CHECKBOX);

            this.$geoSelector = this.$el.find(s.GEO_SELECTOR);

            //results
            this.$resultsContainer = this.$el.find(s.RESULTS_CONTAINER);

            this.charts = [];

            //Codelists
            this.cachedCodelist = [];

            this.codelists_conf = {
                cl_marital: Services.CL_MARITAL,
                cl_age: Services.CL_AGE,
                cl_education: Services.CL_EDUCATION,
                cl_location: Services.CL_LOCATION,
                cl_income: Services.CL_INCOME,
                cl_gender: Services.CL_GENDER,
                cl_country: Services.CL_COUNTRY,
                cl_region: Services.CL_REGION
            };

            this.codelists = Object.keys(this.codelists_conf);
        },

        initComponents: function () {

            bridget('packery', Packery);

            this.$resultsContainer.packery({
                itemSelector: s.RESULT_SELECTOR,
                transitionDuration: 0
            });

            this.WDSClient = new WDSClient({
                //serviceUrl: C.WDS_URL,
                datasource: C.DB_NAME,
                outputType: C.WDS_OUTPUT_TYPE
            });

        },

        initGeoSelector: function (granularity) {

            //Init country selector
            var data = [];

            _.each(amplify.store.sessionStorage('cl_' + granularity), function (n) {
                data.push(createNode(n));
            });

            //Clear jsTree
            this.$geoSelector.jstree('destroy');
            this.$geoSelector.empty();

            this.$geoSelector.jstree({
                "core": {
                    "multiple": true,
                    "animation": 0,
                    "themes": {"stripes": true},
                    'data': data
                },
                "plugins": ["wholerow",  "checkbox"]

            });

            this.$geoSelector.on("select_node.jstree", _.bind(function (e, data) {

                if (data.selected.length > C.GEO_SELECTION_THRESHOLD) {
                    this.$geoSelector.jstree(true).deselect_node(data.node);
                }

            }, this));

            this.$geoSelector.on("ready.jstree", _.bind(function () {

                if (C.DEFAULT_GEO_SELECTION && Array.isArray(C.DEFAULT_GEO_SELECTION)) {
                    _.each(C.DEFAULT_GEO_SELECTION, _.bind(function (g) {
                        this.$geoSelector.jstree(true).select_node(g);
                    }, this));
                }
            }, this));

            function createNode(item) {

                // Expected format of the node (there are no required fields)
                var config = {
                    id: item.code, // will be autogenerated if omitted
                    text: item.label // node text
                    //icon: "string", // string for custom
                    /* state: {
                     opened: boolean,  // is the node open
                     disabled: boolean,  // is the node disabled
                     selected: boolean  // is the node selected
                     },*/
                    //children    : [],  // array of strings or objects
                    //li_attr: {},  // attributes for the generated LI node
                    //a_attr: {}  // attributes for the generated A node
                };

                return config;
            }
        },

        preloadResources: function () {

            _.each(this.codelists, _.bind(function (cd) {

                //Check if codelist is cached otherwise query
                var stored = amplify.store.sessionStorage(cd);

                if (stored === undefined) {

                    this.WDSClient.retrieve({
                        payload: {query : this.codelists_conf[cd]},
                        outputType: "object",
                        success: _.bind(this.onPreloadCodelistSuccess, this, cd),
                        error: _.bind(this.onPreloadCodelistError, this)
                    });

                } else {
                    this.onCodelistCached(cd);
                }

            }, this));

        },

        onCodelistCached: function (codelist) {

            this.cachedCodelist.push(codelist);

            if (this.cachedCodelist.length === this.codelists.length) {

                this.ready = true;

                this.onReady();
            }

        },

        onPreloadCodelistError: function () {

            this.printError(["preload_resources_error"]);
        },

        onPreloadCodelistSuccess: function (cd, response) {

            amplify.store.sessionStorage(cd, response);

            this.onCodelistCached(cd);
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            //update State
            amplify.publish('voh.state.change', {menu: 'scores'});

            this.initVariables();

            this.bindEventListeners();

            this.initComponents();

            this.preloadResources();

        },

        onReady: function () {

            this.initPage();

            this.unlockForm();
        },

        initPage: function () {

            this.printDefaultSelection();
        },

        printDefaultSelection: function () {

            var self = this;

            this.$fiForm.find('[value="' + C.DEFAULT_FI_STATUS + '"]').prop("checked", true).change();

            this.$variablesForm.find("input").attr('checked', false);
            if (C.DEFAULT_VARIABLE_SELECTION && Array.isArray(C.DEFAULT_VARIABLE_SELECTION)) {
                _.each(C.DEFAULT_VARIABLE_SELECTION, function (v) {
                    self.$variablesForm.find('[value="' + v + '"]').prop("checked", true).change();
                });
            }

            this.$geoGranularityForm.find('[value="' + C.DEFAULT_GEO_GRANULARITY + '"]').prop("checked", true).change();

            this.$showTotalCheckbox.prop("checked",  C.DEFAULT_SHOW_TOTAL).change();

            this.$geoSelector.jstree("uncheck_all");

        },

        /* Event binding and callback */

        bindEventListeners: function () {

            this.$goBtn.on('click', _.bind(this.onClickGoBtn, this));

            this.$resetBtn.on('click', _.bind(this.onClickResetBtn, this));

            this.$geoGranularityForm.find("input").on('change', _.bind(this.onGeoGranularityChange, this));
        },

        onGeoGranularityChange: function (e) {
            this.initGeoSelector($(e.currentTarget).val());
        },

        onClickGoBtn: function () {

            var inputs = this.getInputs(),
                valid = this.validateInput(inputs);

            if (valid === true) {

                this.lockForm();

                this.resetError();

                this.resetCourtesyMessage();

                this.resetResults();

                this.createRequest(inputs);

                this.search();

            } else {

                this.printError(valid);
            }
        },

        onClickResetBtn: function () {

            this.printDefaultSelection();

            this.resetResults();

            this.resetError();
        },

        /* Data request process */

        validateInput: function (inputs) {

            var errors = [];

            if (inputs.variables.length === 0) {
                errors.push('select_at_least_one_variable');
            }

            if (inputs.geo.length === 0) {
                errors.push('select_at_least_one_geo');
            }

            return (Object.keys(errors).length === 0) ? true : errors;
        },

        printError: function (errors) {

            var template = Handlebars.compile(errorTemplate);
            this.$errorHolder.html(template({error: i18Errors[errors[0]]}));
        },

        printCourtesyMessage: function () {

            var template = Handlebars.compile(courtesyMessageTemplate);
            this.$courtesyMessageHolder.html(template(i18nLabels));
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
                query_variables,
                showTotal = this.$showTotalCheckbox.is(':checked'),
                geo = this.$geoSelector.jstree(true).get_selected();

            $.each(this.$variablesForm.find("input[name='variable']:checked"), function () {
                variables.push($(this).val());
            });

            //clone array
            query_variables = variables.slice(0);

            //Append total to variable if checked
            if (showTotal === true) {
                query_variables.push(this.$showTotalCheckbox.val());
            }

            return {
                status: this.$fiForm.find("input[name='status']:checked").val(),
                variables: variables,
                query_variables: query_variables,
                total: showTotal,
                geo_granularity: this.$geoGranularityForm.find("input[name='geo-granularity']:checked").val(),
                geo: geo,
                query_geo: geo.slice(0)
            };

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

        search: function () {

            this.WDSClient.retrieve({
                payload: {
                    query: this.currentRequest.inputs.geo_granularity === 'country' ? Services.CHART_COUNTRY : Services.CHART_REGION,
                    queryVars: this.currentRequest.processedInputs
                },
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

            this.unlockForm();

            if (this.currentRequest.response.length === 0) {
                this.printCourtesyMessage();
            } else {
                this.renderResults();
            }
        },

        /* Results rendering */

        addTotalToResponse: function (response) {

            var processedResponse = response.slice(0) || [];

            if ( this.currentRequest.inputs.total === true ){

                var geos = this.currentRequest.inputs.geo,
                    variables = this.currentRequest.inputs.variables;

                _.each(geos, _.bind(function ( g ) {

                    var obj = _.find(processedResponse, function ( row ) {

                        return row[C.INDEX_GEO_CODE] === g && row[C.INDEX_VARIABLE_CODE] === "population"
                    });

                    _.each(variables, _.bind(function ( v ) {

                        var addMe = obj.slice(0);

                        addMe[C.INDEX_VARIABLE_CODE] = v;
                        addMe[C.INDEX_GROUP_CODE]  = "population";

                        processedResponse.push(addMe);

                    }, this));

                    processedResponse = _.without(processedResponse, obj);

                }, this));

            }

            return processedResponse;
        },

        renderResults: function () {

            this.currentRequest.processdResponse = this.addTotalToResponse(this.currentRequest.response);

            this.currentRequest.chartModels = {};

            //Print a number of results equals to the selected variables
            _.each(this.currentRequest.inputs.variables, _.bind(function (v) {

                this.currentRequest.chartModels[v] = this.createChartModel(v);

            }, this));

            this.renderCharts();

        },

        createChartModel: function (v) {

            var cd = amplify.store.sessionStorage('cl_' + v);

            //filter response by variable
            var model = _.filter(this.currentRequest.processdResponse, function ( row ) {
                return row[C.INDEX_VARIABLE_CODE] == v;
            });

            // add variable label and group_code label

            _.each(model, function(row){

                var groupCode = row[C.INDEX_GROUP_CODE],
                    label;

                label = groupCode === "population" ? "Population" : _.findWhere(cd, {code: groupCode}).label;

                // group_code label
                row[C.INDEX_GROUP_LABEL] = label;
                //variable label
                row[C.INDEX_VARIABLE_LABEL] = i18nLabels["var_" + v];

            }, this);

            return model;

        },

        renderCharts: function () {

            for (var variable in this.currentRequest.chartModels) {
                if (this.currentRequest.chartModels.hasOwnProperty(variable)) {
                    this.appendResult(variable, this.currentRequest.chartModels[variable]);
                }
            }

        },

        appendResult: function (variable, model) {

            var $result = this.setResultWidth($(resultTemplate));

            // add to packery layout
            this.$resultsContainer.append($result).packery('appended', $result);

            this.renderChart($result, variable, model);
        },

        setResultWidth: function ($template) {
            /* Add the 'w2' class to display the element with width:100%. Default width:50% */

            if (this.currentRequest.inputs.variables.length > 1) {
                return (this.currentRequest.inputs.geo.length > C.GEO_LAYOUT_THRESHOLD ) ? $template.addClass('w2') : $template;
            } else {
                return $template.addClass('w2');
            }

        },

        renderChart: function ($result, variable, model) {

            var chartCreator = new ChartCreator(),
                valueIndex = this.currentRequest.inputs.status.toLowerCase() === 's' ? C.INDEX_STATUS_S : C.INDEX_STATUS_MS;

            $.when(chartCreator.init({
                model: _.sortBy(model, function(row) { return row[C.INDEX_GROUP_CODE]; }),
                adapter: {
                    // used in init just for MATRIX and FENIX
                    //xOrder: 'asc',
                    xDimensions: [C.INDEX_GROUP_LABEL],
                    yDimensions: [C.INDEX_VARIABLE_LABEL],
                    valueDimensions: valueIndex,
                    seriesDimensions: [C.INDEX_GEO_LABEL]

                }
            })).then(function(creator) {

                var o = {
                    container: $result.find(s.CHART_CONTAINER),
                    template: {
                        labels : {
                            title : i18nLabels["var_" + variable]
                        }
                    },
                    creator: {
                        chartObj: {
                            chart: {
                                type: "column"
                            }
                        }
                    }
                };

                creator.render(o);
            });

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

        resetCourtesyMessage: function () {

            this.$courtesyMessageHolder.empty();
        },

        /* Disposition */

        unbindEventListeners: function () {
            this.$goBtn.off();
            this.$resetBtn.off();

            //Components disposition
            this.$geoSelector.jstree('destroy');
        },

        dispose: function () {

            this.resetResults();

            this.resetCourtesyMessage();

            this.unbindEventListeners();

            View.prototype.dispose.call(this, arguments);
        }

    });

    return VisualizationView;
});
