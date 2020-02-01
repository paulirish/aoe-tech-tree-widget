"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.createBlackSmithUpgradesElement("Aztecs");
    }
    fadeIn(civName) {
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
    fadeOut(civName) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(htmlElement) {
        $('#upgrade-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
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
    createBlackSmithUpgradesElement(civName) {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-background', 'mask-img']);
        return template;
    }
}
exports.UpgradeChanger = UpgradeChanger;
