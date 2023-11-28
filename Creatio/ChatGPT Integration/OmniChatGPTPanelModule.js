define("OmniChatGPTPanelModule", [], function () {
    Ext.define("Terrasoft.configuration.OmniChatGPTPanelModule", {

        extend: "Terrasoft.BaseSchemaModule",
        alternateClassName: "Terrasoft.OmniChatGPTPanelModule",

        generateViewContainerId: false,

        initSchemaName: function () {
            this.schemaName = "OmniChatGPTPanelSchema";
        },

        initHistoryState: Terrasoft.emptyFn,

        init: function () {
            this.callParent(arguments);
            this.initMessages();
        },

        initMessages: function () {
            this.sandbox.subscribe("RerenderModule", function (config) {
                if (this.viewModel) {
                    this.render(this.Ext.get(config.renderTo));
                    return true;
                }
            }, this, [this.sandbox.id]);
        },

        createViewModel: function () {
            var viewModel = this.callParent(arguments);
            return viewModel;
        }

    });
    return Terrasoft.OmniChatGPTPanelModule;
});