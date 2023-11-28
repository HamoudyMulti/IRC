define("OmniChatGPTPromptConfigurationModule", ["ModalBox", "BaseSchemaModuleV2"],
    function (ModalBox) {
        Ext.define("Terrasoft.configuration.OmniChatGPTPromptConfigurationModule", {
            extend: "Terrasoft.BaseSchemaModule",
            alternateClassName: "Terrasoft.OmniChatGPTPromptConfigurationModule",
            /**
             * @inheritDoc Terrasoft.BaseSchemaModule#generateViewContainerId
             * @overridden
             */
            generateViewContainerId: false,
            /**
             * @inheritDoc Terrasoft.BaseSchemaModule#initSchemaName
             * @overridden
             */
            initSchemaName: function () {
                this.schemaName = "OmniChatGPTPromptConfigurationPage";
            },
            /**
             * @inheritDoc Terrasoft.BaseSchemaModule#initHistoryState
             * @overridden
             */
            initHistoryState: Terrasoft.emptyFn,
            createViewModel: function () {
                var viewModel = this.callParent(arguments);
                var parameters = this.parameters;
                if (parameters) {
                    //set parameters value
                }
                return viewModel;
            }
        });
        return Terrasoft.OmniChatGPTPromptConfigurationModule;
    });