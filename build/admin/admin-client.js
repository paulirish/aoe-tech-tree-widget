"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class AdminClient {
    // going to wss
    // https://stackoverflow.com/questions/23404160/why-does-my-wss-websockets-over-ssl-tls-connection-immediately-disconnect-w
    constructor() {
        this.clientId = '';
        this.lastClickedCivs = [];
        this.socket = new WebSocket('ws://ec2-52-11-210-14.us-west-2.compute.amazonaws.com:8080');
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
            // emblem
            // https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/aztecs.png
            civIcon.css({
                'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-unique-units/${civ.toLowerCase()}.png`,
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
            });
            civIcon.hover(() => {
                civIcon.css({
                    'background-color': 'green'
                });
            }, () => {
                civIcon.css({
                    'background-color': ''
                });
            });
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
