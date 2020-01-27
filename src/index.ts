import { CivChanger } from "./aoe2/civ-changer";
import { AoE2Api } from "./aoe2/aoe2-api";
import { AoE2Config } from "./aoe2/aoe2-config";

let civChanger: CivChanger;

const aoe2Api = new AoE2Api();
const aoe2Config = new AoE2Config();

aoe2Api.getAoE2Data().then((data) => {
    civChanger = new CivChanger(data, aoe2Config);
    civChanger.listenForUrlChanges();
});