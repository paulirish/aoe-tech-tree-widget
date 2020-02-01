"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgrade_enums_1 = require("./upgrade-enums");
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.addToBody(this.createBlackSmithUpgradesPanel("Aztecs"));
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
    createBlackSmithUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        let counter = 0;
        const numIconsPerLine = 5;
        let ageUp = 0;
        const ages = ['feudal', 'castle', 'imperial'];
        let ageUpDiv = $('<div id="feudal"></div>');
        template.append(this.createUpgradeIcon(`${civName}-${ages[ageUp]}`, ages[ageUp]));
        Object.values(upgrade_enums_1.BlacksmithUpgrades).forEach((upgrade) => {
            const blacksmithId = `${civName}-upgrade-blacksmith`;
            ageUpDiv.append(this.createUpgradeIcon(blacksmithId, upgrade.toLowerCase()));
            if (++counter % numIconsPerLine === 0) {
                ageUp++;
                template.append(ageUpDiv);
                template.append($('<br>'));
                if (ageUp < ages.length) {
                    ageUpDiv = $(`<div id=${ages[ageUp]}></div>`);
                    ageUpDiv.append(this.createUpgradeIcon(`${civName}-${ages[ageUp]}`, ages[ageUp]));
                }
            }
        });
        return template;
    }
    createUpgradeIcon(divId, upgrade) {
        const template = $(`<div id="${divId}"></div>`).addClass(['div-upgrade']);
        template.css({
            "background": `url("https://raw.githubusercontent.com/Treee/aoe-tech-tree-widget/gh-pages/build/images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        });
        return template;
    }
}
exports.UpgradeChanger = UpgradeChanger;
