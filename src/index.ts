import { CivChangerClient } from "./aoe2/civ-changer-client";
import { AoE2Config } from "./aoe2/aoe2-config";
import { AoE2Api } from "./aoe2/aoe2-api";
import { TechTreeCivChanger } from "./aoe2/tech-tree-civ-changer";

let civChanger: TechTreeCivChanger;

const aoe2Api = new AoE2Api();
const aoe2Config = new AoE2Config();

aoe2Api.getAoE2Data().then((data) => {
    aoe2Config.setConfigFromQueryString();
    civChanger = new TechTreeCivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
    new CivChangerClient(civChanger, aoe2Config.clientId);
});