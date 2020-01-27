"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_1 = require("./aoe2/civ-changer");
const aoe2_api_1 = require("./aoe2/aoe2-api");
const aoe2_config_1 = require("./aoe2/aoe2-config");
let civChanger;
const aoe2Api = new aoe2_api_1.AoE2Api();
const aoe2Config = new aoe2_config_1.AoE2Config();
aoe2Api.getAoE2Data().then((data) => {
    civChanger = new civ_changer_1.CivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
});
