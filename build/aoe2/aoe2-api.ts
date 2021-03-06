export class AoE2Api {
    constructor() { }

    async getAoE2Data() {
        return await fetch('https://aoe2techtree.net/data/data.json').then(async (response) => {
            return await response.json();
        });
    }

    async getAoE2UpgradeData() {
        return await fetch('https://treee.github.io/aoe-tech-tree-widget/build/aoe2/upgrades-to-disable.json').then(async (response) => {
            return await response.json();
        });
    }
}
