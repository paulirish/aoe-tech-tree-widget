import { AoE2Config } from "./aoe2-config";
import { SocketEnums } from "../enums";

export class TechTreeCivChanger {
    data: any;
    aoe2Config: AoE2Config;
    playSound: boolean;

    constructor(techData: any, aoe2Config: AoE2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
        this.playSound = false;
        // this.fadeIn("Berbers");
    }

    public listenForUrlChanges() {
        this.aoe2Config.setConfigFromHash();
        if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
            this.fadeIn(this.aoe2Config.civName);
        }

        $(window).bind('hashchange', (event) => {
            const oldConfig = this.aoe2Config;
            // url changed!
            this.aoe2Config = this.aoe2Config.setConfigFromHash();

            if (oldConfig.civName === this.aoe2Config.civName) {
                //civ didnt change so we probably want to fade out
                if (this.aoe2Config.fadeOut) {
                    this.fadeOut(this.aoe2Config.civName);
                }
            } else {
                // new civ so we probably want to show it
                if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
                    this.fadeIn(this.aoe2Config.civName);
                }
            }
        });
    }

    public handleMessage(socketEnum: SocketEnums, data: any) {
        if (socketEnum === SocketEnums.AdminShow) {
            this.playSound = data.playSound;
            if (data.overlays.tech) {
                this.fadeIn(data.civ);
            }
        } else if (socketEnum === SocketEnums.AdminHide) {
            if (data.overlays.tech) {
                this.fadeOut(data.civ);
            }
        } else if (socketEnum === SocketEnums.AdminHideAll) {
            // hide everything
            data.civ.forEach((civ: string) => {
                this.fadeOut(civ);              
            });
        }
    }

    private fadeIn(civName: string) {
        if (!$(`#${civName}-tech`).length) {
            const htmlElement = this.createHtmlElement(civName);
            const civKey = this.data.civs[civName];
            const civDesc = this.data.key_value[civKey];
            htmlElement.find('.civ-name').text(civName);
            htmlElement.find('.civ-desc').html(civDesc);

            htmlElement.removeClass('fade-out');
            htmlElement.addClass('fade-in');

            if (!this.aoe2Config.socketMode) {
                if (this.aoe2Config.visibleDuration) {
                    setTimeout(() => {
                        this.fadeOut(civName);
                    }, this.aoe2Config.visibleDuration * 1000);
                }
            }

            let leftOrRight = '';
            if (this.isPlaceholderEmpty('left')) {//left
                leftOrRight = 'left';
            } else { //right
                leftOrRight = 'right';
            }

            this.addToBody(leftOrRight, htmlElement);
        }
    }

    private isPlaceholderEmpty(placeHolderId: string): boolean {
        return $(`#${placeHolderId}-tech-placeholder`).children().length === 0;
    }

    private fadeOut(civName: string) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }

    private addToBody(leftOrRight: string, htmlElement: JQuery<HTMLElement>) {
        $(`#${leftOrRight}-tech-placeholder`).append(htmlElement);
        // $('#tech-overlay-wrapper').append(htmlElement);
    }

    private clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }

    private createHtmlElement(civName: string) {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img-vertical']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        wrapperDiv.css({
            'background': `url("./images/civ-emblems/${civName.toLowerCase()}.png")`,
            'background-size': 'contain'
        });

        if (this.playSound) {
            const audio = $(`<audio autoplay id="myaudio"><source src="./sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
            wrapperDiv.append(audio);
            (wrapperDiv.find('#myaudio')[0] as HTMLAudioElement).volume = this.aoe2Config.volume;
        }

        const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');

        const civIcon = $(`<div></div>`).addClass('civ-icon');
        civIcon.css({
            'background': `url("./images/civ-icons/${civName.toLowerCase()}.png")`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat'
        });

        const civNameText = $('<div></div>').addClass('civ-name');
        civIconAndName.append(civIcon.clone()).append(civNameText).append(civIcon.clone());
        wrapperDiv.append(civIconAndName);
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));

        const uniqueUnitWrapper = $('<div></div>').addClass(['civ-unique-unit-wrapper']);
        const uniqueUnit = $('<div></div>').addClass(['civ-unique-unit', 'div-upgrade']);
        uniqueUnit.css({
            'background': `url("./images/civ-unique-units/${civName.toLowerCase()}.png")`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'transform': 'scaleX(-1)'
        });
        uniqueUnitWrapper.append(uniqueUnit);
        const eliteUpgrade = $('<div></div>').addClass('civ-elite-unique-unit-upgrade');
        const eliteUniqueUnit = uniqueUnit.clone().append(eliteUpgrade);
        eliteUniqueUnit.css({
            'transform': 'scaleX(1)'
        });
        uniqueUnitWrapper.append(eliteUniqueUnit);

        wrapperDiv.append(uniqueUnitWrapper);
        template.append(wrapperDiv);
        return template;
    }
}