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
            this.fadeOut(civName, htmlElement);
        }, 10000);
    }
    fadeOut(civName, htmlElement) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, 2500); // remove this div after the animation is done
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    addCivToBody(civName) {
        $('body').append(this.createHtmlElement(civName));
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}"></div>`).addClass(['div-background', 'mask-img']);
        template.append($('<div></div>').addClass('civ-name'));
        template.append($('<div></div>').addClass('civ-desc'));
        this.fadeIn(civName, template);
        return template;
    }
    getCivsHtmlElement() {
        const template = $('<select id="civSelector"></select>').addClass('civ-selector');
        Object.keys(this.data.civs).forEach((civName) => {
            template.append($(`<option value="${civName}">${civName}</option>`));
        });
        template.change(() => {
            this.civChanged();
        });
        return template;
    }
    civChanged() {
        const civName = $('#civSelector').val();
        if (civName && civName !== '') {
            this.addCivToBody(civName.toString());
        }
    }
}
exports.CivChanger = CivChanger;
