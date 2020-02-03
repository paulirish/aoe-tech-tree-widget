"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class TechTreeCivChanger {
    constructor(techData, aoe2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
        this.playSound = false;
        // this.fadeIn("Berbers");
    }
    listenForUrlChanges() {
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
            }
            else {
                // new civ so we probably want to show it
                if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
                    this.fadeIn(this.aoe2Config.civName);
                }
            }
        });
    }
    handleMessage(socketEnum, data) {
        if (socketEnum === enums_1.SocketEnums.AdminShow) {
            this.playSound = data.playSound;
            if (data.overlays.tech) {
                this.fadeIn(data.civ);
            }
        }
        else if (socketEnum === enums_1.SocketEnums.AdminHide) {
            if (data.overlays.tech) {
                this.fadeOut(data.civ);
            }
        }
    }
    fadeIn(civName) {
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
            if (this.isPlaceholderEmpty('left')) { //left
                leftOrRight = 'left';
            }
            else { //right
                leftOrRight = 'right';
            }
            this.addToBody(leftOrRight, htmlElement);
        }
    }
    isPlaceholderEmpty(placeHolderId) {
        return $(`#${placeHolderId}-tech-placeholder`).children().length === 0;
    }
    fadeOut(civName) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(leftOrRight, htmlElement) {
        $(`#${leftOrRight}-tech-placeholder`).append(htmlElement);
        // $('#tech-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img-vertical']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        wrapperDiv.css({
            'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/${civName.toLowerCase()}.png")`,
            'background-size': 'contain'
        });
        if (this.playSound) {
            const audio = $(`<audio autoplay id="myaudio"><source src="https://treee.github.io/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
            wrapperDiv.append(audio);
            wrapperDiv.find('#myaudio')[0].volume = this.aoe2Config.volume;
        }
        const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');
        const civIcon = $(`<div></div>`).addClass('civ-icon');
        civIcon.css({
            'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-icons/${civName.toLowerCase()}.png")`,
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
            'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-unique-units/${civName.toLowerCase()}.png")`,
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
exports.TechTreeCivChanger = TechTreeCivChanger;
