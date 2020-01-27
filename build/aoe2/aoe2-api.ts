export class AoE2Api {
    constructor() { }

    async getAoE2Data() {
        return await fetch('https://aoe2techtree.net/data/data.json').then(async (response) => {
            return await response.json();
        });
    }
}
