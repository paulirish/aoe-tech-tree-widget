import { CivChangerClient } from "./aoe2/civ-changer-client";
import { AoE2Config } from "./aoe2/aoe2-config";
import { AoE2Api } from "./aoe2/aoe2-api";
import { TechTreeCivChanger } from "./aoe2/tech-tree-civ-changer";
import { UpgradeChanger } from "./aoe2/upgrade-changer";

let civChanger: TechTreeCivChanger;
let upgradeChanger: UpgradeChanger;

const aoe2Api = new AoE2Api();
const aoe2Config = new AoE2Config();

Promise.all([aoe2Api.getAoE2Data(), aoe2Api.getAoE2UpgradeData()]).then((results) => {
    aoe2Config.setConfigFromQueryString();
    civChanger = new TechTreeCivChanger(results[0], aoe2Config);
    upgradeChanger = new UpgradeChanger(results[1], aoe2Config);

    civChanger.listenForUrlChanges();
    if (aoe2Config.socketMode) {
        new CivChangerClient(civChanger, upgradeChanger, aoe2Config.clientId);
    }
});
