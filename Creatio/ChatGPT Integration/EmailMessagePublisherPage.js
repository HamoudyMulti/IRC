define("EmailMessagePublisherPage", ["EmailMessagePublisherPageResources", "ModalBox"],
    function (resources, ModalBox) {
        return {
            entitySchemaName: "Activity",
            mixins: {

            },
            messages: {
                "ChatGPTResult": {
                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE
                },
                "GetEmailTheme": {

                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE

                },
                "ChatGPTGenerationStartEvent": {
                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE
                },
            },
            attributes: {

                "GenerateEmailChatGTPCaption": {
                    "dataValueType": Terrasoft.DataValueType.TEXT,
                    "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                    "value": resources.localizableStrings.GenerateEmailChatGTPCaption
                },
                "GenerateEmailChatGTPButtonEnabled": {
                    "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                    "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                    "value": true
                },
                "TimeoutId": {
                    "dataValueType": Terrasoft.DataValueType.CUSTOM_OBJECT,
                    "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                    "value": ""
                },

            },
            methods: {
                destroy: function () {

                    this.callParent(arguments);
                    clearTimeout(this.get("TimeoutId"));

                },
                changeSendButtonState: function () {

                    var caption = this.get("GenerateEmailChatGTPCaption");
                    var state = this.get("GenerateEmailChatGTPButtonEnabled");
                    if (state == true) {

                        this.set("GenerateEmailChatGTPCaption", "Generating...");
                        this.set("GenerateEmailChatGTPButtonEnabled", false)

                    } else {

                        this.set("GenerateEmailChatGTPCaption", "Generate text via ChatGPT");
                        this.set("GenerateEmailChatGTPButtonEnabled", true)

                    }

                },
                onRender: function () {
                    this.callParent(arguments);
                    this.sandbox.subscribe("ChatGPTResult", function (result) {
                        clearTimeout(this.get("TimeoutId"));
                        this.changeSendButtonState();
                        this.set("Body", result.resultText);
                    }, this, [this.sandbox.id]);

                    this.sandbox.subscribe("GetEmailTheme", function () {
                        return this.get("Title")
                    }, this, [this.sandbox.id]);

                    this.sandbox.subscribe("ChatGPTGenerationStartEvent", function () {
                        this.changeSendButtonState();
                        var scope = this;
                        var TimeoutId = setTimeout((function () {
                            if (scope.get("SendButtonEnabled") === false) {
                                scope.changeSendButtonState();
                                scope.showInformationDialog("ChatGPT prepared answer for too long. Please try again");

                            }
                        }), 100000);

                        this.set("TimeoutId", TimeoutId);
                    }, this, [this.sandbox.id]);

                },
                OpenChatGPTPromptConfigurator: function () {

                    var config = {
                        widthPixels: 500,
                        heightPixels: 300,
                    };
                    var moduleName = "OmniChatGPTPromptConfigurationModule";
                    var moduleId = this.sandbox.id + "_" + moduleName;
                    var renderTo = ModalBox.show(config, function () {
                        //this.sandbox.unloadModule(moduleId, renderTo);
                    }.bind(this));
                    this.sandbox.loadModule(moduleName, {
                        id: moduleId,
                        renderTo: renderTo
                    });

                    return;




                },

            },
            diff: /**SCHEMA_DIFF*/[


                {
                    "operation": "insert",
                    "name": "GenerateGPTButton",
                    "values": {
                        "itemType": 5,
                        "caption": { bindTo: "GenerateEmailChatGTPCaption" },//"Create meeting",
                        "enabled": { bindTo: "GenerateEmailChatGTPButtonEnabled" },
                        "classes": {
                            "textClass": "actions-button-margin-right"
                        },
                        "click": {
                            "bindTo": "OpenChatGPTPromptConfigurator"
                        },
                        "style": "transparent",
                        "tag": "meeting",
                        "markerValue": "GenerateGPTButton",
                        "layout": {
                            "colSpan": 12,
                            "rowSpan": 1,
                            "column": 15,
                            "row": 6,
                            "layoutName": "Header"
                        },
                    },
                    "parentName": "PublisherBottomContainer",
                    "propertyName": "items",
                    "index": 100
                },

            ]/**SCHEMA_DIFF*/
        };
    });
