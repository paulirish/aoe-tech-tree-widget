import { TechTreeCivChanger } from "./aoe2/tech-tree-civ-changer";
import { AoE2Api } from "./aoe2/aoe2-api";
import { AoE2Config } from "./aoe2/aoe2-config";

let civChanger: TechTreeCivChanger;

const aoe2Api = new AoE2Api();
const aoe2Config = new AoE2Config();

aoe2Api.getAoE2Data().then((data) => {
    civChanger = new TechTreeCivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
});