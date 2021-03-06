import { SocketEnums, OverlayEnums } from "../enums";

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

    private buildHtml() {
        this.createClickableCivIcons();
        this.attachTogglesToListeners();
        this.setToggleValue(OverlayEnums.Tech, true);
    }

    private sendSocketCommand(socketEnum: SocketEnums, data: any) {
        this.socket.send(this.formatDataForWebsocket(socketEnum, data));
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
        console.log(`DataType: ${dataType} / RawData: ${JSON.stringify(rawData)} / ClientId: ${this.config.clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: this.config.clientId });
    }

    private isToggleChecked(toggleId: string): boolean {
        return $(`#toggle-${toggleId}-overlay`).is(':checked');
    }

    private setToggleValue(toggleId: string, value: boolean): void {
        $(`#toggle-${toggleId}-overlay`).prop('checked', value);
    }

    private isAnyToggleActive(): boolean {
        return this.isToggleChecked(OverlayEnums.All) || this.isToggleChecked(OverlayEnums.Tech)
            || this.isToggleChecked(OverlayEnums.Blacksmith) || this.isToggleChecked(OverlayEnums.University)
            || this.isToggleChecked(OverlayEnums.Monastary);
    }

    private getOverlayData(civ: string): any {
        return {
            civ: civ,
            overlays: {
                all: this.isToggleChecked(OverlayEnums.All),
                tech: this.isToggleChecked(OverlayEnums.Tech),
                blacksmith: this.isToggleChecked(OverlayEnums.Blacksmith),
                university: this.isToggleChecked(OverlayEnums.University),
                monastary: this.isToggleChecked(OverlayEnums.Monastary),
            }
        };
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

                    if (this.isAnyToggleActive()) {
                        // if we have clicked this civ before     
                        if (this.lastClickedCivs.includes(civ)) {
                            this.sendSocketCommand(SocketEnums.AdminHide, this.getOverlayData(civ));
                            // this.hideCiv(civ);
                            this.lastClickedCivs = this.lastClickedCivs.filter((clickedCiv) => { // remove hidden civs
                                civIcon.addClass('faded');
                                civIcon.removeClass('not-faded');
                                return civ !== clickedCiv;
                            });
                        } else { // show the civ
                            this.sendSocketCommand(SocketEnums.AdminShow, this.getOverlayData(civ));

                            civIcon.removeClass('faded');
                            civIcon.addClass('not-faded');
                            this.lastClickedCivs.push(civ);
                        }
                    }
                });
                divWrapper.append(civIcon);
            });
        $('body').append(divWrapper);
    }

    attachTogglesToListeners() {
        $('#toggle-all-overlay').click(() => {
            if (this.isToggleChecked(OverlayEnums.All)) {
                this.setToggleValue(OverlayEnums.Tech, true);
                this.setToggleValue(OverlayEnums.Blacksmith, true);
                this.setToggleValue(OverlayEnums.University, true);
                this.setToggleValue(OverlayEnums.Monastary, true);
            } else {
                this.setToggleValue(OverlayEnums.Tech, false);
                this.setToggleValue(OverlayEnums.Blacksmith, false);
                this.setToggleValue(OverlayEnums.University, false);
                this.setToggleValue(OverlayEnums.Monastary, false);
            }

            if (this.lastClickedCivs.length > 0) {
                if (this.isToggleChecked(OverlayEnums.All)) {
                    this.sendSocketCommand(SocketEnums.AdminShowAll, { civ: this.lastClickedCivs[0], overlay: OverlayEnums.All });
                } else {
                    this.sendSocketCommand(SocketEnums.AdminHideAll, { civ: this.lastClickedCivs[0], overlay: OverlayEnums.All });
                }
            }
        });
        $('#toggle-tech-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-blacksmith-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-university-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
        $('#toggle-monastary-overlay').click(() => {
            // if the civ is already selected
            // if we toggle on
            // show the overlay
            // else
            // hide the overlay
        });
    }

}