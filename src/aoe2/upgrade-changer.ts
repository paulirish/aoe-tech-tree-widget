import { AoE2Config } from "./aoe2-config";

export class UpgradeChanger {
    data: any;
    aoe2Config: AoE2Config;

    constructor(upgradeData: any, aoe2Config: AoE2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.createBlackSmithUpgradesElement("Aztecs");
    }

    public fadeIn(civName: string) {
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
        this.addToBody(htmlElement);
    }

    public fadeOut(civName: string) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }

    private addToBody(htmlElement: JQuery<HTMLElement>) {
        $('#upgrade-overlay-wrapper').append(htmlElement);
    }

    private clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }

    private createHtmlElement(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img']);
        // const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        // wrapperDiv.css({
        //     'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/${civName.toLowerCase()}.png")`,
        //     'background-size': 'contain'
        // });
        // const audio = $(`<audio autoplay id="myaudio"><source src="https://treee.github.io/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        // wrapperDiv.append(audio);
        // (wrapperDiv.find('#myaudio')[0] as HTMLAudioElement).volume = this.aoe2Config.volume;

        // const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');

        // const civIcon = $(`<div></div>`).addClass('civ-icon');
        // civIcon.css({
        //     'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-icons/${civName.toLowerCase()}.png")`,
        //     'background-size': 'contain',
        //     'background-repeat': 'no-repeat'
        // });

        // const civNameText = $('<div></div>').addClass('civ-name');
        // civIconAndName.append(civIcon.clone()).append(civNameText).append(civIcon.clone());
        // wrapperDiv.append(civIconAndName);
        // wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        // template.append(wrapperDiv);
        return template;
    }

    createBlackSmithUpgradesElement(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-background', 'mask-img']);
        return template;
    }
}