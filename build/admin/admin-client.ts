export class AdminClient {
    port: number;

    serverUrl: string;
    socket: WebSocket;

    constructor(serverUrl: string = '', port: number = 8080) {
        this.port = port;
        this.serverUrl = `${serverUrl}:${port}`;
        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    onClientConnect(websocket: WebSocket) {
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

    handleClientMessage(message: string, client: WebSocket) {
        const data = JSON.parse(message);
        console.log('received: %s', message);
        client.send(JSON.stringify({ type: '', data: '' }));
    }

    handleClientError(error: Error, client: WebSocket) {
        console.log(`Error: {some client id}.`, error);
    }

    onOpen(event: any) {
        console.log('[open] Connection established');
    }

    onMessage(event: any) {
        // console.log(`[message] Data received from server: ${event.data}`);
        const eventData = JSON.parse(event.data);

    }

    // need to handle cwhen clients close their conenction
    onClose(event: any) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }

    onError(event: any) {
        console.log(`[error] ${event.message}`);
    }

}