define("MgsCompFrameComponent", ["@creatio-devkit/common"], function (sdk) {
    class MgsCompFrameComponent extends HTMLElement {
        constructor() {
            super();
            this._dom = this.attachShadow({ mode: 'open' });
        }

        get src() {
            return this._frameConfig.src;
        }

        set src(value) {
            this.frameConfig = { src: value };
        }

        get frameConfig() {
            return this._frameConfig;
        }

        set frameConfig(value) {
            this._frameConfig = value;

            this._frameConfig.src = this.frameConfig.src || "about:blank";
            this._frameConfig.height = this.frameConfig.height || "100%";
            this._frameConfig.width = this.frameConfig.width || "100%";

            this._frameConfig.style = "height:" + this.frameConfig.height + ";width:" + this.frameConfig.width + ";";
            if (!this.frameConfig.border) {
                this._frameConfig.style += "border:none;";
            }

            if (!this._frameConfig.sandbox) {
                this._frameConfig.sandbox = "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals";
            }

            this._loadFrame();
        }

        get objId() {
            return this._objId;
        }

        set objId(value) {
            this._objId = value;
            this._loadFrame(); // Reload the frame with the new objId attribute
        }

        _loadFrame() {
            const objId = this._objId ?? "";
            const srcUrl = objId ? `${this._frameConfig.src}?objId=${objId}` : 'about:blank';
            let frame = `<iframe id="content-server-iframe" src="${srcUrl}" style="${this._frameConfig.style}" sandbox="${this._frameConfig.sandbox}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            this._dom.innerHTML = frame;
        }
    }

    customElements.define("mgs-comp-frame-component", MgsCompFrameComponent);
    sdk.registerViewElement({
        type: "MgsComp.FrameComponent",
        selector: "mgs-comp-frame-component",
        inputs: {
            frameConfig: {},
            src: {},
            objId: {} // Registering objId as an additional input
        }
    });

    return MgsCompFrameComponent;
});
