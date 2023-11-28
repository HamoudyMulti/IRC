define("EmailPageV2", ["EmailPageV2Resources", "ModalBox", "ServiceHelper", "sandbox"],
    function (resources, ModalBox, ServiceHelper, sandbox) {
        return {
            messages: {

                "ChatGPTResult": {
                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE
                },
                "ChatGPTGenerationStartEvent": {
                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE
                },
                "GetEmailTheme": {

                    mode: Terrasoft.MessageMode.PTP,
                    direction: Terrasoft.MessageDirectionType.SUBSCRIBE

                }

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
                "Resources": {
                    dataValueType: this.Terrasoft.DataValueType.CUSTOM_OBJECT,
                    value: resources
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
                onEntityInitialized: function () {
                    this.callParent(arguments);
                    this.sandbox.subscribe("ChatGPTResult", function (result) {
                        clearTimeout(this.get("TimeoutId"));
                        this.changeSendButtonState();
                        this.set("Body", result.resultText + this.get("Body"));
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

                    Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE, this.onServerWebsocketMessage, this);

                },
                onServerWebsocketMessage: function (scope, message) {
                    /*if(this.get("CatchGPTEvents")===true){
                        if(message.Header.Sender == "OmniChatGPTMessage"){
    
                            this.set("Body", message.Body+this.get("Body"));
    
    
                        }
                        
                    }*/


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
                    return this.set("CatchGPTEvents", false)
                    return;



                },


            },
            details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
            modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
            dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
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
                        "style": "blue",
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
                    "parentName": "LeftContainer",
                    "propertyName": "items",
                    "index": 100
                },

            ]/**SCHEMA_DIFF*/
        };
    });
