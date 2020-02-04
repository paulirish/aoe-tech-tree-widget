(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class AoE2Api {
    constructor() { }
    getAoE2Data() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch('https://aoe2techtree.net/data/data.json').then((response) => __awaiter(this, void 0, void 0, function* () {
                return yield response.json();
            }));
        });
    }
    getAoE2UpgradeData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fetch('https://treee.github.io/aoe-tech-tree-widget/build/aoe2/upgrades-to-disable.json').then((response) => __awaiter(this, void 0, void 0, function* () {
                return yield response.json();
            }));
        });
    }
}
exports.AoE2Api = AoE2Api;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AoE2Config {
    constructor() {
        this.civName = '';
        this.volume = 0.25;
        this.fadeOut = false;
        this.visibleDuration = 25; // use this value to show and hide in one action. this number determines how long it will be visible
        this.fadeInDuration = 2;
        this.fadeOutDuration = 2;
        this.clientId = 'tree';
        this.socketMode = false;
    }
    setConfigFromHash() {
        return this.setConfigFrom(window.location.hash.substring(1));
    }
    setConfigFromQueryString() {
        return this.setConfigFrom(window.location.search.substring(1));
    }
    setConfigFrom(string) {
        string.split('&').forEach((param) => {
            const paramKey = param.split('=')[0];
            const paramValue = param.split('=')[1];
            if (!paramValue) {
                return;
            }
            else if (paramValue === 'true' || paramValue === 'false') {
                Object.defineProperty(this, paramKey, {
                    value: paramValue === 'true',
                    writable: true
                });
            }
            else {
                Object.defineProperty(this, paramKey, {
                    value: paramValue,
                    writable: true
                });
            }
        });
        return this;
    }
}
exports.AoE2Config = AoE2Config;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class CivChangerClient {
    constructor(techTreeCivChanger, upgradeChanger, socketKey) {
        this.clientId = '';
        this.clientId = socketKey;
        this.techTreeCivChanger = techTreeCivChanger;
        this.upgradeChanger = upgradeChanger;
        this.socket = new WebSocket('wss://itsatreee.com:8443');
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onclose = this.onClose;
        this.socket.onerror = this.onError;
    }
    handleMessage(message) {
        console.log(`DataType: ${message.type} / RawData: ${JSON.stringify(message.data)}`);
        this.upgradeChanger.handleMessage(message.type, message.data);
        this.techTreeCivChanger.handleMessage(message.type, message.data);
    }
    onOpen(event) {
        console.log('[open] Connection established');
        this.socket.send(this.formatDataForWebsocket(enums_1.SocketEnums.ClientRegister, this.clientId));
    }
    onMessage(event) {
        this.handleMessage(JSON.parse(event.data));
    }
    // need to handle cwhen clients close their conenction
    onClose(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        }
        else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    }
    onError(event) {
        console.log(`[error] ${event.message}`);
    }
    formatDataForWebsocket(dataType, rawData) {
        const clientId = $('#txt-client-id').val();
        console.log('Formatting Data for websocket');
        console.log(`DataType: ${dataType} / RawData: ${rawData} / ClientId: ${clientId}`);
        return JSON.stringify({ type: dataType, data: rawData, toClientId: clientId });
    }
}
exports.CivChangerClient = CivChangerClient;

},{"../enums":8}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
class TechTreeCivChanger {
    constructor(techData, aoe2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
        this.playSound = false;
        // this.fadeIn("Berbers");
    }
    listenForUrlChanges() {
        this.aoe2Config.setConfigFromHash();
        if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
            this.fadeIn(this.aoe2Config.civName);
        }
        $(window).bind('hashchange', (event) => {
            const oldConfig = this.aoe2Config;
            // url changed!
            this.aoe2Config = this.aoe2Config.setConfigFromHash();
            if (oldConfig.civName === this.aoe2Config.civName) {
                //civ didnt change so we probably want to fade out
                if (this.aoe2Config.fadeOut) {
                    this.fadeOut(this.aoe2Config.civName);
                }
            }
            else {
                // new civ so we probably want to show it
                if (this.aoe2Config.civName && this.aoe2Config.civName !== '') {
                    this.fadeIn(this.aoe2Config.civName);
                }
            }
        });
    }
    handleMessage(socketEnum, data) {
        if (socketEnum === enums_1.SocketEnums.AdminShow) {
            this.playSound = data.playSound;
            if (data.overlays.tech) {
                this.fadeIn(data.civ);
            }
        }
        else if (socketEnum === enums_1.SocketEnums.AdminHide) {
            if (data.overlays.tech) {
                this.fadeOut(data.civ);
            }
        }
        else if (socketEnum === enums_1.SocketEnums.AdminHideAll) {
            // hide everything
            $(`#left-tech-placeholder`).removeClass('fade-in');
            $(`#left-tech-placeholder`).addClass('fade-out');
            setTimeout(() => {
                $(`#left-tech-placeholder`).remove();
            }, this.aoe2Config.fadeOutDuration * 1000);
            $(`#right-tech-placeholder`).removeClass('fade-in');
            $(`#right-tech-placeholder`).addClass('fade-out');
            setTimeout(() => {
                $(`#right-tech-placeholder`).remove();
            }, this.aoe2Config.fadeOutDuration * 1000);
        }
    }
    fadeIn(civName) {
        if (!$(`#${civName}-tech`).length) {
            const htmlElement = this.createHtmlElement(civName);
            const civKey = this.data.civs[civName];
            const civDesc = this.data.key_value[civKey];
            htmlElement.find('.civ-name').text(civName);
            htmlElement.find('.civ-desc').html(civDesc);
            htmlElement.removeClass('fade-out');
            htmlElement.addClass('fade-in');
            if (!this.aoe2Config.socketMode) {
                if (this.aoe2Config.visibleDuration) {
                    setTimeout(() => {
                        this.fadeOut(civName);
                    }, this.aoe2Config.visibleDuration * 1000);
                }
            }
            let leftOrRight = '';
            if (this.isPlaceholderEmpty('left')) { //left
                leftOrRight = 'left';
            }
            else { //right
                leftOrRight = 'right';
            }
            this.addToBody(leftOrRight, htmlElement);
        }
    }
    isPlaceholderEmpty(placeHolderId) {
        return $(`#${placeHolderId}-tech-placeholder`).children().length === 0;
    }
    fadeOut(civName) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(leftOrRight, htmlElement) {
        $(`#${leftOrRight}-tech-placeholder`).append(htmlElement);
        // $('#tech-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img-vertical']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        wrapperDiv.css({
            'background': `url("./images/civ-emblems/${civName.toLowerCase()}.png")`,
            'background-size': 'contain'
        });
        if (this.playSound) {
            const audio = $(`<audio autoplay id="myaudio"><source src="./sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
            wrapperDiv.append(audio);
            wrapperDiv.find('#myaudio')[0].volume = this.aoe2Config.volume;
        }
        const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');
        const civIcon = $(`<div></div>`).addClass('civ-icon');
        civIcon.css({
            'background': `url("./images/civ-icons/${civName.toLowerCase()}.png")`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat'
        });
        const civNameText = $('<div></div>').addClass('civ-name');
        civIconAndName.append(civIcon.clone()).append(civNameText).append(civIcon.clone());
        wrapperDiv.append(civIconAndName);
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        const uniqueUnitWrapper = $('<div></div>').addClass(['civ-unique-unit-wrapper']);
        const uniqueUnit = $('<div></div>').addClass(['civ-unique-unit', 'div-upgrade']);
        uniqueUnit.css({
            'background': `url("./images/civ-unique-units/${civName.toLowerCase()}.png")`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'transform': 'scaleX(-1)'
        });
        uniqueUnitWrapper.append(uniqueUnit);
        const eliteUpgrade = $('<div></div>').addClass('civ-elite-unique-unit-upgrade');
        const eliteUniqueUnit = uniqueUnit.clone().append(eliteUpgrade);
        eliteUniqueUnit.css({
            'transform': 'scaleX(1)'
        });
        uniqueUnitWrapper.append(eliteUniqueUnit);
        wrapperDiv.append(uniqueUnitWrapper);
        template.append(wrapperDiv);
        return template;
    }
}
exports.TechTreeCivChanger = TechTreeCivChanger;

},{"../enums":8}],5:[function(require,module,exports){
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
        else if (type === enums_1.SocketEnums.AdminHideAll) {
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
        else if (upgrade === 'feudal' || upgrade === 'castle' || upgrade === 'imperial') {
            upgrade = upgrade.concat('.tp');
            template.addClass('no-border');
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

},{"../enums":8,"./upgrade-enums":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AgeUpgrades;
(function (AgeUpgrades) {
    AgeUpgrades["Feudal"] = "Feudal";
    AgeUpgrades["Castle"] = "Castle";
    AgeUpgrades["Imp"] = "Imperial";
})(AgeUpgrades = exports.AgeUpgrades || (exports.AgeUpgrades = {}));
var BlacksmithUpgrades;
(function (BlacksmithUpgrades) {
    //feudal
    BlacksmithUpgrades["Forging"] = "Forging";
    BlacksmithUpgrades["Scale_Mail_Armor"] = "Scale Mail Armor";
    BlacksmithUpgrades["Scale_Barding_Armor"] = "Scale Barding Armor";
    BlacksmithUpgrades["Fletching"] = "Fletching";
    BlacksmithUpgrades["Padded_Archer_Armor"] = "Padded Archer Armor";
    //castle
    BlacksmithUpgrades["Iron_Casting"] = "Iron Casting";
    BlacksmithUpgrades["Chain_Mail_Armor"] = "Chain Mail Armor";
    BlacksmithUpgrades["Chain_Barding_Armor"] = "Chain Barding Armor";
    BlacksmithUpgrades["Bodkin_Arrow"] = "Bodkin Arrow";
    BlacksmithUpgrades["Leather_Archer_Armor"] = "Leather Archer Armor";
    //imp
    BlacksmithUpgrades["Blast_Furnace"] = "Blast Furnace";
    BlacksmithUpgrades["Plate_Mail_Armor"] = "Plate Mail Armor";
    BlacksmithUpgrades["Plate_Barding_Armor"] = "Plate Barding Armor";
    BlacksmithUpgrades["Bracer"] = "Bracer";
    BlacksmithUpgrades["Ring_Archer_Armor"] = "Ring Archer Armor";
})(BlacksmithUpgrades = exports.BlacksmithUpgrades || (exports.BlacksmithUpgrades = {}));
var MonestaryUpgrades;
(function (MonestaryUpgrades) {
    MonestaryUpgrades["Redemption"] = "Redemption";
    MonestaryUpgrades["Fervor"] = "Fervor";
    MonestaryUpgrades["Sanctity"] = "Sanctity";
    MonestaryUpgrades["Atonement"] = "Atonement";
    MonestaryUpgrades["Herbal_Medicine"] = "Herbal Medicine";
    MonestaryUpgrades["Heresy"] = "Heresy";
    //imp
    MonestaryUpgrades["Block_Printing"] = "Block Printing";
    MonestaryUpgrades["Illumination"] = "Illumination";
    MonestaryUpgrades["Faith"] = "Faith";
    MonestaryUpgrades["Theocracy"] = "Theocracy";
})(MonestaryUpgrades = exports.MonestaryUpgrades || (exports.MonestaryUpgrades = {}));
var UniversityUpgrades;
(function (UniversityUpgrades) {
    UniversityUpgrades["Masonry"] = "Masonry";
    UniversityUpgrades["Fortified_Wall"] = "Fortified Wall";
    UniversityUpgrades["Ballistics"] = "Ballistics";
    UniversityUpgrades["Guard_Tower"] = "Guard Tower";
    UniversityUpgrades["Heated_Shot"] = "Heated Shot";
    UniversityUpgrades["Murder_Holes"] = "Murder Holes";
    UniversityUpgrades["Treadmill_Crane"] = "Treadmill Crane";
    //imp
    UniversityUpgrades["Architecture"] = "Architecture";
    UniversityUpgrades["Chemistry"] = "Chemistry";
    UniversityUpgrades["Bombard_Tower"] = "Bombard Tower";
    UniversityUpgrades["Siege_Engineers"] = "Siege Engineers";
    UniversityUpgrades["Keep"] = "Keep";
    UniversityUpgrades["Arrowslits"] = "Arrowslits";
})(UniversityUpgrades = exports.UniversityUpgrades || (exports.UniversityUpgrades = {}));
var MiningUpgrades;
(function (MiningUpgrades) {
    //feudal
    MiningUpgrades["Stone_Mining"] = "Stone Mining";
    //castle
    MiningUpgrades["Stone_Shaft_Mining"] = "Stone Shaft Mining";
})(MiningUpgrades = exports.MiningUpgrades || (exports.MiningUpgrades = {}));
var LumberUpgrades;
(function (LumberUpgrades) {
    //feudal
    LumberUpgrades["Double_Bit_Axe"] = "Double-Bit Axe";
    //castle
    LumberUpgrades["Bow_Saw"] = "Bow Saw";
    //imp
    LumberUpgrades["Two_Man_Saw"] = "Two-Man Saw";
})(LumberUpgrades = exports.LumberUpgrades || (exports.LumberUpgrades = {}));
var MillUpgrades;
(function (MillUpgrades) {
    //faudal
    MillUpgrades["Horse_Collar"] = "Horse Collar";
    //castle
    MillUpgrades["Heavy_Plow"] = "Heavy Plow";
    //imp
    MillUpgrades["Crop_Rotation"] = "Crop Rotation";
})(MillUpgrades = exports.MillUpgrades || (exports.MillUpgrades = {}));
var SiegeUpgrades;
(function (SiegeUpgrades) {
    SiegeUpgrades["Onager"] = "Onager";
    SiegeUpgrades["Siege_Onager"] = "Siege Onager";
    SiegeUpgrades["Capped_Ram"] = "Capped Ram";
    SiegeUpgrades["Siege_Ram"] = "Siege Ram";
    SiegeUpgrades["Heavy_Scorpion"] = "Heavy Scorpion";
    SiegeUpgrades["Bombard_Cannon"] = "Bombard Cannon";
})(SiegeUpgrades = exports.SiegeUpgrades || (exports.SiegeUpgrades = {}));
var DockUpgrades;
(function (DockUpgrades) {
    //feudal
    DockUpgrades["War_Galley_Fire_Ship_and_Demolition_Ship"] = "War Galley, Fire Ship and Demolition Ship";
    //castle
    DockUpgrades["Gillnets"] = "Gillnets";
    DockUpgrades["Careening"] = "Careening";
    //imp
    DockUpgrades["Heavy_Demolition_Ship"] = "Heavy Demolition Ship";
    DockUpgrades["Fast_Fire_Ship"] = "Fast Fire Ship";
    DockUpgrades["Galleon"] = "Galleon";
    DockUpgrades["Cannon_Galleon"] = "Cannon Galleon";
    DockUpgrades["Elite_Cannon_Galleon"] = "Elite Cannon Galleon";
    DockUpgrades["Dry_Dock"] = "Dry Dock";
    DockUpgrades["Shipwright"] = "Shipwright";
})(DockUpgrades = exports.DockUpgrades || (exports.DockUpgrades = {}));
var StableUpgrades;
(function (StableUpgrades) {
    //feudal
    StableUpgrades["Bloodlines"] = "Bloodlines";
    //castle
    StableUpgrades["Light_Cavalry"] = "Light Cavalry";
    StableUpgrades["Husbandry"] = "Husbandry";
    //imp
    StableUpgrades["Hussar"] = "Hussar";
    StableUpgrades["Cavalier"] = "Cavalier";
    StableUpgrades["Paladin"] = "Paladin";
    StableUpgrades["Heavy_Camel_Rider"] = "Heavy Camel Rider";
    StableUpgrades["Imperial_Camel_Rider"] = "Imperial Camel Rider";
    StableUpgrades["Elite_Battle_Elephant"] = "Elite Battle Elephant";
    StableUpgrades["Elite_Steppe_Lancer"] = "Elite Steppe Lancer";
})(StableUpgrades = exports.StableUpgrades || (exports.StableUpgrades = {}));
var BarrackUpgrades;
(function (BarrackUpgrades) {
    //feudal
    BarrackUpgrades["Supplies"] = "Supplies";
    BarrackUpgrades["Man_at_Arms"] = "Man-at-Arms";
    //castle
    BarrackUpgrades["Squires"] = "Squires";
    BarrackUpgrades["Arson"] = "Arson";
    BarrackUpgrades["Long_Swordsman"] = "Long Swordsman";
    BarrackUpgrades["Pikeman"] = "Pikeman";
    BarrackUpgrades["Eagle_Warrior"] = "Eagle Warrior";
    //imp
    BarrackUpgrades["Two_Handed_Swordsman"] = "Two-Handed Swordsman";
    BarrackUpgrades["Champion"] = "Champion";
    BarrackUpgrades["Halberdier"] = "Halberdier";
    BarrackUpgrades["Elite_Eagle_Warrior"] = "Elite Eagle Warrior";
})(BarrackUpgrades = exports.BarrackUpgrades || (exports.BarrackUpgrades = {}));
var ArcherUpgrades;
(function (ArcherUpgrades) {
    //castle
    ArcherUpgrades["Crossbowman"] = "Crossbowman";
    ArcherUpgrades["Elite_Skirmisher"] = "Elite Skirmisher";
    ArcherUpgrades["Thumb_Ring"] = "Thumb Ring";
    //imp
    ArcherUpgrades["Arbalester"] = "Arbalester";
    ArcherUpgrades["Imperial_Skirmisher"] = "Imperial Skirmisher";
    ArcherUpgrades["Heavy_Cavalry_Archer"] = "Heavy Cavalry Archer";
    ArcherUpgrades["Elite_Genitour"] = "Elite Genitour";
    ArcherUpgrades["Parthian_Tactics"] = "Parthian Tactics";
})(ArcherUpgrades = exports.ArcherUpgrades || (exports.ArcherUpgrades = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.civUpgrades = JSON.parse(`{
    "Aztecs": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Eagle Scout",
          "Eagle Warrior",
          "Elite Eagle Warrior"
        ],
        "unique": [
          "Jaguar Warrior",
          "Elite Jaguar Warrior",
          "Atlatl",
          "Garland Wars"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Halberdier",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Galleon",
          "Heavy Scorpion",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Hoardings",
          "Ring Archer Armor",
          "Masonry",
          "Architecture",
          "Bombard Tower",
          "Keep",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Berbers": {
      "enabled": {
        "units": [
          "Genitour",
          "Elite Genitour"
        ],
        "unique": [
          "Camel Archer",
          "Elite Camel Archer",
          "Kasbah",
          "Maghrabi Camels"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower",
          "Keep"
        ],
        "units": [
          "Arbalester",
          "Halberdier",
          "Paladin",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Sanctity",
          "Block Printing",
          "Sappers",
          "Architecture",
          "Bombard Tower",
          "Keep",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "african_"
    },
    "Britons": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Atonement",
          "Heresy",
          "Bombard Tower",
          "Treadmill Crane",
          "Stone Shaft Mining",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Longbowman",
          "Elite Longbowman",
          "Yeomen",
          "Warwolf"
        ]
      }
    },
    "Bulgarians": {
      "enabled": {
        "buildings": [
          "Krepost"
        ],
        "unique": [
          "Konnik",
          "Elite Konnik",
          "Stirrups",
          "Bagains"
        ]
      },
      "disabled": {
        "buildings": [
          "Fortified Wall",
          "Bombard Tower"
        ],
        "units": [
          "Crossbowman",
          "Arbalester",
          "Hand Cannoneer",
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Bombard Cannon",
          "Fast Fire Ship",
          "Heavy Demo Ship",
          "Elite Cannon Galleon"
        ],
        "techs": [
          "Ring Archer Armor",
          "Dry Dock",
          "Shipwright",
          "Fortified Wall",
          "Treadmill Crane",
          "Arrowslits",
          "Bombard Tower",
          "Hoardings",
          "Sappers",
          "Atonement",
          "Sanctity",
          "Faith",
          "Block Printing",
          "Two-Man Saw",
          "Guilds"
        ]
      }
    },
    "Burmese": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Arambai",
          "Elite Arambai",
          "Howdah",
          "Manipur Cavalry"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Shipwright",
          "Heresy",
          "Hoardings",
          "Sappers",
          "Leather Archer Armor",
          "Ring Archer Armor",
          "Bombard Tower",
          "Arrowslits",
          "Stone Shaft Mining"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Byzantines": {
      "disabled": {
        "units": [
          "Heavy Scorpion",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Herbal Medicine",
          "Sappers",
          "Blast Furnace",
          "Masonry",
          "Architecture",
          "Siege Engineers",
          "Heated Shot",
          "Treadmill Crane"
        ]
      },
      "enabled": {
        "unique": [
          "Cataphract",
          "Elite Cataphract",
          "Greek Fire",
          "Logistica"
        ]
      }
    },
    "Celts": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Squires",
          "Bloodlines",
          "Redemption",
          "Illumination",
          "Atonement",
          "Block Printing",
          "Theocracy",
          "Ring Archer Armor",
          "Bracer",
          "Plate Barding Armor",
          "Architecture",
          "Bombard Tower",
          "Two-Man Saw",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Woad Raider",
          "Elite Woad Raider",
          "Stronghold",
          "Furor Celtica"
        ]
      }
    },
    "Chinese": {
      "disabled": {
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Parthian Tactics",
          "Heresy",
          "Hoardings",
          "Siege Engineers",
          "Treadmill Crane",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Chu Ko Nu",
          "Elite Chu Ko Nu",
          "Great Wall",
          "Rocketry"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Cumans": {
      "enabled": {
        "units": [
          "Steppe Lancer",
          "Elite Steppe Lancer"
        ],
        "unique": [
          "Kipchak",
          "Elite Kipchak",
          "Steppe Husbandry",
          "Cuman Mercenaries"
        ]
      },
      "disabled": {
        "buildings": [
          "Gate",
          "Stone Wall",
          "Fortified Wall",
          "Guard Tower",
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Heavy Camel Rider",
          "Heavy Scorpion",
          "Bombard Cannon",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Bracer",
          "Dry Dock",
          "Shipwright",
          "Fortified Wall",
          "Guard Tower",
          "Treadmill Crane",
          "Architecture",
          "Siege Engineers",
          "Keep",
          "Arrowslits",
          "Bombard Tower",
          "Illumination",
          "Block Printing",
          "Theocracy",
          "Stone Shaft Mining",
          "Husbandry"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Ethiopians": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Champion",
          "Paladin",
          "Fast Fire Ship",
          "Elite Cannon Galleon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Block Printing",
          "Hoardings",
          "Plate Barding Armor",
          "Treadmill Crane",
          "Arrowslits",
          "Bombard Tower",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Shotel Warrior",
          "Elite Shotel Warrior",
          "Royal Heirs",
          "Torsion Engines"
        ]
      },
      "monkPrefix": "african_"
    },
    "Franks": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Hussar",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Bloodlines",
          "Shipwright",
          "Redemption",
          "Atonement",
          "Sappers",
          "Ring Archer Armor",
          "Bracer",
          "Heated Shot",
          "Keep",
          "Bombard Tower",
          "Stone Shaft Mining",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Throwing Axeman",
          "Elite Throwing Axeman",
          "Chivalry",
          "Bearded Axe"
        ]
      }
    },
    "Goths": {
      "disabled": {
        "buildings": [
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Gate",
          "Stone Wall",
          "Fortified Wall"
        ],
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Dry Dock",
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Fortified Wall",
          "Redemption",
          "Atonement",
          "Block Printing",
          "Heresy",
          "Hoardings",
          "Plate Barding Armor",
          "Plate Mail Armor",
          "Siege Engineers",
          "Treadmill Crane",
          "Arrowslits",
          "Gold Shaft Mining",
          "Supplies"
        ]
      },
      "enabled": {
        "unique": [
          "Huskarl",
          "Elite Huskarl",
          "Anarchy",
          "Perfusion"
        ]
      }
    },
    "Huns": {
      "disabled": {
        "buildings": [
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Fortified Wall"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Onager",
          "Siege Onager",
          "Heavy Scorpion",
          "Bombard Cannon"
        ],
        "techs": [
          "Shipwright",
          "Guard Tower",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Herbal Medicine",
          "Block Printing",
          "Theocracy",
          "Hoardings",
          "Ring Archer Armor",
          "Plate Mail Armor",
          "Fortified Wall",
          "Heated Shot",
          "Treadmill Crane",
          "Architecture",
          "Siege Engineers",
          "Arrowslits",
          "Stone Shaft Mining",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Tarkan",
          "Elite Tarkan",
          "Marauders",
          "Atheism"
        ]
      }
    },
    "Incas": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Slinger"
        ],
        "unique": [
          "Kamayuk",
          "Elite Kamayuk",
          "Andean Sling",
          "Couriers"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Atonement",
          "Fervor",
          "Architecture",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Indians": {
      "enabled": {
        "units": [
          "Imperial Camel Rider"
        ],
        "unique": [
          "Elephant Archer",
          "Elite Elephant Archer",
          "Sultans",
          "Shatagni"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Knight",
          "Cavalier",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Scorpion",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Atonement",
          "Heresy",
          "Sappers",
          "Plate Mail Armor",
          "Architecture",
          "Arrowslits",
          "Treadmill Crane",
          "Crop Rotation"
        ]
      },
      "monkPrefix": "african_"
    },
    "Italians": {
      "enabled": {
        "units": [
          "Condottiero"
        ],
        "unique": [
          "Genoese Crossbowman",
          "Elite Genoese Crossbowman",
          "Pavise",
          "Silk Road"
        ]
      },
      "disabled": {
        "units": [
          "Heavy Cav Archer",
          "Halberdier",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Heavy Scorpion",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Heresy",
          "Sappers",
          "Siege Engineers",
          "Gold Shaft Mining"
        ]
      }
    },
    "Japanese": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Heresy",
          "Hoardings",
          "Sappers",
          "Plate Barding Armor",
          "Architecture",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Samurai",
          "Elite Samurai",
          "Yasama",
          "Kataparuto"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Khmer": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Ballista Elephant",
          "Elite Ballista Elephant",
          "Tusk Swords",
          "Double Crossbow"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Champion",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Onager"
        ],
        "techs": [
          "Thumb Ring",
          "Squires",
          "Bombard Tower",
          "Atonement",
          "Heresy",
          "Block Printing",
          "Shipwright",
          "Plate Mail Armor",
          "Arrowslits",
          "Two-Man Saw",
          "Guilds"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Koreans": {
      "enabled": {
        "units": [
          "Turtle Ship",
          "Elite Turtle Ship"
        ],
        "unique": [
          "War Wagon",
          "Elite War Wagon",
          "Panokseon",
          "Shinkichon"
        ]
      },
      "disabled": {
        "units": [
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Demolition Raft",
          "Demolition Ship",
          "Heavy Demo Ship",
          "Siege Ram",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Redemption",
          "Atonement",
          "Heresy",
          "Illumination",
          "Hoardings",
          "Sappers",
          "Blast Furnace",
          "Plate Barding Armor",
          "Crop Rotation"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Lithuanians": {
      "disabled": {
        "units": [
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Parthian Tactics",
          "Plate Mail Armor",
          "Shipwright",
          "Siege Engineers",
          "Arrowslits",
          "Sappers",
          "Gold Shaft Mining"
        ]
      },
      "enabled": {
        "unique": [
          "Leitis",
          "Elite Leitis",
          "Hill Forts",
          "Tower Shields"
        ]
      }
    },
    "Magyars": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower",
          "Fortified Wall"
        ],
        "units": [
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Squires",
          "Keep",
          "Bombard Tower",
          "Fortified Wall",
          "Redemption",
          "Atonement",
          "Faith",
          "Plate Mail Armor",
          "Architecture",
          "Arrowslits",
          "Stone Shaft Mining",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Magyar Huszar",
          "Elite Magyar Huszar",
          "Corvinian Army",
          "Recurve Bow"
        ]
      }
    },
    "Malay": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant"
        ],
        "unique": [
          "Karambit Warrior",
          "Elite Karambit Warrior",
          "Thalassocracy",
          "Forced Levy"
        ]
      },
      "disabled": {
        "buildings": [
          "Fortified Wall"
        ],
        "units": [
          "Hand Cannoneer",
          "Heavy Cav Archer",
          "Champion",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Heavy Demo Ship",
          "Siege Ram",
          "Siege Onager"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Fortified Wall",
          "Fervor",
          "Theocracy",
          "Hoardings",
          "Chain Barding Armor",
          "Plate Barding Armor",
          "Architecture",
          "Arrowslits",
          "Treadmill Crane",
          "Two-Man Saw"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Malians": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Halberdier",
          "Hussar",
          "Paladin",
          "Galleon",
          "Elite Cannon Galleon",
          "Siege Ram",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Bombard Tower",
          "Bracer",
          "Illumination",
          "Blast Furnace",
          "Siege Engineers",
          "Arrowslits",
          "Two-Man Saw"
        ]
      },
      "enabled": {
        "unique": [
          "Gbeto",
          "Elite Gbeto",
          "Tigui",
          "Farimba"
        ]
      },
      "monkPrefix": "african_"
    },
    "Mayans": {
      "disableHorses": true,
      "enabled": {
        "units": [
          "Eagle Scout",
          "Eagle Warrior",
          "Elite Eagle Warrior"
        ],
        "unique": [
          "Plumed Archer",
          "Elite Plumed Archer",
          "Obsidian Arrows",
          "El Dorado"
        ]
      },
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Champion",
          "Cannon Galleon",
          "Elite Cannon Galleon",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Siege Engineers",
          "Arrowslits",
          "Gold Shaft Mining"
        ]
      },
      "monkPrefix": "meso_"
    },
    "Mongols": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Halberdier",
          "Paladin",
          "Elite Cannon Galleon",
          "Bombard Cannon"
        ],
        "techs": [
          "Dry Dock",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Sanctity",
          "Block Printing",
          "Theocracy",
          "Ring Archer Armor",
          "Plate Barding Armor",
          "Architecture",
          "Heated Shot",
          "Treadmill Crane",
          "Arrowslits",
          "Two-Man Saw",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Mangudai",
          "Elite Mangudai",
          "Nomads",
          "Drill"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Persians": {
      "disabled": {
        "buildings": [
          "Fortified Wall",
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Two-Handed Swordsman",
          "Champion",
          "Siege Onager"
        ],
        "techs": [
          "Shipwright",
          "Fortified Wall",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Illumination",
          "Atonement",
          "Heresy",
          "Sanctity",
          "Bracer",
          "Siege Engineers",
          "Arrowslits",
          "Treadmill Crane"
        ]
      },
      "enabled": {
        "unique": [
          "War Elephant",
          "Elite War Elephant",
          "Kamandaran",
          "Mahouts"
        ]
      },
      "monkPrefix": "african_"
    },
    "Portuguese": {
      "enabled": {
        "buildings": [
          "Feitoria"
        ],
        "units": [
          "Caravel",
          "Elite Caravel"
        ],
        "unique": [
          "Organ Gun",
          "Elite Organ Gun",
          "Carrack",
          "Arquebus"
        ]
      },
      "disabled": {
        "units": [
          "Heavy Cav Archer",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fast Fire Ship",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Squires",
          "Shipwright",
          "Illumination",
          "Hoardings",
          "Arrowslits",
          "Gold Shaft Mining"
        ]
      }
    },
    "Saracens": {
      "disabled": {
        "buildings": [
          "Bombard Tower"
        ],
        "units": [
          "Halberdier",
          "Cavalier",
          "Paladin",
          "Fast Fire Ship",
          "Heavy Scorpion"
        ],
        "techs": [
          "Shipwright",
          "Bombard Tower",
          "Sappers",
          "Architecture",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds",
          "Crop Rotation"
        ]
      },
      "enabled": {
        "unique": [
          "Mameluke",
          "Elite Mameluke",
          "Madrasah",
          "Zealotry"
        ]
      },
      "monkPrefix": "african_"
    },
    "Slavs": {
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Arbalester",
          "Hand Cannoneer",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Elite Cannon Galleon",
          "Heavy Demo Ship",
          "Bombard Cannon"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Heresy",
          "Bracer",
          "Architecture",
          "Arrowslits",
          "Heated Shot",
          "Stone Shaft Mining",
          "Guilds"
        ]
      },
      "enabled": {
        "unique": [
          "Boyar",
          "Elite Boyar",
          "Orthodoxy",
          "Druzhina"
        ]
      }
    },
    "Spanish": {
      "enabled": {
        "units": [
          "Missionary"
        ],
        "unique": [
          "Conquistador",
          "Elite Conquistador",
          "Inquisition",
          "Supremacy"
        ]
      },
      "disabled": {
        "units": [
          "Crossbowman",
          "Arbalester",
          "Camel Rider",
          "Heavy Camel Rider",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Siege Engineers",
          "Heated Shot",
          "Treadmill Crane",
          "Gold Shaft Mining",
          "Crop Rotation"
        ]
      }
    },
    "Tatars": {
      "enabled": {
        "units": [
          "Steppe Lancer",
          "Elite Steppe Lancer"
        ],
        "unique": [
          "Keshik",
          "Elite Keshik",
          "Silk Armor",
          "Timurid Siegecraft"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep"
        ],
        "units": [
          "Arbalester",
          "Champion",
          "Halberdier",
          "Paladin",
          "Siege Onager",
          "Bombard Cannon",
          "Heavy Demo Ship"
        ],
        "techs": [
          "Chain Mail Armor",
          "Plate Mail Armor",
          "Shipwright",
          "Architecture",
          "Keep",
          "Arrowslits",
          "Hoardings",
          "Redemption",
          "Heresy",
          "Sanctity",
          "Faith",
          "Theocracy",
          "Stone Shaft Mining",
          "Two-Man Saw"
        ]
      }
    },
    "Teutons": {
      "disabled": {
        "units": [
          "Arbalester",
          "Heavy Cav Archer",
          "Light Cavalry",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Elite Cannon Galleon",
          "Siege Ram"
        ],
        "techs": [
          "Thumb Ring",
          "Parthian Tactics",
          "Husbandry",
          "Dry Dock",
          "Shipwright",
          "Bracer",
          "Architecture",
          "Gold Shaft Mining"
        ]
      },
      "enabled": {
        "unique": [
          "Teutonic Knight",
          "Elite Teutonic Knight",
          "Ironclad",
          "Crenellations"
        ]
      }
    },
    "Turks": {
      "disabled": {
        "units": [
          "Arbalester",
          "Elite Skirmisher",
          "Pikeman",
          "Halberdier",
          "Paladin",
          "Fast Fire Ship",
          "Onager",
          "Siege Onager"
        ],
        "techs": [
          "Herbal Medicine",
          "Illumination",
          "Block Printing",
          "Stone Shaft Mining",
          "Crop Rotation",
          "Siege Engineers"
        ]
      },
      "enabled": {
        "unique": [
          "Janissary",
          "Elite Janissary",
          "Sipahi",
          "Artillery"
        ]
      },
      "monkPrefix": "african_"
    },
    "Vietnamese": {
      "enabled": {
        "units": [
          "Battle Elephant",
          "Elite Battle Elephant",
          "Imperial Skirmisher"
        ],
        "unique": [
          "Rattan Archer",
          "Elite Rattan Archer",
          "Chatras",
          "Paper Money"
        ]
      },
      "disabled": {
        "units": [
          "Hand Cannoneer",
          "Hussar",
          "Paladin",
          "Camel Rider",
          "Heavy Camel Rider",
          "Fast Fire Ship",
          "Siege Ram",
          "Siege Onager",
          "Heavy Scorpion"
        ],
        "techs": [
          "Parthian Tactics",
          "Shipwright",
          "Redemption",
          "Heresy",
          "Fervor",
          "Blast Furnace",
          "Masonry",
          "Architecture",
          "Gold Shaft Mining"
        ]
      },
      "monkPrefix": "asian_"
    },
    "Vikings": {
      "enabled": {
        "units": [
          "Longboat",
          "Elite Longboat"
        ],
        "unique": [
          "Berserk",
          "Elite Berserk",
          "Chieftains",
          "Berserkergang"
        ]
      },
      "disabled": {
        "buildings": [
          "Keep",
          "Bombard Tower"
        ],
        "units": [
          "Hand Cannoneer",
          "Heavy Cav Archer",
          "Halberdier",
          "Hussar",
          "Camel Rider",
          "Heavy Camel Rider",
          "Paladin",
          "Fire Galley",
          "Fire Ship",
          "Fast Fire Ship",
          "Siege Onager",
          "Bombard Cannon"
        ],
        "techs": [
          "Parthian Tactics",
          "Bloodlines",
          "Husbandry",
          "Shipwright",
          "Keep",
          "Bombard Tower",
          "Redemption",
          "Herbal Medicine",
          "Sanctity",
          "Illumination",
          "Theocracy",
          "Plate Barding Armor",
          "Stone Shaft Mining",
          "Guilds"
        ]
      }
    }
  }`);

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEnums;
(function (SocketEnums) {
    SocketEnums[SocketEnums["ClientRegister"] = 0] = "ClientRegister";
    SocketEnums[SocketEnums["AdminHide"] = 1] = "AdminHide";
    SocketEnums[SocketEnums["AdminShow"] = 2] = "AdminShow";
    SocketEnums[SocketEnums["AdminShowCiv"] = 3] = "AdminShowCiv";
    SocketEnums[SocketEnums["AdminHideCiv"] = 4] = "AdminHideCiv";
    SocketEnums[SocketEnums["AdminShowAll"] = 5] = "AdminShowAll";
    SocketEnums[SocketEnums["AdminHideAll"] = 6] = "AdminHideAll";
    SocketEnums[SocketEnums["AdminShowTech"] = 7] = "AdminShowTech";
    SocketEnums[SocketEnums["AdminHideTech"] = 8] = "AdminHideTech";
    SocketEnums[SocketEnums["AdminShowBlacksmith"] = 9] = "AdminShowBlacksmith";
    SocketEnums[SocketEnums["AdminHideBlacksmith"] = 10] = "AdminHideBlacksmith";
    SocketEnums[SocketEnums["AdminShowUniversity"] = 11] = "AdminShowUniversity";
    SocketEnums[SocketEnums["AdminHideUniversity"] = 12] = "AdminHideUniversity";
    SocketEnums[SocketEnums["AdminShowMonastary"] = 13] = "AdminShowMonastary";
    SocketEnums[SocketEnums["AdminHideMonastary"] = 14] = "AdminHideMonastary";
    SocketEnums[SocketEnums["AdminShowDock"] = 15] = "AdminShowDock";
    SocketEnums[SocketEnums["AdminHideDock"] = 16] = "AdminHideDock";
})(SocketEnums = exports.SocketEnums || (exports.SocketEnums = {}));
var OverlayEnums;
(function (OverlayEnums) {
    OverlayEnums["All"] = "all";
    OverlayEnums["Tech"] = "tech";
    OverlayEnums["Blacksmith"] = "blacksmith";
    OverlayEnums["University"] = "university";
    OverlayEnums["Monastary"] = "monastary";
    OverlayEnums["Dock"] = "dock";
    OverlayEnums["Sound"] = "sound";
})(OverlayEnums = exports.OverlayEnums || (exports.OverlayEnums = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_client_1 = require("./aoe2/civ-changer-client");
const aoe2_config_1 = require("./aoe2/aoe2-config");
const aoe2_api_1 = require("./aoe2/aoe2-api");
const tech_tree_civ_changer_1 = require("./aoe2/tech-tree-civ-changer");
const upgrade_changer_1 = require("./aoe2/upgrade-changer");
const upgrade_info_1 = require("./aoe2/upgrade-info");
let civChanger;
let upgradeChanger;
const aoe2Api = new aoe2_api_1.AoE2Api();
const aoe2Config = new aoe2_config_1.AoE2Config();
Promise.all([aoe2Api.getAoE2Data()]).then((results) => {
    aoe2Config.setConfigFromQueryString();
    civChanger = new tech_tree_civ_changer_1.TechTreeCivChanger(results[0], aoe2Config);
    upgradeChanger = new upgrade_changer_1.UpgradeChanger(upgrade_info_1.civUpgrades, aoe2Config);
    civChanger.listenForUrlChanges();
    if (aoe2Config.socketMode) {
        new civ_changer_client_1.CivChangerClient(civChanger, upgradeChanger, aoe2Config.clientId);
    }
});

},{"./aoe2/aoe2-api":1,"./aoe2/aoe2-config":2,"./aoe2/civ-changer-client":3,"./aoe2/tech-tree-civ-changer":4,"./aoe2/upgrade-changer":5,"./aoe2/upgrade-info":7}]},{},[9]);
