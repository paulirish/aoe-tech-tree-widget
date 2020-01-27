import WebSocket = require('ws');

export class AdminServer {

    private adminServer: WebSocket.Server;

    constructor() {
        this.adminServer = new WebSocket.Server({ port: 8080 });
    }

    startServer() {
        this.adminServer.on('connection', (ws) => {
            console.log('websocket connect', ws);
            this.adminServer.clients.add(ws);

            this.adminServer.clients.forEach((client) => {

                client.on('message', (message: string) => {
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