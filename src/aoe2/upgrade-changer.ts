import { AoE2Config } from "./aoe2-config";
import { BlacksmithUpgrades, AgeUpgrades, UniversityUpgrades, MonestaryUpgrades, DockUpgrades, BarrackUpgrades, StableUpgrades, ArcherRangeUpgrades, SiegeUpgrades } from "./upgrade-enums";
import { SocketEnums, OverlayEnums } from "../enums";

export class UpgradeChanger {
    data: any;
    aoe2Config: AoE2Config;
    playSound: boolean;

    constructor(upgradeData: any, aoe2Config: AoE2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.playSound = false;
    }

    private fadeInAll(civName: string, overlayData: any) {
        let leftOrRight = '';
        if (this.isPlaceholderEmpty('left')) {//left
            leftOrRight = 'left';
        } else { //right
            leftOrRight = 'right';
        }
        const timeoutWait = 2500 / Object.keys(overlayData).length;
        Object.keys(overlayData).forEach((key, index) => {
            if (overlayData[key]) {
                setTimeout(() => {
                    this.fadeIn(civName, key, leftOrRight);
                }, 100 + (timeoutWait * index));
            }
        });
    }

    private fadeOutAll(civName: string, overlayData: any) {
        const timeoutWait = 2500 / Object.keys(overlayData).length;
        Object.keys(overlayData).forEach((key, index) => {
            if (overlayData[key]) {
                setTimeout(() => {
                    this.fadeOut(civName, key);
                }, 50 + (timeoutWait * index));
            }
        });
    }

    public handleMessage(type: SocketEnums, rawData: any) {
        if (type === SocketEnums.AdminHide) {
            const data = rawData;
            if (data.overlays.all) {
                this.fadeOutAll(data.civ, data.overlays);
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
            this.playSound = data.playSound;
            if (data.overlays.all) {
                this.fadeInAll(data.civ, data.overlays);
            } else {
                Object.keys(data.overlays).forEach((key) => {
                    if (data.overlays[key] && key !== OverlayEnums.Tech && key !== OverlayEnums.All) {
                        this.fadeIn(data.civ, key, leftOrRight);
                    }
                });
            }
        } else if (type === SocketEnums.AdminHideAll) {
            const data = rawData;
            // hide eerything
            const overlays = data.overlays.overlays; // this is doubled because we hacked this functionality at the last minute. find a way to fix
            data.civ.forEach((civ: string) => {
                Object.keys(overlays).forEach((key) => {
                    if (overlays[key] && key !== OverlayEnums.Tech && key !== OverlayEnums.All) {
                        this.fadeOut(civ, key);
                    }
                });
            });
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
        const htmlElement = $(`#${id}`);
        const parentToHide = htmlElement.parent();
        parentToHide.removeClass('fade-in-left-to-right');
        parentToHide.addClass('fade-out-right-to-left');
        setTimeout(() => {
            htmlElement.remove();
            parentToHide.remove();
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

        const uniqueUnitIcon = $(`<div></div>`).addClass(['div-upgrade']);
        uniqueUnitIcon.css({
            "background-image": `url('./images/civ-unique-units/${civName.toLowerCase()}.tp.png')`,
            "border-radius": "0.3rem"
        });

        template.append(uniqueUnitIcon);
        if (upgradeBuilding === OverlayEnums.Blacksmith) {
            template.append(this.createBlackSmithUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums.University) {
            template.append(this.createUniversityUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums.Monastary) {
            template.append(this.createMonestaryUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums.Dock) {
            template.append(this.createDockUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums.Barracks) {
            template.append(this.createBarracksUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums.Stable) {
            template.append(this.createStableUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums["Archery-Range"]) {
            template.append(this.createArcheryRangeUpgradesPanel(civName));
        } else if (upgradeBuilding === OverlayEnums["Siege-Workshop"]) {
            template.append(this.createSiegeUpgradesPanel(civName));
        }

        // if (this.playSound) {
        //     const audio = $(`<audio autoplay id="myaudio"><source src="./sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        //     template.append(audio);
        //     (template.find('#myaudio')[0] as HTMLAudioElement).volume = this.aoe2Config.volume;
        // }

        return template;
    }

    private createSiegeUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-siege-workshop"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getSiegeUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createArcheryRangeUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-archery-range"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getArcheryRangeUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getArcheryRangeUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createStableUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-stable"></div>`).addClass(['div-upgrade-background']);
        template.css({
            'flex-direction': 'row'
        });
        template.append(this.getStableUpgradesByAge(civName, AgeUpgrades.Feudal.toLowerCase()));
        template.append(this.getStableUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getStableUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
        return template;
    }

    private createBarracksUpgradesPanel(civName: string): JQuery<HTMLElement> {
        const template = $(`<div id="${civName.toLowerCase()}-upgrades-barracks"></div>`).addClass(['div-upgrade-background']);
        template.append(this.getBarracksUpgradesByAge(civName, AgeUpgrades.Castle.toLowerCase()));
        template.append(this.getBarracksUpgradesByAge(civName, AgeUpgrades.Imp.toLowerCase()));
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

    private getSiegeUpgradesByAge(civName: string, age: string): JQuery<HTMLElement> {
        const civ = civName.toLowerCase();
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-siege-upgrades"></div>`)

        if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Onager}`, SiegeUpgrades.Onager.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Siege_Onager}`, SiegeUpgrades.Siege_Onager.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Capped_Ram}`, SiegeUpgrades.Capped_Ram.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Siege_Ram}`, SiegeUpgrades.Siege_Ram.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Heavy_Scorpion}`, SiegeUpgrades.Heavy_Scorpion.toLowerCase()));
            // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${SiegeUpgrades.Bombard_Cannon}`, SiegeUpgrades.Bombard_Cannon.toLowerCase()));
        }
        return groupOfIcons;
    }

    private getArcheryRangeUpgradesByAge(civName: string, age: string): JQuery<HTMLElement> {
        const civ = civName.toLowerCase();
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-archery-range-upgrades"></div>`);

        // add genitours for bulgarians maybe??

        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Elite_Skirmisher}`, ArcherRangeUpgrades.Elite_Skirmisher.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Crossbowman}`, ArcherRangeUpgrades.Crossbowman.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Thumb_Ring}`, ArcherRangeUpgrades.Thumb_Ring.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Arbalester}`, ArcherRangeUpgrades.Arbalester.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Heavy_Cavalry_Archer}`, ArcherRangeUpgrades.Heavy_Cavalry_Archer.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Parthian_Tactics}`, ArcherRangeUpgrades.Parthian_Tactics.toLowerCase()));

            if (civ === 'vietnamese') {
                groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${ArcherRangeUpgrades.Imperial_Skirmisher}`, ArcherRangeUpgrades.Imperial_Skirmisher.toLowerCase()));
            }
        }
        return groupOfIcons;
    }

    private getStableUpgradesByAge(civName: string, age: string): JQuery<HTMLElement> {
        const civ = civName.toLowerCase();
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-stable-upgrades"></div>`);

        if (age === AgeUpgrades.Feudal.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Bloodlines}`, StableUpgrades.Bloodlines.toLowerCase()));
        }
        else if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Light_Cavalry}`, StableUpgrades.Light_Cavalry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            // some dont have kts
            // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            // some dont have camels
            // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));

            if (this.hasLancers(civ)) {
                // some have lancers
                // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            }
            if (this.hasElephants(civ)) {
                // some have elephatys
                // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            }
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.css({
                'width': '9rem'
            });
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Hussar}`, StableUpgrades.Hussar.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Cavalier}`, StableUpgrades.Cavalier.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Paladin}`, StableUpgrades.Paladin.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Heavy_Camel_Rider}`, StableUpgrades.Heavy_Camel_Rider.toLowerCase()));

            if (civ === 'indians') {
                groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Imperial_Camel_Rider}`, StableUpgrades.Imperial_Camel_Rider.toLowerCase()));
            }

            if (this.hasLancers(civ)) {
                // some have lancers
                // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            }
            if (this.hasElephants(civ)) {
                // some have elephatys
                // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${StableUpgrades.Husbandry}`, StableUpgrades.Husbandry.toLowerCase()));
            }
        }
        return groupOfIcons;
    }

    private getBarracksUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-barracks-upgrades"></div>`);

        if (age === AgeUpgrades.Feudal.toLowerCase() && (civ.toLowerCase() === 'goths')) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            if (civ.toLowerCase() === 'goths') {
                groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Supplies}`, BarrackUpgrades.Supplies.toLowerCase()));
            }
        }
        else if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Pikeman}`, BarrackUpgrades.Pikeman.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Squires}`, BarrackUpgrades.Squires.toLowerCase()));
            if (this.isMesoCiv(civ)) {
                groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Eagle_Warrior}`, BarrackUpgrades.Eagle_Warrior.toLowerCase()));
            }
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Two_Handed_Swordsman}`, BarrackUpgrades.Two_Handed_Swordsman.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Champion}`, BarrackUpgrades.Champion.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Halberdier}`, BarrackUpgrades.Halberdier.toLowerCase()));
            if (this.isMesoCiv(civ)) {
                groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Elite_Eagle_Warrior}`, BarrackUpgrades.Elite_Eagle_Warrior.toLowerCase()));
            }
            if (civ.toLowerCase() === 'italians') {
                // groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BarrackUpgrades.Con}`, BarrackUpgrades.Con.toLowerCase()));        
            }
        }
        return groupOfIcons;
    }

    private getBlacksmithUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-bs-upgrades"></div>`);

        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Iron_Casting}`, BlacksmithUpgrades.Iron_Casting.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Chain_Mail_Armor}`, BlacksmithUpgrades.Chain_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Chain_Barding_Armor}`, BlacksmithUpgrades.Chain_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Bodkin_Arrow}`, BlacksmithUpgrades.Bodkin_Arrow.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Leather_Archer_Armor}`, BlacksmithUpgrades.Leather_Archer_Armor.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Blast_Furnace}`, BlacksmithUpgrades.Blast_Furnace.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Plate_Mail_Armor}`, BlacksmithUpgrades.Plate_Mail_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Plate_Barding_Armor}`, BlacksmithUpgrades.Plate_Barding_Armor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Bracer}`, BlacksmithUpgrades.Bracer.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${BlacksmithUpgrades.Ring_Archer_Armor}`, BlacksmithUpgrades.Ring_Archer_Armor.toLowerCase()));
        }

        return groupOfIcons;
    }

    private getUniversityUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-univ-upgrades"></div>`);
        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Masonry}`, UniversityUpgrades.Masonry.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Fortified_Wall}`, UniversityUpgrades.Fortified_Wall.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Guard_Tower}`, UniversityUpgrades.Guard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Heated_Shot}`, UniversityUpgrades.Heated_Shot.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Treadmill_Crane}`, UniversityUpgrades.Treadmill_Crane.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Architecture}`, UniversityUpgrades.Architecture.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Bombard_Tower}`, UniversityUpgrades.Bombard_Tower.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Siege_Engineers}`, UniversityUpgrades.Siege_Engineers.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Keep}`, UniversityUpgrades.Keep.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${UniversityUpgrades.Arrowslits}`, UniversityUpgrades.Arrowslits.toLowerCase()));
        }
        return groupOfIcons;
    }

    private getMonestaryUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-monastary-upgrades"></div>`)
        if (age === AgeUpgrades.Castle.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Redemption}`, MonestaryUpgrades.Redemption.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Fervor}`, MonestaryUpgrades.Fervor.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Sanctity}`, MonestaryUpgrades.Sanctity.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Atonement}`, MonestaryUpgrades.Atonement.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Herbal_Medicine}`, MonestaryUpgrades.Herbal_Medicine.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Heresy}`, MonestaryUpgrades.Heresy.toLowerCase()));
        }
        else if (age === AgeUpgrades.Imp.toLowerCase()) {
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Block_Printing}`, MonestaryUpgrades.Block_Printing.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Illumination}`, MonestaryUpgrades.Illumination.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Faith}`, MonestaryUpgrades.Faith.toLowerCase()));
            groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${MonestaryUpgrades.Theocracy}`, MonestaryUpgrades.Theocracy.toLowerCase()));
        }

        return groupOfIcons;
    }

    private getDockUpgradesByAge(civ: string, age: string): JQuery<HTMLElement> {
        const groupOfIcons = $(`<div id="${civ.toLowerCase()}-${age}-dock-upgrades"></div>`);
        groupOfIcons.css({
            'width': '16rem'
        });
        groupOfIcons.append(this.createUpgradeIcon(`${civ.toLowerCase()}-${age}`, age).addClass('age-image-blend'));
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
        if (!!disabledUpgrade) { // explicit disabled techs
            template.addClass('disabled-upgrade');
        }

        const disabledUnit = this.data[civName].disabled.units.find((disabledUpgrade: string) => {
            return disabledUpgrade.toLowerCase() === upgrade;
        });
        if (!!disabledUnit) {
            template.addClass('disabled-upgrade');
        }
        const horsesDisabled = this.data[civName].disableHorses;

        if (horsesDisabled && upgrade.toLowerCase().includes('barding')) { // meso civs no horses
            template.addClass('disabled-upgrade');
        } else if (upgrade.toLowerCase().includes('war galley')) {
            upgrade = 'war galley';
        } else if (upgrade === 'feudal' || upgrade === 'castle' || upgrade === 'imperial') {
            upgrade = upgrade.concat('.tp');
            template.addClass('no-border');
        } else if (upgrade === 'heavy demolition ship') {
            upgrade = 'heavy demo ship';
        } else if (upgrade === 'heavy camel rider') {
            upgrade = 'heavy camel';
        } else if (upgrade === 'imperial camel rider') {
            upgrade = 'imperial camel';
        } else if (upgrade === 'heavy cavalry archer') {
            upgrade = 'heavy cav archer';
        }
        const css: any = {
            "background": `url("./images/upgrade-icons/${upgrade}.png")`,
            "background-size": "contain",
            "background-repeat": "no-repeat",
        };


        template.css(css);
        return template;
    }

    private hasElephants(civName: string): boolean {
        return ['burmese', 'malay', 'vietnamese', 'khmer'].includes(civName.toLowerCase());
    }

    private hasLancers(civName: string): boolean {
        return ['cumans', 'tatars'].includes(civName);
    }

    private isMesoCiv(civName: string): boolean {
        return ['aztecs', 'incas', 'mayans'].includes(civName.toLowerCase());
    }
}