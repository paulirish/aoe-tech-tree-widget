(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AoE2Api {
    constructor() { }
    getAoE2Data() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch('https://aoe2techtree.net/data/data.json').then((response) => __awaiter(this, void 0, void 0, function* () {
                return yield response.json();
            }));
        });
    }
}
exports.AoE2Api = AoE2Api;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AoE2Config {
    constructor() {
        this.civName = '';
        this.fadeOut = false;
        this.visibleDuration = 25; // use this value to show and hide in one action. this number determines how long it will be visible
        this.fadeInDuration = 2;
        this.fadeOutDuration = 2.5;
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CivChanger {
    constructor(techData, aoe2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
    }
    addCivToBody(civName) {
        $('body').append(this.createHtmlElement(civName));
    }
    listenForUrlChanges() {
        this.aoe2Config.setConfigFromHash();
        if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
            this.addCivToBody(this.aoe2Config.civName);
        }
        $(window).bind('hashchange', (event) => {
            const oldConfig = this.aoe2Config;
            // url changed!
            this.aoe2Config = this.aoe2Config.setConfigFromHash();
            if (oldConfig.civName === this.aoe2Config.civName) {
                //civ didnt change so we probably want to fade out
                if (this.aoe2Config.fadeOut) {
                    this.fadeOut($(`#${this.aoe2Config.civName}`));
                }
            }
            else {
                // new civ so we probably want to show it
                if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
                    this.addCivToBody(this.aoe2Config.civName);
                }
            }
        });
    }
    fadeIn(civName, htmlElement) {
        const civKey = this.data.civs[civName];
        const civDesc = this.data.key_value[civKey];
        htmlElement.find('.civ-name').text(civName);
        htmlElement.find('.civ-desc').html(civDesc);
        htmlElement.removeClass('fade-out');
        htmlElement.addClass('fade-in');
        if (this.aoe2Config.visibleDuration) {
            setTimeout(() => {
                this.fadeOut(htmlElement);
            }, this.aoe2Config.visibleDuration * 1000);
        }
    }
    fadeOut(htmlElement) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}"></div>`).addClass(['div-background', 'mask-img']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        const audio = $(`<audio autoplay id="myaudio"><source src="file:///E:/workspace/streaming-tools/aoe/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        // const source = $(`<source src="file:///E:/workspace/streaming-tools/aoe/aoe-tech-tree-widget/build/sounds/${civName}.mp3></source>`);
        // audio.append(source);
        wrapperDiv.append(audio);
        wrapperDiv.find('#myaudio')[0].volume = 0.05;
        wrapperDiv.append($('<div></div>').addClass('civ-name'));
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        template.append(wrapperDiv);
        this.fadeIn(civName, template);
        return template;
    }
}
exports.CivChanger = CivChanger;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_1 = require("./civ-changer");
const aoe2_api_1 = require("./aoe2-api");
const aoe2_config_1 = require("./aoe2-config");
let civChanger;
const aoe2Api = new aoe2_api_1.AoE2Api();
const aoe2Config = new aoe2_config_1.AoE2Config();
aoe2Api.getAoE2Data().then((data) => {
    civChanger = new civ_changer_1.CivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
});

},{"./aoe2-api":1,"./aoe2-config":2,"./civ-changer":3}]},{},[4]);
