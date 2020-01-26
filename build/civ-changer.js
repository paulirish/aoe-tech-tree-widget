"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CivChanger {
    constructor(techData) {
        this.data = techData;
    }
    fadeIn(civName, htmlElement) {
        const civKey = this.data.civs[civName];
        const civDesc = this.data.key_value[civKey];
        htmlElement.find('.civ-name').text(civName);
        htmlElement.find('.civ-desc').html(civDesc);
        htmlElement.removeClass('fade-out');
        htmlElement.addClass('fade-in');
        setTimeout(() => {
            this.fadeOut(htmlElement);
        }, 10000);
    }
    fadeOut(htmlElement) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $('<div></div>').addClass(['div-background', 'mask-img']);
        template.append($('<div></div>').addClass('civ-name'));
        template.append($('<div></div>').addClass('civ-desc'));
        this.fadeIn(civName, template);
        return template;
    }
}
exports.CivChanger = CivChanger;
