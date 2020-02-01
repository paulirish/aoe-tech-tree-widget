"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgrade_enums_1 = require("./upgrade-enums");
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        setTimeout(() => {
            this.fadeIn("Aztecs", 'bs');
        }, 100);
        setTimeout(() => {
            this.fadeIn("Aztecs", 'uni');
        }, 600);
        setTimeout(() => {
            this.fadeIn("Aztecs", 'monestary');
        }, 1100);
        setTimeout(() => {
            this.fadeIn("Aztecs", 'dock');
        }, 1600);
    }
    fadeIn(civName, building) {
        const htmlElement = this.createHtmlElement(civName, building);
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
    fadeOut(civName) {
        const htmlElement = $(`.div-upgrade-background-wrapper`);
        htmlElement.removeClass('fade-in-left-to-right');
        htmlElement.addClass('fade-out-right-to-left');
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
    createHtmlElement(civName, upgradeBuilding) {
        const template = $(`<div id="${civName}-upgrade-background-wrapper"></div>`).addClass(['div-upgrade-background-wrapper', 'mask-img-horizontal']);
        let delay = 0;
        if (upgradeBuilding === 'bs') {
            template.append(this.createBlackSmithUpgradesPanel(civName));
            delay = 0.5;
        }
        else if (upgradeBuilding === 'uni') {
            template.append(this.createUniversityUpgradesPanel(civName));
            delay = 1;
        }
        else if (upgradeBuilding === 'monestary') {
            template.append(this.createMonestaryUpgradesPanel(civName));
            delay = 1.5;
        }
        else if (upgradeBuilding === 'dock') {
            template.append(this.createDockUpgradesPanel(civName));
            delay = 2;
        }
        // template.css({
        //     "animation-delay": `${delay}s`
        // });
        return template;
    }
    createBlackSmithUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Feudal.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createUniversityUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-university"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getUniversityUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getUniversityUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createMonestaryUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-monestary"></div>`).addClass(['div-upgrade-background']);
        template.css({
            "padding-top": '3rem'
        });
        template.append(this.getMonestaryUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getMonestaryUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createDockUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-dock"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getDockUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Feudal.toLowerCase()));
        template.append(this.getDockUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getDockUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
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
    getUniversityUpgradesByAge(civ, age) {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-univ-upgrades"></div>`).addClass('age-upgrades');
        groupOfIcons.css({
            "width": "18rem"
        });
        if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Masonry}`, upgrade_enums_1.UniversityUpgrades.Masonry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Fortified_Wall}`, upgrade_enums_1.UniversityUpgrades.Fortified_Wall.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Ballistics}`, upgrade_enums_1.UniversityUpgrades.Ballistics.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Guard_Tower}`, upgrade_enums_1.UniversityUpgrades.Guard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Heated_Shot}`, upgrade_enums_1.UniversityUpgrades.Heated_Shot.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Murder_Holes}`, upgrade_enums_1.UniversityUpgrades.Murder_Holes.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Treadmill_Crane}`, upgrade_enums_1.UniversityUpgrades.Treadmill_Crane.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Architecture}`, upgrade_enums_1.UniversityUpgrades.Architecture.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Chemistry}`, upgrade_enums_1.UniversityUpgrades.Chemistry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Bombard_Tower}`, upgrade_enums_1.UniversityUpgrades.Bombard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Siege_Engineers}`, upgrade_enums_1.UniversityUpgrades.Siege_Engineers.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Keep}`, upgrade_enums_1.UniversityUpgrades.Keep.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Arrowslits}`, upgrade_enums_1.UniversityUpgrades.Arrowslits.toLowerCase()));
        }
        return groupOfIcons;
    }
    getMonestaryUpgradesByAge(civ, age) {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-univ-upgrades"></div>`).addClass('age-upgrades');
        if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.css({
                "width": "22rem"
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Redemption}`, upgrade_enums_1.MonestaryUpgrades.Redemption.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Fervor}`, upgrade_enums_1.MonestaryUpgrades.Fervor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Sanctity}`, upgrade_enums_1.MonestaryUpgrades.Sanctity.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Atonement}`, upgrade_enums_1.MonestaryUpgrades.Atonement.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Herbal_Medicine}`, upgrade_enums_1.MonestaryUpgrades.Herbal_Medicine.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Heresy}`, upgrade_enums_1.MonestaryUpgrades.Heresy.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.css({
                "width": "18rem"
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Block_Printing}`, upgrade_enums_1.MonestaryUpgrades.Block_Printing.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Illumination}`, upgrade_enums_1.MonestaryUpgrades.Illumination.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Faith}`, upgrade_enums_1.MonestaryUpgrades.Faith.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Theocracy}`, upgrade_enums_1.MonestaryUpgrades.Theocracy.toLowerCase()));
        }
        return groupOfIcons;
    }
    getDockUpgradesByAge(civ, age) {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-dock-upgrades"></div>`).addClass('age-upgrades');
        if (age === upgrade_enums_1.AgeUpgrades.Feudal.toLowerCase()) {
            groupOfIcons.css({
                "width": "8rem"
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.War_Galley_Fire_Ship_and_Demolition_Ship}`, upgrade_enums_1.DockUpgrades.War_Galley_Fire_Ship_and_Demolition_Ship.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.css({
                "width": "9rem"
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Gillnets}`, upgrade_enums_1.DockUpgrades.Gillnets.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Careening}`, upgrade_enums_1.DockUpgrades.Careening.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.css({
                "width": "21rem"
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Heavy_Demolition_Ship}`, upgrade_enums_1.DockUpgrades.Heavy_Demolition_Ship.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Fast_Fire_Ship}`, upgrade_enums_1.DockUpgrades.Fast_Fire_Ship.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Galleon}`, upgrade_enums_1.DockUpgrades.Galleon.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Cannon_Galleon}`, upgrade_enums_1.DockUpgrades.Cannon_Galleon.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Elite_Cannon_Galleon}`, upgrade_enums_1.DockUpgrades.Elite_Cannon_Galleon.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Dry_Dock}`, upgrade_enums_1.DockUpgrades.Dry_Dock.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Shipwright}`, upgrade_enums_1.DockUpgrades.Shipwright.toLowerCase()));
        }
        return groupOfIcons;
    }
    createUpgradeIcon(divId, upgrade) {
        let civName = divId.split('-')[0];
        civName = civName.charAt(0).toUpperCase().concat(civName.substring(1));
        const template = $(`<div id="${divId}"></div>`).addClass(['div-upgrade']);
        const disabledUpgrade = this.data[civName].disabled.techs.find((disabledUpgrade) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });
        const disabledUnit = this.data[civName].disabled.units.find((disabledUpgrade) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });
        const horsesDisabled = this.data[civName].disableHorses;
        if (!!disabledUpgrade) { // explicit disabled techs
            template.addClass('disabled-upgrade');
        }
        else if (horsesDisabled && upgrade.toLowerCase().includes('barding')) { // meso civs no horses
            template.addClass('disabled-upgrade');
        }
        else if (upgrade.toLowerCase().includes('war galley')) {
            upgrade = 'war galley';
        }
        else if (!!disabledUnit) {
            template.addClass('disabled-upgrade');
        }
        const css = {
            "background": `url("https://treee.github.io/aoe-tech-tree-widget/build/images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        };
        template.css(css);
        return template;
    }
}
exports.UpgradeChanger = UpgradeChanger;
