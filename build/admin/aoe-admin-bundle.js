(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdminClient {
    constructor(serverUrl = '', port = 8080) {
        this.port = port;
        this.serverUrl = `${serverUrl}:${port}`;
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    onClientConnect(websocket) {
        console.log(`Client connecting: {some client id}.`);
        // this.socket.clients.add(websocket);
        // this.socket.clients.forEach((client: any) => {
        //     client.on('message', (message: string) => {
        //         this.handleClientMessage(message, client);
        //     });
        //     client.on('error', (error: Error) => {
        //         this.handleClientError(error, client);
        //     });
        //     console.log(`Client {some client id} connected.`);
        //     client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
        // });
    }
    handleClientMessage(message, client) {
        const data = JSON.parse(message);
        console.log('received: %s', message);
        client.send(JSON.stringify({ type: '', data: '' }));
    }
    handleClientError(error, client) {
        console.log(`Error: {some client id}.`, error);
    }
    onOpen(event) {
        console.log('[open] Connection established');
    }
    onMessage(event) {
        // console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);
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
}
exports.AdminClient = AdminClient;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_client_1 = require("./admin-client");
new admin_client_1.AdminClient();

},{"./admin-client":1}]},{},[2]);
