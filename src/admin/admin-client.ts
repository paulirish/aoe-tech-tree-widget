import { SocketEnums } from "../enums";

export class AdminClient {

    socket: WebSocket;
    clientId: string = '';
    config: any = {};

    constructor() {
        this.socket = new WebSocket('wss://itsatreee.com:8443');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
        this.setConfigFromQueryString();
        this.buildHtml();
    }

    public setConfigFromQueryString() {
        this.config = this.setConfigFrom(window.location.search.substring(1));
    }

    private setConfigFrom(string: string): any {
        const object = {};
        string.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(object, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            } else {
                Object.defineProperty(object, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return object;
    }

    buildHtml() {
        this.createClickableCivIcons();
    }

    showCiv(civName: string) {
        this.socket.send(this.formatDataForWebsocket(SocketEnums.AdminShowCiv, civName));
    }

    hideCiv(civName: string) {
        this.socket.send(this.formatDataForWebsocket(SocketEnums.AdminHideCiv, civName));
    }

    onOpen(event: any) {
        console.log('[open] Connection established');
    }

    onMessage(msg: any) {
        const message = JSON.parse(msg.data);
        console.log('event', message);
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
        console.log('Formatting Data for websocket');
        console.log(`DataType: ${dataType} / RawData: ${rawData} / ClientId: ${this.config.clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: this.config.clientId });
    }

    lastClickedCivs: string[] = [];
    createClickableCivIcons() {
        const divWrapper = $('<div id="civ-tech-icons"></div>').addClass('civ-tech-icons-wrapper');
        ["Aztecs", "Berbers", "Britons", "Bulgarians", "Burmese", "Byzantines",
            "Celts", "Chinese", "Cumans", "Ethiopians", "Franks", "Goths", "Huns",
            "Incas", "Indians", "Italians", "Japanese", "Khmer", "Koreans", "Lithuanians",
            "Magyars", "Malay", "Malians", "Mayans", "Mongols", "Persians", "Portuguese",
            "Saracens", "Slavs", "Spanish", "Tatars", "Teutons", "Turks",
            "Vietnamese", "Vikings"].forEach((civ) => {
                const civIcon = $(`<div id="civ-icon-clickable"><div id="civ-text" class="civ-text">${civ}</div></div>`).addClass(['civ-tech-icon', 'faded']);
                // emblem
                // https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/aztecs.png
                civIcon.css({
                    'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-unique-units/${civ.toLowerCase()}.png`,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                });

                civIcon.hover(() => {
                    civIcon.css({
                        'opacity': '1'
                    });
                }, () => {
                    if (!this.lastClickedCivs.includes(civ)) { // if we've clicked this civ, dont hide it yet
                        civIcon.css({
                            'opacity': '0.5'
                        });
                    }
                });

                civIcon.click(() => {

                    if (this.lastClickedCivs.includes(civ)) { // if we have clicked this civ before
                        this.hideCiv(civ);
                        this.lastClickedCivs = this.lastClickedCivs.filter((clickedCiv) => { // remove hidden civs
                            civIcon.addClass('faded');
                            civIcon.removeClass('not-faded');
                            return civ !== clickedCiv;
                        });
                    } else {
                        this.showCiv(civ);
                        civIcon.removeClass('faded');
                        civIcon.addClass('not-faded');
                        this.lastClickedCivs.push(civ);
                    }
                });
                divWrapper.append(civIcon);
            });
        $('body').append(divWrapper);
    }

}