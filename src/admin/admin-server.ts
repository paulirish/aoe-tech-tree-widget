import WebSocket = require('ws');
import https = require('https');
import fs = require('fs');

import { v4 } from 'uuid';
import { SocketEnums } from '../enums';

export class AdminServer {

    private adminServerSocket: WebSocket.Server;

    private adminServer: https.Server;
    private clients: any = {};

    constructor() {

        const server = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/itsatreee.com/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/itsatreee.com/privkey.pem')
        });

        this.adminServer = server;
        this.adminServerSocket = new WebSocket.Server({ server });
        const closeHandle = this.adminServerSocket;
        process.on('SIGHUP', function () {
            closeHandle.close();
            console.log('About to exit');
            process.exit();
        });
    }

    startServer() {
        this.adminServerSocket.on('connection', (ws) => {
            this.adminServerSocket.clients.add(ws);

            const uuid = v4();
            console.log(`registered user: ${uuid}`);
            ws.send(this.formatDataForWebsocket(SocketEnums.ClientRegister, uuid));
            // this.clients[uuid] = ws;


            ws.on('message', (message: string) => {
                console.log(message);
                const msg = JSON.parse(message);

                if (msg.type === SocketEnums.ClientRegister) {
                    this.clients[msg.data] = ws;
                }

                const websocket = this.clients[msg.toClientId];
                console.log(`msg: ${msg} socket: ${!!websocket}`, msg);
                if (websocket) {
                    if (msg.type === SocketEnums.AdminShowCiv) {
                        websocket.send(this.formatDataForWebsocket(SocketEnums.AdminShowCiv, msg.data))
                    } else if (msg.type === SocketEnums.AdminHideCiv) {
                        websocket.send(this.formatDataForWebsocket(SocketEnums.AdminHideCiv, msg.data))
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

        this.adminServer.listen(8443);
        console.log('Listening on port 8443');
    }

    formatDataForWebsocket(dataType: SocketEnums, rawData: any): string {
        console.log(`DataType: ${dataType} / RawData: ${rawData}`);
        return JSON.stringify({ type: dataType, data: rawData });
    }
}