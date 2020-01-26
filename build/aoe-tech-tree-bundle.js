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
class CivChanger {
    constructor(techData) {
        this.data = techData;
    }
    fadeIn(civName, htmlElement) {
        const civKey = this.data.civs[civName];
        const civDesc = this.data.key_value[civKey];
        htmlElement.find('.civ-name').text(civName);
        htmlElement.find('.civ-desc').html(civDesc);
        htmlElement.removeClass('fade-out');
        htmlElement.addClass('fade-in');
        // setTimeout(() => {
        //     this.fadeOut(htmlElement);
        // }, 10000);
    }
    fadeOut(htmlElement) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, 2500); // remove this div after the animation is done
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    addCivToBody(civName) {
        $('body').append(this.createHtmlElement(civName));
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}"></div>`).addClass(['div-background', 'mask-img']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        wrapperDiv.append($('<div></div>').addClass('civ-name'));
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        template.append(wrapperDiv);
        this.fadeIn(civName, template);
        return template;
    }
    getCivsHtmlElement() {
        const template = $('<select id="civSelector"></select>').addClass('civ-selector');
        Object.keys(this.data.civs).forEach((civName) => {
            template.append($(`<option value="${civName}">${civName}</option>`));
        });
        template.change(() => {
            this.civChanged();
        });
        return template;
    }
    civChanged() {
        const civName = $('#civSelector').val();
        if (civName && civName !== '') {
            this.addCivToBody(civName.toString());
        }
    }
}
exports.CivChanger = CivChanger;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_1 = require("./civ-changer");
const aoe2_api_1 = require("./aoe2-api");
const aoe2Api = new aoe2_api_1.AoE2Api();
let civChanger;
aoe2Api.getAoE2Data().then((data) => {
    civChanger = new civ_changer_1.CivChanger(data);
    $('body').append(civChanger.getCivsHtmlElement());
});

},{"./aoe2-api":1,"./civ-changer":2}]},{},[3]);
