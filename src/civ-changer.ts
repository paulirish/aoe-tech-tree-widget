export class CivChanger {
    data: any;
    constructor(techData: any) {
        this.data = techData;
    }

    fadeIn(civName: string, htmlElement: JQuery<HTMLElement>) {
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

    fadeOut(htmlElement: JQuery<HTMLElement>) {
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
    }

    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }

    createHtmlElement(civName: string) {
        const template = $('<div></div>').addClass(['div-background', 'mask-img']);
        template.append($('<div></div>').addClass('civ-name'));
        template.append($('<div></div>').addClass('civ-desc'));
        this.fadeIn(civName, template);
        return template;
    }

}