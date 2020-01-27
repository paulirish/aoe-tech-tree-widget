"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TechTreeCivChanger {
    constructor(techData, aoe2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
    }
    addCivToBody(civName) {
        $('body').append(this.createHtmlElement(civName));
    }
    listenForUrlChanges() {
        this.aoe2Config.setConfigFromHash();
        if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
            this.addCivToBody(this.aoe2Config.civName);
        }
        $(window).bind('hashchange', (event) => {
            const oldConfig = this.aoe2Config;
            // url changed!
            this.aoe2Config = this.aoe2Config.setConfigFromHash();
            if (oldConfig.civName === this.aoe2Config.civName) {
                //civ didnt change so we probably want to fade out
                if (this.aoe2Config.fadeOut) {
                    this.fadeOut($(`#${this.aoe2Config.civName}`));
                }
            }
            else {
                // new civ so we probably want to show it
                if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
                    this.addCivToBody(this.aoe2Config.civName);
                }
            }
        });
    }
    fadeIn(civName, htmlElement) {
        const civKey = this.data.civs[civName];
        const civDesc = this.data.key_value[civKey];
        htmlElement.find('.civ-name').text(civName);
        htmlElement.find('.civ-desc').html(civDesc);
        htmlElement.removeClass('fade-out');
        htmlElement.addClass('fade-in');
        if (this.aoe2Config.visibleDuration) {
            setTimeout(() => {
                this.fadeOut(htmlElement);
            }, this.aoe2Config.visibleDuration * 1000);
        }
    }
    fadeOut(htmlElement) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}"></div>`).addClass(['div-background', 'mask-img']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        const audio = $(`<audio autoplay id="myaudio"><source src="https://treee.github.io/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        wrapperDiv.append(audio);
        wrapperDiv.find('#myaudio')[0].volume = this.aoe2Config.volume;
        wrapperDiv.append($('<div></div>').addClass('civ-name'));
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        template.append(wrapperDiv);
        this.fadeIn(civName, template);
        return template;
    }
}
exports.TechTreeCivChanger = TechTreeCivChanger;