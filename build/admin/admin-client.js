"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class AdminClient {
    constructor() {
        this.clientId = '';
        this.lastClickedCivs = [];
        this.socket = new WebSocket('ws://localhost:8080');
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
            const civIcon = $(`<div id="civ-icon-clickable">${civ}</div>`).addClass('civ-tech-icon');
            civIcon.css({ 'background': `url("https://raw.githubusercontent.com/Treee/aoe-tech-tree-widget/gh-pages/build/images/civ-icons/${civ.toLowerCase()}.png)` });
            civIcon.click(() => {
                if (this.lastClickedCivs.includes(civ)) { // if we have clicked this civ before
                    this.hideCiv(civ);
                    this.lastClickedCivs = this.lastClickedCivs.filter((clickedCiv) => {
                        return civ !== clickedCiv;
                    });
                }
                else {
                    this.showCiv(civ);
                    this.lastClickedCivs.push(civ);
                }
            });
            divWrapper.append(civIcon);
        });
        $('body').append(divWrapper);
    }
}
exports.AdminClient = AdminClient;
