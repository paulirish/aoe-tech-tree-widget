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
        console.log(`DataType: ${message.type} / RawData: ${message.data}`);
        if (message.type === enums_1.SocketEnums.AdminShowCiv) {
            this.techTreeCivChanger.fadeIn(message.data);
        }
        else if (message.type === enums_1.SocketEnums.AdminHideCiv) {
            this.techTreeCivChanger.fadeOut(message.data);
        }
    }
    showCiv() {
        this.techTreeCivChanger.fadeIn("Aztecs");
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

},{"../enums":7}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TechTreeCivChanger {
    constructor(techData, aoe2Config) {
        this.data = techData;
        this.aoe2Config = aoe2Config;
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
    fadeIn(civName) {
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
        this.addToBody(htmlElement);
    }
    fadeOut(civName) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(htmlElement) {
        $('#tech-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img']);
        const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        wrapperDiv.css({
            'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/${civName.toLowerCase()}.png")`,
            'background-size': 'contain'
        });
        const audio = $(`<audio autoplay id="myaudio"><source src="https://treee.github.io/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        wrapperDiv.append(audio);
        wrapperDiv.find('#myaudio')[0].volume = this.aoe2Config.volume;
        const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');
        const civIcon = $(`<div></div>`).addClass('civ-icon');
        civIcon.css({
            'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-icons/${civName.toLowerCase()}.png")`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat'
        });
        const civNameText = $('<div></div>').addClass('civ-name');
        civIconAndName.append(civIcon.clone()).append(civNameText).append(civIcon.clone());
        wrapperDiv.append(civIconAndName);
        wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        template.append(wrapperDiv);
        return template;
    }
}
exports.TechTreeCivChanger = TechTreeCivChanger;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const upgrade_enums_1 = require("./upgrade-enums");
class UpgradeChanger {
    constructor(upgradeData, aoe2Config) {
        this.data = upgradeData;
        this.aoe2Config = aoe2Config;
        this.addToBody(this.createBlackSmithUpgradesPanel("Aztecs"));
    }
    fadeIn(civName) {
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
        this.addToBody(htmlElement);
    }
    fadeOut(civName) {
        const htmlElement = $(`#${civName}-tech`);
        htmlElement.removeClass('fade-in');
        htmlElement.addClass('fade-out');
        setTimeout(() => {
            htmlElement.remove();
        }, this.aoe2Config.fadeOutDuration * 1000);
    }
    addToBody(htmlElement) {
        $('#upgrade-overlay-wrapper').append(htmlElement);
    }
    clearTemplate() {
        $('#civ-name').text('');
        $('#civ-desc').html('');
    }
    createHtmlElement(civName) {
        const template = $(`<div id="${civName}-tech"></div>`).addClass(['div-background', 'mask-img']);
        // const wrapperDiv = $('<div id="wrapper"></div>').addClass('div-wrapper');
        // wrapperDiv.css({
        //     'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-emblems/${civName.toLowerCase()}.png")`,
        //     'background-size': 'contain'
        // });
        // const audio = $(`<audio autoplay id="myaudio"><source src="https://treee.github.io/aoe-tech-tree-widget/build/sounds/${civName}.mp3" type="audio/mp3"/></audio>`);
        // wrapperDiv.append(audio);
        // (wrapperDiv.find('#myaudio')[0] as HTMLAudioElement).volume = this.aoe2Config.volume;
        // const civIconAndName = $('<div></div>').addClass('civ-icon-and-name');
        // const civIcon = $(`<div></div>`).addClass('civ-icon');
        // civIcon.css({
        //     'background': `url("https://treee.github.io/aoe-tech-tree-widget/build/images/civ-icons/${civName.toLowerCase()}.png")`,
        //     'background-size': 'contain',
        //     'background-repeat': 'no-repeat'
        // });
        // const civNameText = $('<div></div>').addClass('civ-name');
        // civIconAndName.append(civIcon.clone()).append(civNameText).append(civIcon.clone());
        // wrapperDiv.append(civIconAndName);
        // wrapperDiv.append($('<div></div>').addClass('civ-desc'));
        // template.append(wrapperDiv);
        return template;
    }
    createBlackSmithUpgradesPanel(civName) {
        const template = $(`<div id="${civName}-upgrades-blacksmith"></div>`).addClass(['div-upgrade-background']);
        let counter = 0;
        const numIconsPerLine = 5;
        let ageUp = 0;
        const ages = ['feudal', 'castle', 'imperial'];
        let ageUpDiv = $('<div id="feudal"></div>').addClass('age-upgrades');
        template.append(this.createUpgradeIcon(`${civName}-${ages[ageUp]}`, ages[ageUp]));
        Object.values(upgrade_enums_1.BlacksmithUpgrades).forEach((upgrade) => {
            const blacksmithId = `${civName}-upgrade-blacksmith`;
            ageUpDiv.append(this.createUpgradeIcon(blacksmithId, upgrade.toLowerCase()));
            if (++counter % numIconsPerLine === 0) {
                ageUp++;
                template.append(ageUpDiv);
                template.append($('<br>'));
                if (ageUp < ages.length) {
                    ageUpDiv = $(`<div id=${ages[ageUp]}></div>`).addClass('age-upgrades');
                    ageUpDiv.append(this.createUpgradeIcon(`${civName}-${ages[ageUp]}`, ages[ageUp]));
                }
            }
        });
        return template;
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

},{"./upgrade-enums":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var SocketEnums;
(function (SocketEnums) {
    SocketEnums[SocketEnums["ClientRegister"] = 0] = "ClientRegister";
    SocketEnums[SocketEnums["AdminShowCiv"] = 1] = "AdminShowCiv";
    SocketEnums[SocketEnums["AdminHideCiv"] = 2] = "AdminHideCiv";
})(SocketEnums = exports.SocketEnums || (exports.SocketEnums = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_client_1 = require("./aoe2/civ-changer-client");
const aoe2_config_1 = require("./aoe2/aoe2-config");
const aoe2_api_1 = require("./aoe2/aoe2-api");
const tech_tree_civ_changer_1 = require("./aoe2/tech-tree-civ-changer");
const upgrade_changer_1 = require("./aoe2/upgrade-changer");
let civChanger;
let upgradeChanger;
const aoe2Api = new aoe2_api_1.AoE2Api();
const aoe2Config = new aoe2_config_1.AoE2Config();
Promise.all([aoe2Api.getAoE2Data(), aoe2Api.getAoE2UpgradeData()]).then((results) => {
    aoe2Config.setConfigFromQueryString();
    civChanger = new tech_tree_civ_changer_1.TechTreeCivChanger(results[0], aoe2Config);
    upgradeChanger = new upgrade_changer_1.UpgradeChanger(results[1], aoe2Config);
    civChanger.listenForUrlChanges();
    if (aoe2Config.socketMode) {
        new civ_changer_client_1.CivChangerClient(civChanger, upgradeChanger, aoe2Config.clientId);
    }
});

},{"./aoe2/aoe2-api":1,"./aoe2/aoe2-config":2,"./aoe2/civ-changer-client":3,"./aoe2/tech-tree-civ-changer":4,"./aoe2/upgrade-changer":5}]},{},[8]);
