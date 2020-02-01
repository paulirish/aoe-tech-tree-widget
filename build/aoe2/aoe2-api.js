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
