"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class CivChangerClient {
    constructor(techTreeCivChanger, upgradeChanger, socketKey) {
        this.clientId = '';
        this.clientId = socketKey;
        this.techTreeCivChanger = techTreeCivChanger;
        this.upgradeChanger = upgradeChanger;
        this.socket = new WebSocket('wss://itsatreee.com:8443');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    handleMessage(message) {
        console.log(`DataType: ${message.type} / RawData: ${message.data}`);
        if (message.type === enums_1.SocketEnums.AdminShowCiv) {
            this.techTreeCivChanger.fadeIn(message.data);
        }
        else if (message.type === enums_1.SocketEnums.AdminHideCiv) {
            this.techTreeCivChanger.fadeOut(message.data);
        }
    }
    showCiv() {
        this.techTreeCivChanger.fadeIn("Aztecs");
    }
    onOpen(event) {
        console.log('[open] Connection established');
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.ClientRegister, this.clientId));
    }
    onMessage(event) {
        this.handleMessage(JSON.parse(event.data));
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
}
exports.CivChangerClient = CivChangerClient;
