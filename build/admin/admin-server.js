"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
class AdminServer {
    constructor() {
        this.adminServer = new WebSocket.Server({ port: 8080 });
    }
    startServer() {
        this.adminServer.on('connection', (ws) => {
            console.log('websocket connect', ws);
            this.adminServer.clients.add(ws);
            this.adminServer.clients.forEach((client) => {
                client.on('message', (message) => {
                    const data = JSON.parse(message);
                });
                client.on('error', (error) => {
                    console.log(error);
                });
                client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
            });
        });
    }
}
exports.AdminServer = AdminServer;
