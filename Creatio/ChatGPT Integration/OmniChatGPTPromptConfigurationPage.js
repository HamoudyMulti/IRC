define("OmniChatGPTPromptConfigurationPage", ["ModalBox", "MaskHelper", "GeneralDetails", "ServiceHelper", "BaseGridDetailV2Resources", "GridUtilities", "BaseGridRowViewModel", "css!OmniChatGPTPanelCSS"], function (ModalBox, MaskHelper, GeneralDetails, ServiceHelper) {
    return {
        attributes: {
            "Theme": {
                dataValueType: this.Terrasoft.DataValueType.TEXT,
                value: ""
            },
            "Theses": {
                dataValueType: this.Terrasoft.DataValueType.TEXT,
                value: ""
            },

            "Preview": {
                dataValueType: this.Terrasoft.DataValueType.TEXT,
                value: ""
            },
            "ErrorMessage": {
                "dataValueType": Terrasoft.DataValueType.LONG_TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": ""
            },
            "HasError": {
                "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": false
            },
            "SendButtonCaption": {
                "dataValueType": Terrasoft.DataValueType.TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": "Generate email text"
            },
            "SendButtonEnabled": {
                "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": true
            },

        },
        messages: {
            "GetEmailTheme": {
                mode: Terrasoft.MessageMode.PTP,
                direction: Terrasoft.MessageDirectionType.PUBLISH
            },
            "ChatGPTResult": {
                mode: Terrasoft.MessageMode.PTP,
                direction: Terrasoft.MessageDirectionType.PUBLISH
            },
            "ChatGPTGenerationStartEvent": {
                mode: Terrasoft.MessageMode.PTP,
                direction: Terrasoft.MessageDirectionType.PUBLISH
            },

        },
        details: {
        },
        methods: {

            onRender: function () {

                this.callParent(arguments);
                var parentSandboxId = this.sandbox.id.replaceAll("_OmniChatGPTPromptConfigurationModule", "");
                var Subject = this.sandbox.publish("GetEmailTheme", null, [parentSandboxId]);
                this.set("Theme", Subject);
                Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE, this.onServerWebsocketMessage, this);

            },
            onAbortButtonClick: function () {
                ModalBox.close();

            },

            onServerWebsocketMessage: function (scope, message) {

                if (message.Header.Sender == "OmniChatGPTMessage_EmailPromptConfigurator") {

                    result = message.Body;

                    this.sendToChatGPTCallback({ SendToChatGPTResult: result })
                    this.changeSendButtonState();


                }

            },

            changeSendButtonState: function () {

                var caption = this.get("SendButtonCaption");
                var state = this.get("SendButtonEnabled");
                if (state == true) {

                    this.set("SendButtonCaption", "Generating...");
                    this.set("SendButtonEnabled", false)

                } else {

                    this.set("SendButtonCaption", "Generate email text");
                    this.set("SendButtonEnabled", true)

                }

            },

            onGenerateButtonClick: function () {

                var PromptTemplate = "Generate email.\nTheme:[Theme]\nMain ideas:[Theses]";
                Prompt = PromptTemplate.replaceAll("[Theme]", this.get("Theme")).replaceAll("[Theses]", this.get("Theses"));
                var SysPrompt = "You are a business AI assistant. \nYou write only business emails.";
                this.changeSendButtonState();
                //var maskid = this.showBodyMask({selector:".ts-modalbox"});
                //MaskHelper.updateBodyMaskCaption(maskid, "Waiting for response")
                this.set("HasError", false);
                this.set("ErrorMessage", "");
                var parentSandboxId = this.sandbox.id.replaceAll("_OmniChatGPTPromptConfigurationModule", "");
                this.sandbox.publish("ChatGPTGenerationStartEvent", null, [parentSandboxId]);
                ServiceHelper.callService({
                    serviceName: "OmniChatGPTIntegrationService",
                    methodName: "SendToChatGPTAsync",
                    timeout: 60000,
                    data: {
                        frontData: {
                            UserPrompt: Prompt,
                            SystemPrompt: SysPrompt,
                            MessageSuffix: "_EmailPromptConfigurator"
                        }
                    },
                    //callback: this.sendToChatGPTCallback,
                    scope: this
                });



            },
            sendToChatGPTCallback: function (result) {

                if (result.SendToChatGPTResult.length === 3) {

                    this.set("HasError", true);
                    this.set("ErrorMessage", "Unknown error during request");
                    switch (result) {

                        case "429":
                            this.set("ErrorMessage", "ChatGPT system is overloaded. Please try again later");
                            break;
                        case "401":
                            this.set("ErrorMessage", "Can not authorize in ChatGPT system. Please contact your system administrator");
                            break;
                        case "403":
                            this.set("ErrorMessage", "ChatGPT access is forbidden. Pleas contact your system administrator");
                            break;
                        case "400":
                            this.set("ErrorMessage", "Request error has occured. Maybe, request message is too long");
                            break;

                    }
                    //this.hideBodyMask({selector:".ts-modalbox"});
                    return;
                }


                this.set("HasError", false);
                this.set("ErrorMessage", "");

                var parentSandboxId = this.sandbox.id.replaceAll("_OmniChatGPTPromptConfigurationModule", "");
                result.SendToChatGPTResult = result.SendToChatGPTResult.replace(/^\n+/g, '').replaceAll("\n", "<br>");
                this.sandbox.publish("ChatGPTResult", { resultText: result.SendToChatGPTResult }, [parentSandboxId]);
                this.hideBodyMask({ selector: ".ts-modalbox" });
                //ModalBox.close();



            },
            init: function () {
                this.callParent(arguments);
            },

        },
        diff: [
            {
                "operation": "insert",
                "name": "MainModalContainer",
                "propertyName": "items",
                "values": {
                    "itemType": Terrasoft.ViewItemType.CONTAINER,
                    "items": []
                }
            },
            {
                "operation": "insert",
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "name": "MainModalContainerGrid",
                "values": {
                    "itemType": Terrasoft.ViewItemType.GRID_LAYOUT,
                    "items": []
                },
                "index": 1
            },
            {
                "operation": "insert",
                "name": "ThemeLabel",
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "index": 1,
                "values": {
                    "generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.LABEL,
                    "caption": "Email subject:",
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column": 0,
                        "row": 0,
                        //"layoutName": "Header"
                    },
                }
            },
            {
                "operation": "insert",
                "name": "Theme",
                "values": {
                    "bindTo": "Theme",
                    "dataValueType": 29,
                    "contentType": 0,
                    //"placeholder":"Ask anything to AI",
                    //"label":"Theme",
                    "layout": {
                        "column": 0,
                        "row": 0,
                        "colSpan": 24,
                        "rowSpan": 2
                    },
                    "labelConfig": {
                        "visible": false
                    },

                },
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "index": 2
            },
            {
                "operation": "insert",
                "name": "ThesesLabel",
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "index": 3,
                "values": {
                    "generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.LABEL,
                    "caption": "Main topics list:",

                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column": 0,
                        "row": 0,
                        //"layoutName": "Header"
                    },
                }
            },
            {
                "operation": "insert",
                "name": "Theses",
                "values": {
                    "bindTo": "Theses",
                    "dataValueType": 29,
                    "contentType": 0,
                    //"placeholder":"Ask anything to AI",
                    //"label":"Theses",
                    "controlConfig": {
                        "placeholder": "1. Topic one\n2. Topic two\n3. Topic three",
                        "classes": ["placeholderOpacity"]
                    },
                    "layout": {
                        "column": 0,
                        "row": 3,
                        "colSpan": 24,
                        "rowSpan": 2
                    },
                    "labelConfig": {
                        "visible": false
                    },

                },
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "index": 4
            },

            {
                "operation": "insert",
                "parentName": "MainModalContainer",
                "name": "AbortButton",
                "propertyName": "items",
                "values": {
                    "itemType": Terrasoft.ViewItemType.BUTTON,
                    "style": Terrasoft.controls.ButtonEnums.style.BLUE,
                    "click": { bindTo: "onAbortButtonClick" },
                    "markerValue": "CloseButton",
                    "caption": "Close",
                    "layout": { "column": 0, "row": 0, "colSpan": 24 }
                },
                index: 0
            },
            {
                "operation": "insert",
                "parentName": "MainModalContainer",
                "name": "GenerateButton",
                "propertyName": "items",
                "values": {
                    "itemType": Terrasoft.ViewItemType.BUTTON,
                    "click": { bindTo: "onGenerateButtonClick" },
                    "markerValue": "CloseButton",
                    "style": "green",
                    "caption": { bindTo: "SendButtonCaption" },
                    "enabled": { bindTo: "SendButtonEnabled" },
                    "layout": { "column": 0, "row": 0, "colSpan": 24 }
                },
                index: 5
            },
            {
                "operation": "insert",
                "name": "ErrorMessage",
                "parentName": "MainModalContainer",
                "propertyName": "items",
                "index": 6,
                "values": {
                    "generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.LABEL,
                    "caption": { bindTo: "ErrorMessage" },
                    "visible": { bindTo: "HasError" },
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column": 0,
                        "row": 0,
                        //"layoutName": "Header"
                    },
                }
            },
        ]
    };
});