// import { AdminServer } from "./admin-server";

// const adminServer = new AdminServer();
// adminServer.startServer();


import WebSocket = require('ws');


const adminServer = new WebSocket.Server({ port: 8080 });


adminServer.on('connection', (ws) => {
    console.log('websocket connect', ws);
    adminServer.clients.add(ws);

    adminServer.clients.forEach((client) => {

        client.on('message', (message: string) => {
            const data = JSON.parse(message);
        });

        client.on('error', (error) => {
            console.log(error);
        });

        client.send(JSON.stringify({ dataType: 'connected', data: 'client connected' }));
    });
});
