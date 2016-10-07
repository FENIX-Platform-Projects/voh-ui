/*global define, _:false, amplify, $*/
define([
    'handlebars',
    'views/base/view',
    'config/Config',
    'config/Services',
    'text!templates/visualization/table.hbs',
    'text!templates/common/error.hbs',
    'text!templates/common/courtesy-message.hbs',
    'i18n!nls/labels',
    'fx-common/WDSClient',

    'pivot',
    'pivotRenderers',
    'pivotAggregators',
    'text!pivotDataTest',
    'pivotDataConfig',

    'underscore',
    'q',
    'jstree',
    'amplify'
//TODO REMOVE
], function (Handlebars, View, Config, Services, template, errorTemplate, courtesyMessageTemplate, i18nLabels, WDSClient,
             Pivot,
             pivotRenderers,
             pivotAggregators,
             pivotDataTest,
             pivotDataConfig,
             _) {

    'use strict';

    var s = {
        GO_BTN: "#table-go-btn",
        RESET_BTN: "#table-reset-btn",
        DOWNLOAD_BTN: "#table-download-btn",
        ERROR_HOLDER: ".error-holder",
        COURTESY_MESSAGE_HOLDER: ".courtesy-message-holder",
        FI_FORM: "#table-fi-form",
        VARIABLE_FORM: "#table-variables-form",
        RESULTS_CONTAINER: '#results-container',
        RESULT_SELECTOR: '.voh-result',
        CHART_CONTAINER: '[data-role="chart-container"]',
        TOTAL_CHECKBOX: "#checkbox-show-total",
        GEO_SELECTOR: "#geo-selector",
        GEO_GRANULARITY_FORM: "#geo-granularity-form",
        COURTESY : "[data-role='courtesy']"
    };

    var VisualizationView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'visualization-table',

        template: template,

        getTemplateData: function () {
            return i18nLabels;
        },

        initVariables: function () {

            this.$goBtn = this.$el.find(s.GO_BTN);
            this.$resetBtn = this.$el.find(s.RESET_BTN);
            this.$downloadBtn = this.$el.find(s.DOWNLOAD_BTN);
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

            this.WDSClient = new WDSClient({
                serviceUrl: Config.WDS_URL,
                datasource: Config.DB_NAME,
                outputType: Config.WDS_OUTPUT_TYPE
            });

            this.WDSClientOlap = new WDSClient({
                serviceUrl: Config.WDS_URL,
                datasource: Config.DB_NAME,
                outputType: Config.WDS_OUTPUT_TYPE
            });

            this.hideDownloadButton();

        },

        initGeoSelector: function (granularity) {

            //Init country selector
            var data = [];

            _.each(amplify.store.sessionStorage('cl_' + granularity), function (n) {

                var node = createNode(n);

                if (node.id) {
                    data.push(createNode(n));
                }

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
                "plugins": ["wholerow", "ui", "checkbox"]

            });

            this.$geoSelector.on("select_node.jstree", _.bind(function (e, data) {

                if (data.selected.length > Config.GEO_SELECTION_THRESHOLD) {
                    this.$geoSelector.jstree(true).deselect_node(data.node);
                }

            }, this));

            this.$geoSelector.on("ready.jstree", _.bind(function () {

                if (Config.DEFAULT_GEO_SELECTION && Array.isArray(Config.DEFAULT_GEO_SELECTION)) {
                    _.each(Config.DEFAULT_GEO_SELECTION, _.bind(function (g) {
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
            amplify.publish('voh.state.change', {menu: 'table'});

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

            this.$fiForm.find('[value="' + Config.DEFAULT_FI_STATUS + '"]').prop("checked", true).change();

            this.$variablesForm.find("input").attr('checked', false);
            if (Config.DEFAULT_VARIABLE_SELECTION && Array.isArray(Config.DEFAULT_VARIABLE_SELECTION)) {
                _.each(Config.DEFAULT_VARIABLE_SELECTION, function (v) {
                    self.$variablesForm.find('[value="' + v + '"]').prop("checked", true).change();
                });
            }

            this.$geoGranularityForm.find('[value="' + Config.DEFAULT_GEO_GRANULARITY + '"]').prop("checked", true).change();

            this.$showTotalCheckbox.prop("checked", Config.DEFAULT_SHOW_TOTAL).change();

            this.$geoSelector.jstree("uncheck_all");

        },

        /* Event binding and callback */

        bindEventListeners: function () {

            this.$goBtn.on('click', _.bind(this.onClickGoBtn, this));

            this.$resetBtn.on('click', _.bind(this.onClickResetBtn, this));

            this.$downloadBtn.on('click', _.bind(this.onClickDownloadBtn, this));

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

        onClickDownloadBtn : function () {

            exportToCsv( "VOH_export_" + new Date() + "".replace(/[^a-z0-9]/gi, '_').toLowerCase() +".csv", this.currentRequest.processdResponse)

            function exportToCsv(filename, rows) {
                var processRow = function (row) {
                    var finalVal = '';
                    for (var j = 0; j < row.length; j++) {
                        var innerValue = row[j] === null ? '' : row[j].toString();
                        if (row[j] instanceof Date) {
                            innerValue = row[j].toLocaleString();
                        };
                        var result = innerValue.replace(/"/g, '""');
                        if (result.search(/("|,|\n)/g) >= 0)
                            result = '"' + result + '"';
                        if (j > 0)
                            finalVal += ',';
                        finalVal += result;
                    }
                    return finalVal + '\n';
                };

                var csvFile = '';
                for (var i = 0; i < rows.length; i++) {
                    csvFile += processRow(rows[i]);
                }

                var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                if (navigator.msSaveBlob) { // IE 10+
                    navigator.msSaveBlob(blob, filename);
                } else {
                    var link = document.createElement("a");
                    if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        var url = URL.createObjectURL(blob);
                        link.setAttribute("href", url);
                        link.setAttribute("download", filename);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                }
            }

        },

        onClickResetBtn: function () {

            this.printDefaultSelection();

            this.resetResults();

            this.resetError();

            this.showCourtesyMessage();

            this.hideDownloadButton();

        },

        showCourtesyMessage : function () {

            this.$el.find(s.COURTESY).show();
        },

        hideCourtesyMessage : function () {

            this.$el.find(s.COURTESY).hide();
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
            this.$errorHolder.html(template({error: i18nLabels[errors[0]]}));
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

            this.WDSClientOlap.retrieve({
                payload: {
                    query: this.currentRequest.inputs.geo_granularity === 'country' ? Services.OLAP_COUNTRY : Services.OLAP_REGION,
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

            this.hideCourtesyMessage();

            this.currentRequest.response = response.shift();
            this.currentRequest.processdResponse = this.processResponse(response);

            this.unlockForm();

            if (this.currentRequest.response.length === 0) {
                this.printCourtesyMessage();
                this.hideDownloadButton();

            } else {
                this.showDownloadButton();
                this.initOlapCreator();
            }
        },

        showDownloadButton : function () {
            this.$downloadBtn.show();
        },

        hideDownloadButton : function () {
            this.$downloadBtn.hide();
        },

        /* Results rendering */

        processResponse: function (response) {

            var fields = ['geo', 'geo_label', 'variable', 'group_code', 'ms', 's'];

            response.unshift(fields);

            return response;
        },

        initOlapCreator: function () {

            var self = this;

            this.pivot = new Pivot();

            var pivotDataConf = $.extend(true, {}, pivotDataConfig);

            pivotDataConf.rendererDisplay = pivotRenderers;
            pivotDataConf.aggregatorDisplay = pivotAggregators;
            pivotDataConf.vals.push(this.currentRequest.inputs.status);
            pivotDataConf.derivedAttributes.group_code = function (row) {

                var cl_group_code = amplify.store.sessionStorage("cl_" + row.variable);
                if (cl_group_code) {
                    var obj = _.findWhere(cl_group_code, {code: row.group_code});
                    return obj ? obj.label : null;
                }

            };
            pivotDataConf.onDataLoaded = function () {
                //force label renaming
                //geo_label -> country or region
                $("#pivot1 span:contains(geo_label)").html(self.currentRequest.inputs.geo_granularity === 'country' ? "Country" : "Region");

                //population -> total
                $("#pivot1 span:contains(population)").html("Total");

                //group_code -> Group
                $("#pivot1 span:contains(group_code)").html("Group");

                //variable -> Variable
                $("#pivot1 span:contains(variable)").html("Variable");

            };

            this.pivot.render("pivot1", this.currentRequest.processdResponse, pivotDataConf);

        },

        resetResults: function () {

            //Destroy OLAP
            if (this.pivot && this.pivot.hasOwnProperty('destroy')) {
                this.pivot.destroy();
                $("#pivot1").empty();
            }
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

