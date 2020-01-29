"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AoE2Config {
    constructor() {
        this.civName = '';
        this.volume = 0.25;
        this.fadeOut = false;
        this.visibleDuration = 25; // use this value to show and hide in one action. this number determines how long it will be visible
        this.fadeInDuration = 2;
        this.fadeOutDuration = 2;
        this.clientId = 'tree';
        this.socketMode = false;
    }
    setConfigFromHash() {
        return this.setConfigFrom(window.location.hash.substring(1));
    }
    setConfigFromQueryString() {
        return this.setConfigFrom(window.location.search.substring(1));
    }
    setConfigFrom(string) {
        string.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(this, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            }
            else {
                Object.defineProperty(this, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return this;
    }
}
exports.AoE2Config = AoE2Config;
