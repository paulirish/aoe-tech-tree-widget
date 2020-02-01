"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgrade_enums_1 = require("./upgrade-enums");
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.fadeIn("Aztecs");
    }
    fadeIn(civName) {
        const htmlElement = this.createHtmlElement(civName);
        const upgradesToDisable = this.data.upgradesToDisable[civName];
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
        const htmlElement = $(`.div-upgrade-background-wrapper`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(htmlElement) {
        // const upgradeBackgroundImages = $('<div></div>').addClass(['div-upgrade-background-wrapper']);
        // upgradeBackgroundImages.append(htmlElement);
        $('#upgrade-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}-upgrade-background-wrapper"></div>`).addClass(['div-upgrade-background-wrapper', 'mask-img-vertical']);
        template.append(this.createBlackSmithUpgradesPanel(civName));
        return template;
    }
    createBlackSmithUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Feudal.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    getBlacksmithUpgradesByAge(civ, age) {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-bs-upgrades"></div>`).addClass('age-upgrades');
        if (age === upgrade_enums_1.AgeUpgrades.Feudal.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Forging}`, upgrade_enums_1.BlacksmithUpgrades.Forging.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Scale_Mail_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Scale_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Scale_Barding_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Scale_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Fletching}`, upgrade_enums_1.BlacksmithUpgrades.Fletching.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Padded_Archer_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Padded_Archer_Armor.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Iron_Casting}`, upgrade_enums_1.BlacksmithUpgrades.Iron_Casting.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Chain_Mail_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Chain_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Chain_Barding_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Chain_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Bodkin_Arrow}`, upgrade_enums_1.BlacksmithUpgrades.Bodkin_Arrow.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Leather_Archer_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Leather_Archer_Armor.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Blast_Furnace}`, upgrade_enums_1.BlacksmithUpgrades.Blast_Furnace.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Plate_Mail_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Plate_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Plate_Barding_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Plate_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Bracer}`, upgrade_enums_1.BlacksmithUpgrades.Bracer.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.BlacksmithUpgrades.Ring_Archer_Armor}`, upgrade_enums_1.BlacksmithUpgrades.Ring_Archer_Armor.toLowerCase()));
        }
        return groupOfIcons;
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
