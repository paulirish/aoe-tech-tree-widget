import { AoE2Config } from "./aoe2-config";
import { BlacksmithUpgrades, AgeUpgrades } from "./upgrade-enums";

export class UpgradeChanger {
    data: any;
    aoe2Config: AoE2Config;

    constructor(upgradeData: any, aoe2Config: AoE2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.fadeIn("Aztecs");
    }

    public fadeIn(civName: string) {
        const htmlElement = this.createHtmlElement(civName);
        const upgradesToDisable = this.data.upgradesToDisable[civName];

        htmlElement.addClass('fade-in-left-to-right');
        // if (!this.aoe2Config.socketMode) {
        //     if (this.aoe2Config.visibleDuration) {
        //         setTimeout(() => {
        //             this.fadeOut(civName);
        //         }, this.aoe2Config.visibleDuration * 1000);
        //     }
        // }
        this.addToBody(htmlElement);
    }

    public fadeOut(civName: string) {
        const htmlElement = $(`.div-upgrade-background-wrapper`);
        htmlElement.removeClass('fade-in-left-to-right');
        htmlElement.addClass('fade-out-right-to-left');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }

    private addToBody(htmlElement: JQuery<HTMLElement>) {
        // const upgradeBackgroundImages = $('<div></div>').addClass(['div-upgrade-background-wrapper']);
        // upgradeBackgroundImages.append(htmlElement);
        $('#upgrade-overlay-wrapper').append(htmlElement);
    }

    private clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }

    private createHtmlElement(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName}-upgrade-background-wrapper"></div>`).addClass(['div-upgrade-background-wrapper', 'mask-img-horizontal']);

        template.append(this.createBlackSmithUpgradesPanel(civName));

        return template;
    }

    public createBlackSmithUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);

        template.append(this.getBlacksmithUpgradesByAge(civName, AgeUpgrades.Feudal.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));

        return template;
    }

    private getBlacksmithUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-bs-upgrades"></div>`).addClass('age-upgrades');

        if (age === AgeUpgrades.Feudal.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Forging}`, BlacksmithUpgrades.Forging.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Scale_Mail_Armor}`, BlacksmithUpgrades.Scale_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Scale_Barding_Armor}`, BlacksmithUpgrades.Scale_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Fletching}`, BlacksmithUpgrades.Fletching.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Padded_Archer_Armor}`, BlacksmithUpgrades.Padded_Archer_Armor.toLowerCase()));
        }
        else if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Iron_Casting}`, BlacksmithUpgrades.Iron_Casting.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Chain_Mail_Armor}`, BlacksmithUpgrades.Chain_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Chain_Barding_Armor}`, BlacksmithUpgrades.Chain_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Bodkin_Arrow}`, BlacksmithUpgrades.Bodkin_Arrow.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Leather_Archer_Armor}`, BlacksmithUpgrades.Leather_Archer_Armor.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Blast_Furnace}`, BlacksmithUpgrades.Blast_Furnace.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Plate_Mail_Armor}`, BlacksmithUpgrades.Plate_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Plate_Barding_Armor}`, BlacksmithUpgrades.Plate_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Bracer}`, BlacksmithUpgrades.Bracer.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Ring_Archer_Armor}`, BlacksmithUpgrades.Ring_Archer_Armor.toLowerCase()));
        }

        return groupOfIcons;
    }

    private createUpgradeIcon(divId: string, upgrade: string): JQuery<HTMLElement> {
        let civName = divId.split('-')[0];
        civName = civName.charAt(0).toUpperCase().concat(civName.substring(1));
        const template = $(`<div id="${divId}"></div>`).addClass(['div-upgrade']);

        const disabledUpgrade = this.data.upgradesToDisable[civName].find((disabledUpgrade: string) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });

        const css: any = {
            "background": `url("https://raw.githubusercontent.com/Treee/aoe-tech-tree-widget/gh-pages/build/images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        };

        if (!!disabledUpgrade) {
            template.addClass('disabled-upgrade');
        }

        template.css(css);
        return template;
    }
}