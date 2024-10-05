define("UsrFrameComponent", ["@creatio-devkit/common"], function (sdk) {
    class UsrFrameComponent extends HTMLElement {
        constructor() {
            super();
            this._dom = this.attachShadow({mode: 'open'});
        }
         
        get src() {
            return this._frameConfig.src;
        }
         
        set src(value) {
            this.frameConfig = {src: value};
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
                this._frameConfig.sandbox = "allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox";
            }
             
            this._loadFrame();
        }
         
        _loadFrame() {
            let frame = '<iframe src="' + this._frameConfig.src + '" style="' + this._frameConfig.style + '" sandbox="' + this._frameConfig.sandbox + '" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">';
            this._dom.innerHTML = frame;
        }
    }
     
    customElements.define("usr-frame-component", UsrFrameComponent);
    sdk.registerViewElement({
        type: "usr.FrameComponent",
        selector: "usr-frame-component",
        inputs: {
            frameConfig: {},
            src: {}
        }
    });
     
    return UsrFrameComponent;
});