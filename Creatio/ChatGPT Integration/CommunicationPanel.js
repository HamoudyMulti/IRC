define("CommunicationPanel", ["terrasoft", "CommunicationPanelHelper", "CtiBaseHelper", "ServiceHelper"],
    function (Terrasoft, CommunicationPanelHelper, CtiBaseHelper, ServiceHelper) {
        return {
            messages: {},
            attributes: {

                "ChatGPTPanelVisible": {
                    "dataValueType": Terrasoft.DataValueType.BOOLEAN,
                    "type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
                    "value": false
                },

            },
            methods: {
                init: function () {

                    this.callParent(arguments);

                    this._loadHiddenModule("OmniChatGPTPanelModule");

                    this.set("ChatGPTPanelVisible", true);



                },

            },
            diff: [
                {
                    "operation": "insert",
                    "index": 99,
                    "parentName": "communicationPanelContent",
                    "propertyName": "items",
                    "name": "OmniChatGPTPanel",
                    "values": {
                        "tag": "OmniChatGPTPanel",
                        "visible": { "bindTo": "ChatGPTPanelVisible" },
                        "imageConfig": { "bindTo": "getWHPanelImageConfig" },
                        //"caption": {"bindTo": "getWHPanelCaption"},
                        "wrapClass": [
                            "t-btn-style-transparent"
                        ],
                        "generator": "CommunicationPanelHelper.generateMenuItem"
                    }
                }
            ]
        };
    });
