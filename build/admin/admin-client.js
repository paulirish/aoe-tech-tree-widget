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
