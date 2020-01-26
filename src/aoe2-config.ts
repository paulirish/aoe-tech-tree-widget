export class AoE2Config {

    civName: string = '';
    fadeOut: boolean = false;
    visibleDuration: number = 0; // use this value to show and hide in one action. this number determines how long it will be visible
    fadeInDuration: number = 2;
    fadeOutDuration: number = 2.5;

    constructor() {

    }

    public setConfigFromHash(): AoE2Config {
        return this.setConfigFrom(window.location.hash.substring(1));
    }

    public setConfigFromQueryString(): AoE2Config {
        return this.setConfigFrom(window.location.search.substring(1));
    }

    private setConfigFrom(string: string): AoE2Config {
        string.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(this, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            } else {
                Object.defineProperty(this, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return this;
    }
}