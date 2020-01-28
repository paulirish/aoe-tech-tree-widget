import { SocketEnums } from "../enums";
import { TechTreeCivChanger } from "../aoe2/tech-tree-civ-changer";

export class CivChangerClient {

    techTreeCivChanger: TechTreeCivChanger;
    socket: WebSocket;
    clientId: string = '';

    constructor(techTreeCivChanger: TechTreeCivChanger, socketKey: string) {
        this.clientId = socketKey;
        this.techTreeCivChanger = techTreeCivChanger;
<<<<<<< HEAD
        this.socket = new WebSocket('wss://ec2-52-11-210-14.us-west-2.compute.amazonaws.com:8443');
=======
        this.socket = new WebSocket('wss://ec2-34-216-67-54.us-west-2.compute.amazonaws.com:8443');
>>>>>>> ssl
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }

    handleMessage(message: { type: SocketEnums, data: any }) {
        console.log(`DataType: ${message.type} / RawData: ${message.data}`);
        if (message.type === SocketEnums.AdminShowCiv) {
            this.techTreeCivChanger.fadeIn(message.data);
        } else if (message.type === SocketEnums.AdminHideCiv) {
            this.techTreeCivChanger.fadeOut(message.data);
        }
    }

    showCiv() {
        this.techTreeCivChanger.fadeIn("Aztecs");
    }

    onOpen(event: any) {
        console.log('[open] Connection established');
        this.socket.send(this.formatDataForWebsocket(SocketEnums.ClientRegister, this.clientId));
    }

    onMessage(event: any) {
        this.handleMessage(JSON.parse(event.data));
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

    formatDataForWebsocket(dataType: SocketEnums, rawData: any): string {
        const clientId = $('#txt-client-id').val();
        console.log('Formatting Data for websocket');
        console.log(`DataType: ${dataType} / RawData: ${rawData} / ClientId: ${clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: clientId });
    }

}