(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class AdminClient {
    constructor() {
        this.clientId = '';
        this.config = {};
        this.lastClickedCivs = [];
        this.socket = new WebSocket('wss://itsatreee.com:8443');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
        this.setConfigFromQueryString();
        this.buildHtml();
    }
    setConfigFromQueryString() {
        this.config = this.setConfigFrom(window.location.search.substring(1));
    }
    setConfigFrom(string) {
        const object = {};
        string.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(object, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            }
            else {
                Object.defineProperty(object, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return object;
    }
    buildHtml() {
        this.createClickableCivIcons();
        this.attachTogglesToListeners();
        this.initializeClearAllButton();
        this.setToggleValue(enums_1.OverlayEnums.Tech, true);
        this.setToggleValue(enums_1.OverlayEnums.Sound, true);
    }
    sendSocketCommand(socketEnum, data) {
        this.socket.send(this.formatDataForWebsocket(socketEnum, data));
    }
    showCiv(civName) {
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminShowCiv, civName));
    }
    hideCiv(civName) {
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminHideCiv, civName));
    }
    hideAll() {
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminHideAll, ''));
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
        console.log('Formatting Data for websocket');
        console.log(`DataType: ${dataType} / RawData: ${JSON.stringify(rawData)} / ClientId: ${this.config.clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: this.config.clientId });
    }
    isToggleChecked(toggleId) {
        return $(`#toggle-${toggleId.toLowerCase()}-overlay`).is(':checked');
    }
    setToggleValue(toggleId, value) {
        $(`#toggle-${toggleId.toLowerCase()}-overlay`).prop('checked', value);
    }
    isAnyToggleActive() {
        let isToggleActive = false;
        for (let toggleKey in enums_1.OverlayEnums) {
            isToggleActive = (isToggleActive || this.isToggleChecked(toggleKey));
        }
        return isToggleActive;
    }
    getOverlayData(civ) {
        return {
            civ: civ,
            playSound: this.isToggleChecked(enums_1.OverlayEnums.Sound),
            overlays: {
                all: this.isToggleChecked(enums_1.OverlayEnums.All),
                tech: this.isToggleChecked(enums_1.OverlayEnums.Tech),
                blacksmith: this.isToggleChecked(enums_1.OverlayEnums.Blacksmith),
                university: this.isToggleChecked(enums_1.OverlayEnums.University),
                monastary: this.isToggleChecked(enums_1.OverlayEnums.Monastary),
                dock: this.isToggleChecked(enums_1.OverlayEnums.Dock),
            }
        };
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
                'background': `url("../images/civ-unique-units/${civ.toLowerCase()}.png`,
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
                if (this.isAnyToggleActive()) {
                    // if we have clicked this civ before     
                    if (this.lastClickedCivs.includes(civ)) {
                        this.sendSocketCommand(enums_1.SocketEnums.AdminHide, this.getOverlayData(civ));
                        // this.hideCiv(civ);
                        this.lastClickedCivs = this.lastClickedCivs.filter((clickedCiv) => {
                            civIcon.addClass('faded');
                            civIcon.removeClass('not-faded');
                            return civ !== clickedCiv;
                        });
                    }
                    else { // show the civ
                        this.sendSocketCommand(enums_1.SocketEnums.AdminShow, this.getOverlayData(civ));
                        civIcon.removeClass('faded');
                        civIcon.addClass('not-faded');
                        this.lastClickedCivs.push(civ);
                    }
                }
            });
            divWrapper.append(civIcon);
        });
        $('body').append(divWrapper);
    }
    initializeClearAllButton() {
        $('#btn-clear-all').click(() => {
            this.sendSocketCommand(enums_1.SocketEnums.AdminHideAll, { civ: this.lastClickedCivs, overlay: enums_1.OverlayEnums.All });
        });
    }
    attachTogglesToListeners() {
        $('#toggle-all-overlay').click(() => {
            if (this.isToggleChecked(enums_1.OverlayEnums.All)) {
                for (let toggleKey in enums_1.OverlayEnums) {
                    this.setToggleValue(toggleKey, true);
                }
            }
            else {
                for (let toggleKey in enums_1.OverlayEnums) {
                    this.setToggleValue(toggleKey, false);
                }
            }
            if (this.lastClickedCivs.length > 0) {
                if (this.isToggleChecked(enums_1.OverlayEnums.All)) {
                    this.sendSocketCommand(enums_1.SocketEnums.AdminShowAll, { civ: this.lastClickedCivs[0], overlay: enums_1.OverlayEnums.All });
                }
                else {
                    this.sendSocketCommand(enums_1.SocketEnums.AdminHideAll, { civ: this.lastClickedCivs[0], overlay: enums_1.OverlayEnums.All });
                }
            }
        });
        $('#toggle-tech-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-blacksmith-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-university-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-monastary-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-dock-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
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
    SocketEnums[SocketEnums["AdminHide"] = 1] = "AdminHide";
    SocketEnums[SocketEnums["AdminShow"] = 2] = "AdminShow";
    SocketEnums[SocketEnums["AdminShowCiv"] = 3] = "AdminShowCiv";
    SocketEnums[SocketEnums["AdminHideCiv"] = 4] = "AdminHideCiv";
    SocketEnums[SocketEnums["AdminShowAll"] = 5] = "AdminShowAll";
    SocketEnums[SocketEnums["AdminHideAll"] = 6] = "AdminHideAll";
    SocketEnums[SocketEnums["AdminShowTech"] = 7] = "AdminShowTech";
    SocketEnums[SocketEnums["AdminHideTech"] = 8] = "AdminHideTech";
    SocketEnums[SocketEnums["AdminShowBlacksmith"] = 9] = "AdminShowBlacksmith";
    SocketEnums[SocketEnums["AdminHideBlacksmith"] = 10] = "AdminHideBlacksmith";
    SocketEnums[SocketEnums["AdminShowUniversity"] = 11] = "AdminShowUniversity";
    SocketEnums[SocketEnums["AdminHideUniversity"] = 12] = "AdminHideUniversity";
    SocketEnums[SocketEnums["AdminShowMonastary"] = 13] = "AdminShowMonastary";
    SocketEnums[SocketEnums["AdminHideMonastary"] = 14] = "AdminHideMonastary";
    SocketEnums[SocketEnums["AdminShowDock"] = 15] = "AdminShowDock";
    SocketEnums[SocketEnums["AdminHideDock"] = 16] = "AdminHideDock";
})(SocketEnums = exports.SocketEnums || (exports.SocketEnums = {}));
var OverlayEnums;
(function (OverlayEnums) {
    OverlayEnums["All"] = "all";
    OverlayEnums["Tech"] = "tech";
    OverlayEnums["Blacksmith"] = "blacksmith";
    OverlayEnums["University"] = "university";
    OverlayEnums["Monastary"] = "monastary";
    OverlayEnums["Dock"] = "dock";
    OverlayEnums["Sound"] = "sound";
})(OverlayEnums = exports.OverlayEnums || (exports.OverlayEnums = {}));

},{}]},{},[2]);
