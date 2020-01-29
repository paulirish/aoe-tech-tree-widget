(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class AdminClient {
    // going to wss
    // https://stackoverflow.com/questions/23404160/why-does-my-wss-websockets-over-ssl-tls-connection-immediately-disconnect-w
    constructor() {
        this.clientId = '';
        this.lastClickedCivs = [];
        this.socket = new WebSocket('wss://itsatreee.com:8443');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
        this.buildHtml();
    }
    buildHtml() {
        this.createClickableCivIcons();
    }
    showCiv(civName) {
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminShowCiv, civName));
    }
    hideCiv(civName) {
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminHideCiv, civName));
    }
    onOpen(event) {
        console.log('[open] Connection established');
    }
    onMessage(msg) {
        const message = JSON.parse(msg.data);
        console.log('event', message);
    }
    // need to handle cwhen clients close their conenction
    onClose(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        }
        else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }
    onError(event) {
        console.log(`[error] ${event.message}`);
    }
    formatDataForWebsocket(dataType, rawData) {
        const clientId = $('#txt-client-id').val();
        console.log('Formatting Data for websocket');
        console.log(`DataType: ${dataType} / RawData: ${rawData} / ClientId: ${clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: clientId });
    }
    createClickableCivIcons() {
        const divWrapper = $('<div id="civ-tech-icons"></div>').addClass('civ-tech-icons-wrapper');
        ["Aztecs", "Berbers", "Britons", "Bulgarians", "Burmese", "Byzantines",
            "Celts", "Chinese", "Cumans", "Ethiopians", "Franks", "Goths", "Huns",
            "Incas", "Indians", "Italians", "Japanese", "Khmer", "Koreans", "Lithuanians",
            "Magyars", "Malay", "Malians", "Mayans", "Mongols", "Persians", "Portuguese",
            "Saracens", "Slavs", "Spanish", "Tatars", "Teutons", "Turks",
            "Vietnamese", "Vikings"].forEach((civ) => {
            const civIcon = $(`<div id="civ-icon-clickable"><div id="civ-text" class="civ-text">${civ}</div></div>`).addClass(['civ-tech-icon', 'faded']);
            // emblem
            // https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/aztecs.png
            civIcon.css({
                'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-unique-units/${civ.toLowerCase()}.png`,
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
            });
            civIcon.hover(() => {
                civIcon.css({
                    'opacity': '1'
                });
            }, () => {
                if (!this.lastClickedCivs.includes(civ)) { // if we've clicked this civ, dont hide it yet
                    civIcon.css({
                        'opacity': '0.5'
                    });
                }
            });
            civIcon.click(() => {
                if (this.lastClickedCivs.includes(civ)) { // if we have clicked this civ before
                    this.hideCiv(civ);
                    this.lastClickedCivs = this.lastClickedCivs.filter((clickedCiv) => {
                        civIcon.addClass('faded');
                        civIcon.removeClass('not-faded');
                        return civ !== clickedCiv;
                    });
                }
                else {
                    this.showCiv(civ);
                    civIcon.removeClass('faded');
                    civIcon.addClass('not-faded');
                    this.lastClickedCivs.push(civ);
                }
            });
            divWrapper.append(civIcon);
        });
        $('body').append(divWrapper);
    }
}
exports.AdminClient = AdminClient;

},{"../enums":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_client_1 = require("./admin-client");
new admin_client_1.AdminClient();

},{"./admin-client":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEnums;
(function (SocketEnums) {
    SocketEnums[SocketEnums["ClientRegister"] = 0] = "ClientRegister";
    SocketEnums[SocketEnums["AdminShowCiv"] = 1] = "AdminShowCiv";
    SocketEnums[SocketEnums["AdminHideCiv"] = 2] = "AdminHideCiv";
})(SocketEnums = exports.SocketEnums || (exports.SocketEnums = {}));

},{}]},{},[2]);
