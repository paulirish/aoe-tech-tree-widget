"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
const uuid_1 = require("uuid");
const enums_1 = require("../enums");
class AdminServer {
    constructor() {
        this.clients = {};
        this.adminServer = new WebSocket.Server({ port: 8080 });
        const closeHandle = this.adminServer;
        process.on('SIGHUP', function () {
            closeHandle.close();
            console.log('About to exit');
            process.exit();
        });
    }
    startServer() {
        this.adminServer.on('connection', (ws) => {
            this.adminServer.clients.add(ws);
            const uuid = uuid_1.v4();
            console.log(`registered user: ${uuid}`);
            ws.send(this.formatDataForWebsocket(enums_1.SocketEnums.ClientRegister, uuid));
            // this.clients[uuid] = ws;
            ws.on('message', (message) => {
                console.log(message);
                const msg = JSON.parse(message);
                if (msg.type === enums_1.SocketEnums.ClientRegister) {
                    this.clients[msg.data] = ws;
                }
                const websocket = this.clients[msg.toClientId];
                console.log(`msg: ${msg} socket: ${!!websocket}`, msg);
                if (websocket) {
                    if (msg.type === enums_1.SocketEnums.AdminShowCiv) {
                        websocket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminShowCiv, msg.data));
                    }
                    else if (msg.type === enums_1.SocketEnums.AdminHideCiv) {
                        websocket.send(this.formatDataForWebsocket(enums_1.SocketEnums.AdminHideCiv, msg.data));
                    }
                }
            });
            ws.on('error', (error) => {
                console.log(error);
            });
            ws.on('close', (error) => {
                delete this.clients[uuid];
                console.log(`deleted ${uuid}. remaining: ${Object.keys(this.clients).length}`);
            });
        });
    }
    formatDataForWebsocket(dataType, rawData) {
        console.log(`DataType: ${dataType} / RawData: ${rawData}`);
        return JSON.stringify({ type: dataType, data: rawData });
    }
}
exports.AdminServer = AdminServer;
