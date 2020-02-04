"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgrade_enums_1 = require("./upgrade-enums");
const enums_1 = require("../enums");
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        // this.fadeInAll("Berbers");
    }
    fadeInAll(civName) {
        let leftOrRight = '';
        if (this.isPlaceholderEmpty('left')) { //left
            leftOrRight = 'left';
        }
        else { //right
            leftOrRight = 'right';
        }
        setTimeout(() => {
            this.fadeIn(civName, 'blacksmith', leftOrRight);
        }, 100);
        setTimeout(() => {
            this.fadeIn(civName, 'university', leftOrRight);
        }, 600);
        setTimeout(() => {
            this.fadeIn(civName, 'monastary', leftOrRight);
        }, 1100);
        // setTimeout(() => {
        //     this.fadeIn(civName, 'dock');
        // }, 1600);
    }
    fadeOutAll(civName) {
        // setTimeout(() => {
        //     this.fadeOut(civName, 'dock');
        // }, 50);
        setTimeout(() => {
            this.fadeOut(civName, 'monastary');
        }, 250);
        setTimeout(() => {
            this.fadeOut(civName, 'university');
        }, 450);
        setTimeout(() => {
            this.fadeOut(civName, 'blacksmith');
        }, 650);
    }
    handleMessage(type, rawData) {
        if (type === enums_1.SocketEnums.AdminHide) {
            const data = rawData;
            if (data.overlays.all) {
                this.fadeOutAll(data.civ);
            }
            else {
                Object.keys(data.overlays).forEach((key) => {
                    if (data.overlays[key] && key !== enums_1.OverlayEnums.Tech && key !== enums_1.OverlayEnums.All) {
                        this.fadeOut(data.civ, key);
                    }
                });
            }
        }
        else if (type === enums_1.SocketEnums.AdminShow) {
            let leftOrRight = '';
            if (this.isPlaceholderEmpty('left')) { //left
                leftOrRight = 'left';
            }
            else { //right
                leftOrRight = 'right';
            }
            const data = rawData;
            if (data.overlays.all) {
                this.fadeInAll(data.civ);
            }
            else {
                Object.keys(data.overlays).forEach((key) => {
                    if (data.overlays[key] && key !== enums_1.OverlayEnums.Tech && key !== enums_1.OverlayEnums.All) {
                        this.fadeIn(data.civ, key, leftOrRight);
                    }
                });
            }
        }
    }
    fadeIn(civName, building, leftOrRight) {
        // if the element doesnt alreayd exist
        if (!$(`#${civName.toLowerCase()}-upgrades-${building}`).length) {
            const htmlElement = this.createHtmlElement(civName, building);
            htmlElement.addClass('fade-in-left-to-right');
            if (!this.aoe2Config.socketMode) {
                if (this.aoe2Config.visibleDuration) {
                    setTimeout(() => {
                        this.fadeOut(civName, building);
                    }, this.aoe2Config.visibleDuration * 1000);
                }
            }
            this.addToBody(leftOrRight, htmlElement);
        }
    }
    isPlaceholderEmpty(placeHolderId) {
        return $(`#${placeHolderId}-upgrade-placeholder`).children().length === 0;
    }
    fadeOut(civName, building) {
        const id = `${civName.toLowerCase()}-upgrades-${building}`;
        const htmlElement = $(`#${id}`).parent();
        htmlElement.removeClass('fade-in-left-to-right');
        htmlElement.addClass('fade-out-right-to-left');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(leftOrRight, htmlElement) {
        $(`#${leftOrRight}-upgrade-placeholder`).append(htmlElement);
    }
    createHtmlElement(civName, upgradeBuilding) {
        const template = $(`<div id="${civName.toLowerCase()}-upgrade-background-wrapper"></div>`).addClass(['div-upgrade-background-wrapper', 'mask-img-horizontal']);
        const buildingIcon = $(`<div></div>`).addClass(['div-upgrade']);
        buildingIcon.css({
            "background-image": `url('./images/building-icons/${upgradeBuilding}.tp.png')`,
        });
        template.append(buildingIcon);
        if (upgradeBuilding === 'blacksmith') {
            template.append(this.createBlackSmithUpgradesPanel(civName));
        }
        else if (upgradeBuilding === 'university') {
            template.append(this.createUniversityUpgradesPanel(civName));
        }
        else if (upgradeBuilding === 'monastary') {
            template.append(this.createMonestaryUpgradesPanel(civName));
        }
        else if (upgradeBuilding === 'dock') {
            template.append(this.createDockUpgradesPanel(civName));
        }
        return template;
    }
    createBlackSmithUpgradesPanel(civName) {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createUniversityUpgradesPanel(civName) {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-university"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getUniversityUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getUniversityUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createMonestaryUpgradesPanel(civName) {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-monastary"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getMonestaryUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getMonestaryUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    createDockUpgradesPanel(civName) {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-dock"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getDockUpgradesByAge(civName, upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()));
        return template;
    }
    getBlacksmithUpgradesByAge(civ, age) {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-bs-upgrades"></div>`).addClass('age-upgrades');
        if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
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
        if (age === upgrade_enums_1.AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Masonry}`, upgrade_enums_1.UniversityUpgrades.Masonry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Fortified_Wall}`, upgrade_enums_1.UniversityUpgrades.Fortified_Wall.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Guard_Tower}`, upgrade_enums_1.UniversityUpgrades.Guard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Heated_Shot}`, upgrade_enums_1.UniversityUpgrades.Heated_Shot.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Treadmill_Crane}`, upgrade_enums_1.UniversityUpgrades.Treadmill_Crane.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.UniversityUpgrades.Architecture}`, upgrade_enums_1.UniversityUpgrades.Architecture.toLowerCase()));
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
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Redemption}`, upgrade_enums_1.MonestaryUpgrades.Redemption.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Fervor}`, upgrade_enums_1.MonestaryUpgrades.Fervor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Sanctity}`, upgrade_enums_1.MonestaryUpgrades.Sanctity.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Atonement}`, upgrade_enums_1.MonestaryUpgrades.Atonement.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Herbal_Medicine}`, upgrade_enums_1.MonestaryUpgrades.Herbal_Medicine.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.MonestaryUpgrades.Heresy}`, upgrade_enums_1.MonestaryUpgrades.Heresy.toLowerCase()));
        }
        else if (age === upgrade_enums_1.AgeUpgrades.Imp.toLowerCase()) {
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
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Galleon}`, upgrade_enums_1.DockUpgrades.Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Heavy_Demolition_Ship}`, upgrade_enums_1.DockUpgrades.Heavy_Demolition_Ship.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Fast_Fire_Ship}`, upgrade_enums_1.DockUpgrades.Fast_Fire_Ship.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Cannon_Galleon}`, upgrade_enums_1.DockUpgrades.Cannon_Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Elite_Cannon_Galleon}`, upgrade_enums_1.DockUpgrades.Elite_Cannon_Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Dry_Dock}`, upgrade_enums_1.DockUpgrades.Dry_Dock.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${upgrade_enums_1.DockUpgrades.Shipwright}`, upgrade_enums_1.DockUpgrades.Shipwright.toLowerCase()));
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
            "background": `url("./images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        };
        template.css(css);
        return template;
    }
}
exports.UpgradeChanger = UpgradeChanger;
