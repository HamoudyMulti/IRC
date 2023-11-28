define("OmniChatGPTPanelSchema", ["ServiceHelper", "MaskHelper", "css!OmniChatGPTPanelCSS"], function (ServiceHelper, MaskHelper) {
    return {
        mixins: {
        },
        messages: {

        },
        attributes: {

            "UserPrompt": {
                "dataValueType": Terrasoft.DataValueType.LONG_TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": ""
            },
            "ErrorMessage": {
                "dataValueType": Terrasoft.DataValueType.LONG_TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": ""
            },
            "ChatGPTResultData": {
                "dataValueType": Terrasoft.DataValueType.LONG_TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": ""
            },
            "HasResultData": {
                "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": false
            },

            "PrettyResult": {
                "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": false
            },
            "HasError": {
                "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": false
            },
            "SendButtonCaption": {
                "dataValueType": Terrasoft.DataValueType.TEXT,
                "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                "value": "Send"
            },
            "SendButtonEnabled": {
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
            init: function () {
                this.callParent(arguments);
                Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE, this.onServerWebsocketMessage, this);

            },
            destroy: function () {

                this.callParent(arguments);
                clearTimeout(this.get("TimeoutId"));

            },
            onServerWebsocketMessage: function (scope, message) {

                if (message.Header.Sender == "OmniChatGPTMessage_Panel") {

                    result = message.Body;
                    clearTimeout(this.get("TimeoutId"));
                    this.sendToChatGPTCallback({ SendToChatGPTResult: result })
                    this.changeSendButtonState();


                }

            },

            changeSendButtonState: function () {

                var caption = this.get("SendButtonCaption");
                var state = this.get("SendButtonEnabled");
                if (state == true) {

                    this.set("SendButtonCaption", "Requesting...");
                    this.set("SendButtonEnabled", false)

                } else {

                    this.set("SendButtonCaption", "Send");
                    this.set("SendButtonEnabled", true)

                }

            },

            onRender: function () {

                console.log("panel rendered");
                this.callParent(arguments);

            },
            sendToChatGPT: function () {
                //var maskid = this.showBodyMask({selector:"[data-item-marker='OmniChatGPTPanelSchemaContainer']"});
                //MaskHelper.updateBodyMaskCaption(maskid, "Waiting for response")
                this.changeSendButtonState();
                var prompt = this.get("UserPrompt");
                var SysPrompt = "You are a business AI assistant.";
                if (Ext.isEmpty(prompt)) {

                    this.showInformationDialog("Empty message to ChatGPT");
                    return;

                }

                PrettyResult = this.get("PrettyResult");
                if (PrettyResult === true) {

                    SysPrompt = SysPrompt + "\nMark answers with HTML.";

                }

                ServiceHelper.callService({
                    serviceName: "OmniChatGPTIntegrationService",
                    methodName: "SendToChatGPTAsync",
                    timeout: 60000,
                    data: {
                        frontData: {
                            UserPrompt: prompt,
                            SystemPrompt: SysPrompt,
                            MessageSuffix: "_Panel"
                        }

                    },
                    //callback: this.sendToChatGPTCallback,
                    scope: this
                });
                this.set("HasError", false);
                this.set("ErrorMessage", "");

                var scope = this;
                var TimeoutId = setTimeout((function () {
                    if (scope.get("SendButtonEnabled") === false) {
                        scope.set("HasError", true);
                        scope.set("ErrorMessage", "ChatGPT prepared answer for too long. Please try again");
                        scope.changeSendButtonState();

                    }


                }), 100000);

                this.set("TimeoutId", TimeoutId);

            },
            removeLeadingsymbols: function (value) {



            },
            sendToChatGPTCallback: function (result) {

                var ContainerElement = document.querySelectorAll('#OmniChatGPTPanelSchemaChatGPTResultDataContainer')[0];
                if (ContainerElement === undefined) {

                    return;

                }
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
                    this.hideBodyMask({ selector: "[data-item-marker='OmniChatGPTPanelSchemaContainer']" });
                    return;
                }


                this.set("HasError", false);
                this.set("ErrorMessage", "");

                this.hideBodyMask({ selector: "[data-item-marker='OmniChatGPTPanelSchemaContainer']" });
                //this.set("ChatGPTResultData", result.SendToChatGPTResult);

                result.SendToChatGPTResult = result.SendToChatGPTResult.replace(/^\n+/g, '').replaceAll("\n", "<br>")
                ContainerElement.innerHTML = "<div id='ResultDataWrap'>" + result.SendToChatGPTResult + "</div>";
                this.set("HasResultData", true);

                //delete leading <br> tags
                var nonBRFound = false;
                var DataWrapElementData = document.getElementById("ResultDataWrap")
                while (!nonBRFound) {

                    var firstChild = DataWrapElementData.firstChild;
                    if (firstChild.tagName == "BR") {

                        firstChild.remove();

                    } else {

                        nonBRFound = true;

                    }

                }



            }
        },
        diff: [

            /*{
                "operation": "insert",
                "name": "AskAILabel",
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index":0,
                "values": {
                    "generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.LABEL,
                    "caption": "Ask anything to AI",
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column":0,
                        "row": 0,
                        //"layoutName": "Header"
                    },
                }
            },
            */
            {
                "operation": "insert",
                "name": "UserPrompt",
                "values": {
                    "bindTo": "UserPrompt",
                    "dataValueType": 29,
                    "contentType": 0,
                    "placeholder": "",
                    "controlConfig": {
                        "placeholder": "Ask anything to ChatGPT AI Assistant",
                        "classes": ["placeholderOpacity"]
                    },
                    "layout": {
                        "column": 0,
                        "row": 1,
                        "colSpan": 1,
                        "rowSpan": 4
                    },
                    "labelConfig": {
                        "visible": false
                    },

                },
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 0
            },
            {
                "operation": "insert",
                "name": "SendToChatGPTButton",
                "values": {
                    "itemType": 5,
                    "caption": { bindTo: "SendButtonCaption" },
                    "enabled": { bindTo: "SendButtonEnabled" },
                    "classes": {
                        "textClass": "actions-button-margin-right"
                    },
                    "click": {
                        "bindTo": "sendToChatGPT"
                    },
                    "style": "blue",
                    "tag": "send",
                    "markerValue": "SendToChatGPTButton",
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 1,
                        "column": 0,
                        "row": 3,
                        //"layoutName": "Header"
                    },
                },
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 1
            },
            {
                "operation": "insert",
                "name": "PrettyResult",
                "values": {
                    "bindTo": "PrettyResult",
                    "dataValueType": 12,
                    "contentType": 0,
                    "placeholder": "",

                    "layout": {
                        "column": 4,
                        "row": 1,
                        "colSpan": 1,
                        "rowSpan": 4
                    },
                    "labelConfig": {
                        "visible": true
                    },
                    "caption": "Polished"
                },
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 2
            },
            {
                "operation": "insert",
                "name": "ErrorMessage",
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 3,
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

            {
                "operation": "insert",
                "name": "AnswerLabel",
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 4,
                "values": {
                    "generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.LABEL,
                    "visible": { bindTo: "HasResultData" },
                    "caption": "ChatGPT answer",
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column": 0,
                        "row": 4,
                        //"layoutName": "Header"
                    },
                }
            },
            {
                "operation": "insert",
                "name": "ChatGPTResultData",
                "parentName": "EmptyContainer",
                "propertyName": "items",
                "index": 5,
                "values": {
                    //"generateId": "CDFS",
                    "itemType": Terrasoft.ViewItemType.CONTAINER,
                    //"caption": {bindTo:"ChatGPTResultData"},
                    //"visible":{bindTo:"HasResultData"},
                    "layout": {
                        "colSpan": 1,
                        "rowSpan": 5,
                        "column": 0,
                        "row": 5,
                        //"layoutName": "Header"
                    },
                }
            },
        ]
    };
});
