"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_client_1 = require("./aoe2/civ-changer-client");
const aoe2_config_1 = require("./aoe2/aoe2-config");
const aoe2_api_1 = require("./aoe2/aoe2-api");
const tech_tree_civ_changer_1 = require("./aoe2/tech-tree-civ-changer");
let civChanger;
const aoe2Api = new aoe2_api_1.AoE2Api();
const aoe2Config = new aoe2_config_1.AoE2Config();
aoe2Api.getAoE2Data().then((data) => {
    aoe2Config.setConfigFromQueryString();
    civChanger = new tech_tree_civ_changer_1.TechTreeCivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
    if (aoe2Config.socketMode) {
        new civ_changer_client_1.CivChangerClient(civChanger, aoe2Config.clientId);
    }
});
