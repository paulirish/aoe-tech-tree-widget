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
        this.setToggleValue(enums_1.OverlayEnums.Tech, true);
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
        return $(`#toggle-${toggleId}-overlay`).is(':checked');
    }
    setToggleValue(toggleId, value) {
        $(`#toggle-${toggleId}-overlay`).prop('checked', value);
    }
    isAnyToggleActive() {
        return this.isToggleChecked(enums_1.OverlayEnums.All) || this.isToggleChecked(enums_1.OverlayEnums.Tech)
            || this.isToggleChecked(enums_1.OverlayEnums.Blacksmith) || this.isToggleChecked(enums_1.OverlayEnums.University)
            || this.isToggleChecked(enums_1.OverlayEnums.Monastary);
    }
    getOverlayData(civ) {
        return {
            civ: civ,
            overlays: {
                all: this.isToggleChecked(enums_1.OverlayEnums.All),
                tech: this.isToggleChecked(enums_1.OverlayEnums.Tech),
                blacksmith: this.isToggleChecked(enums_1.OverlayEnums.Blacksmith),
                university: this.isToggleChecked(enums_1.OverlayEnums.University),
                monastary: this.isToggleChecked(enums_1.OverlayEnums.Monastary),
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
    attachTogglesToListeners() {
        $('#toggle-all-overlay').click(() => {
            if (this.isToggleChecked(enums_1.OverlayEnums.All)) {
                this.setToggleValue(enums_1.OverlayEnums.Tech, true);
                this.setToggleValue(enums_1.OverlayEnums.Blacksmith, true);
                this.setToggleValue(enums_1.OverlayEnums.University, true);
                this.setToggleValue(enums_1.OverlayEnums.Monastary, true);
            }
            else {
                this.setToggleValue(enums_1.OverlayEnums.Tech, false);
                this.setToggleValue(enums_1.OverlayEnums.Blacksmith, false);
                this.setToggleValue(enums_1.OverlayEnums.University, false);
                this.setToggleValue(enums_1.OverlayEnums.Monastary, false);
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
    }
}
exports.AdminClient = AdminClient;
