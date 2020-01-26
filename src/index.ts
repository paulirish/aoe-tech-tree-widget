import { CivChanger } from "./civ-changer";
import { AoE2Api } from "./aoe2-api";

const aoe2Api = new AoE2Api();
let civChanger: CivChanger;

aoe2Api.getAoE2Data().then((data) => {
    civChanger = new CivChanger(data);
    $('body').append(civChanger.getCivsHtmlElement());
});