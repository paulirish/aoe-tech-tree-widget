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
