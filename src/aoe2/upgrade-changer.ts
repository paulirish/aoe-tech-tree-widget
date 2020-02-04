import { AoE2Config } from "./aoe2-config";
import { BlacksmithUpgrades, AgeUpgrades, UniversityUpgrades, MonestaryUpgrades, DockUpgrades } from "./upgrade-enums";
import { SocketEnums, OverlayEnums } from "../enums";

export class UpgradeChanger {
    data: any;
    aoe2Config: AoE2Config;

    constructor(upgradeData: any, aoe2Config: AoE2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        // this.fadeInAll("Berbers");
    }

    private fadeInAll(civName: string) {
        let leftOrRight = '';
        if (this.isPlaceholderEmpty('left')) {//left
            leftOrRight = 'left';
        } else { //right
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

    private fadeOutAll(civName: string) {
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

    public handleMessage(type: SocketEnums, rawData: any) {
        if (type === SocketEnums.AdminHide) {
            const data = rawData;
            if (data.overlays.all) {
                this.fadeOutAll(data.civ);
            } else {
                Object.keys(data.overlays).forEach((key) => {
                    if (data.overlays[key] && key !== OverlayEnums.Tech && key !== OverlayEnums.All) {
                        this.fadeOut(data.civ, key);
                    }
                });
            }
        } else if (type === SocketEnums.AdminShow) {
            let leftOrRight = '';
            if (this.isPlaceholderEmpty('left')) {//left
                leftOrRight = 'left';
            } else { //right
                leftOrRight = 'right';
            }
            const data = rawData;
            if (data.overlays.all) {
                this.fadeInAll(data.civ);
            } else {
                Object.keys(data.overlays).forEach((key) => {
                    if (data.overlays[key] && key !== OverlayEnums.Tech && key !== OverlayEnums.All) {
                        this.fadeIn(data.civ, key, leftOrRight);
                    }
                });
            }
        } else if (type === SocketEnums.AdminHideAll) {
            // hide eerything
            $(`#left-upgrade-placeholder`).removeClass('fade-in-left-to-right');
            $(`#left-upgrade-placeholder`).addClass('fade-out-right-to-left');
            setTimeout(() => {
                $(`#left-upgrade-placeholder`).remove();
            }, this.aoe2Config.fadeOutDuration * 1000);

            $(`#right-upgrade-placeholder`).removeClass('fade-in-left-to-right');
            $(`#right-upgrade-placeholder`).addClass('fade-out-right-to-left');
            setTimeout(() => {
                $(`#right-upgrade-placeholder`).remove();
            }, this.aoe2Config.fadeOutDuration * 1000);

        }
    }

    private fadeIn(civName: string, building: string, leftOrRight: string) {
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

    private isPlaceholderEmpty(placeHolderId: string): boolean {
        return $(`#${placeHolderId}-upgrade-placeholder`).children().length === 0;
    }

    private fadeOut(civName: string, building: string) {
        const id = `${civName.toLowerCase()}-upgrades-${building}`;
        const htmlElement = $(`#${id}`).parent();
        htmlElement.removeClass('fade-in-left-to-right');
        htmlElement.addClass('fade-out-right-to-left');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }

    private addToBody(leftOrRight: string, htmlElement: JQuery<HTMLElement>) {
        $(`#${leftOrRight}-upgrade-placeholder`).append(htmlElement);
    }

    private createHtmlElement(civName: string, upgradeBuilding: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrade-background-wrapper"></div>`).addClass(['div-upgrade-background-wrapper', 'mask-img-horizontal']);
        const buildingIcon = $(`<div></div>`).addClass(['div-upgrade']);
        buildingIcon.css({
            "background-image": `url('./images/building-icons/${upgradeBuilding}.tp.png')`,
        });
        template.append(buildingIcon);
        if (upgradeBuilding === 'blacksmith') {
            template.append(this.createBlackSmithUpgradesPanel(civName));
        } else if (upgradeBuilding === 'university') {
            template.append(this.createUniversityUpgradesPanel(civName));
        } else if (upgradeBuilding === 'monastary') {
            template.append(this.createMonestaryUpgradesPanel(civName));
        } else if (upgradeBuilding === 'dock') {
            template.append(this.createDockUpgradesPanel(civName));
        }

        return template;
    }

    private createBlackSmithUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getBlacksmithUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBlacksmithUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createUniversityUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-university"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getUniversityUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getUniversityUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createMonestaryUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-monastary"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getMonestaryUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getMonestaryUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createDockUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-dock"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getDockUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private getBlacksmithUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-bs-upgrades"></div>`).addClass('age-upgrades');

        if (age === AgeUpgrades.Castle.toLowerCase()) {
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

    private getUniversityUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-univ-upgrades"></div>`).addClass('age-upgrades');
        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Masonry}`, UniversityUpgrades.Masonry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Fortified_Wall}`, UniversityUpgrades.Fortified_Wall.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Guard_Tower}`, UniversityUpgrades.Guard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Heated_Shot}`, UniversityUpgrades.Heated_Shot.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Treadmill_Crane}`, UniversityUpgrades.Treadmill_Crane.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Architecture}`, UniversityUpgrades.Architecture.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Bombard_Tower}`, UniversityUpgrades.Bombard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Siege_Engineers}`, UniversityUpgrades.Siege_Engineers.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Keep}`, UniversityUpgrades.Keep.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Arrowslits}`, UniversityUpgrades.Arrowslits.toLowerCase()));
        }
        return groupOfIcons;
    }

    private getMonestaryUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-univ-upgrades"></div>`).addClass('age-upgrades');
        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Redemption}`, MonestaryUpgrades.Redemption.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Fervor}`, MonestaryUpgrades.Fervor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Sanctity}`, MonestaryUpgrades.Sanctity.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Atonement}`, MonestaryUpgrades.Atonement.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Herbal_Medicine}`, MonestaryUpgrades.Herbal_Medicine.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Heresy}`, MonestaryUpgrades.Heresy.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Block_Printing}`, MonestaryUpgrades.Block_Printing.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Illumination}`, MonestaryUpgrades.Illumination.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Faith}`, MonestaryUpgrades.Faith.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Theocracy}`, MonestaryUpgrades.Theocracy.toLowerCase()));
        }

        return groupOfIcons;
    }

    private getDockUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-dock-upgrades"></div>`).addClass('age-upgrades');
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Galleon}`, DockUpgrades.Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Heavy_Demolition_Ship}`, DockUpgrades.Heavy_Demolition_Ship.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Fast_Fire_Ship}`, DockUpgrades.Fast_Fire_Ship.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Cannon_Galleon}`, DockUpgrades.Cannon_Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Elite_Cannon_Galleon}`, DockUpgrades.Elite_Cannon_Galleon.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Dry_Dock}`, DockUpgrades.Dry_Dock.toLowerCase()));
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${DockUpgrades.Shipwright}`, DockUpgrades.Shipwright.toLowerCase()));
        return groupOfIcons;
    }

    private createUpgradeIcon(divId: string, upgrade: string): JQuery<HTMLElement> {
        let civName = divId.split('-')[0];
        civName = civName.charAt(0).toUpperCase().concat(civName.substring(1));
        const template = $(`<div id="${divId}"></div>`).addClass(['div-upgrade']);

        const disabledUpgrade = this.data[civName].disabled.techs.find((disabledUpgrade: string) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });
        const disabledUnit = this.data[civName].disabled.units.find((disabledUpgrade: string) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });
        const horsesDisabled = this.data[civName].disableHorses;

        if (!!disabledUpgrade) { // explicit disabled techs
            template.addClass('disabled-upgrade');
        } else if (horsesDisabled && upgrade.toLowerCase().includes('barding')) { // meso civs no horses
            template.addClass('disabled-upgrade');
        } else if (upgrade.toLowerCase().includes('war galley')) {
            upgrade = 'war galley';
        } else if (!!disabledUnit) {
            template.addClass('disabled-upgrade');
        } else if (upgrade === 'feudal' || upgrade === 'castle' || upgrade === 'imperial') {
            upgrade = upgrade.concat('.tp');
            template.addClass('no-border');
        }
        const css: any = {
            "background": `url("./images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        };


        template.css(css);
        return template;
    }
}