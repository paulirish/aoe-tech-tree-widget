"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const civ_changer_1 = require("./civ-changer");
const aoe2_api_1 = require("./aoe2-api");
const aoe2Api = new aoe2_api_1.AoE2Api();
let civChanger;
aoe2Api.getAoE2Data().then((data) => {
    civChanger = new civ_changer_1.CivChanger(data);
    $('body').append(civChanger.createHtmlElement("Bulgarians"));
});
