define("MainShell", /**SCHEMA_DEPS*/["@creatio-devkit/common", "css!CardSchemaViewModule", "css!MainShellCSS"]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/(sdk)/**SCHEMA_ARGS*/ {
    return {
        viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[

            {
                "operation": "insert",
                "name": "ChatGPTTab",
                "values": {
                    "type": "crt.TabContainer",
                    "tools": [],
                    "items": [],
                    "caption": "",
                    "title": "#ResourceString(ChatGPTTab_caption)#",
                    "iconPosition": "only-icon",
                    "visible": true,
                    "icon": "gear-button-icon",
                },
                "parentName": "CommunicationsPanelItemsTabPanel",
                "propertyName": "items",
                "index": 2
            },
            {
                "operation": "insert",
                "name": "ChatGPTTabTools",
                "values": {
                    "type": "crt.FlexContainer",
                    "direction": "row",
                    "alignItems": "center",
                    "items": []
                },
                "parentName": "ChatGPTTab",
                "propertyName": "tools",
                "index": 0
            },
            {
                "operation": "insert",
                "name": "ChatGPTTabLabel",
                "values": {
                    "type": "crt.Label",
                    "caption": "#ResourceString(ChatGPTPanel_Caption)#",
                    "labelType": "headline-3",
                    "labelThickness": "default",
                    "labelEllipsis": false,
                    "labelColor": "var(--crt-palette-foreground-500)",
                    "labelBackgroundColor": "transparent",
                    "labelTextAlign": "start"
                },
                "parentName": "ChatGPTTabTools",
                "propertyName": "items",
                "index": 0
            },
            {
                "operation": "insert",
                "name": "ChatGPTTabItems",
                "values": {
                    "type": "crt.FlexContainer",
                    "items": [],
                    "direction": "column",
                    "classes": [
                        "ts-cti-container"
                    ]
                },
                "parentName": "ChatGPTTab",
                "propertyName": "items",
                "index": 0
            },
            {
                "operation": "insert",
                "name": "ChatGPTModule",
                "values": {
                    "type": "crt.ModuleLoader",
                    "module": "OmniChatGPTPanelModule"
                },
                "parentName": "ChatGPTTabItems",
                "propertyName": "items",
                "index": 0
            },

        ]/**SCHEMA_VIEW_CONFIG_DIFF*/,
        viewModelConfig: /**SCHEMA_VIEW_MODEL_CONFIG*/{}/**SCHEMA_VIEW_MODEL_CONFIG*/,
        modelConfig: /**SCHEMA_MODEL_CONFIG*/{}/**SCHEMA_MODEL_CONFIG*/,
        handlers: /**SCHEMA_HANDLERS*/[]/**SCHEMA_HANDLERS*/,
        converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
        validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
    };
});