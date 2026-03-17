const { matrixService } = require('./src/services/matrixService');
const { giftService } = require('./src/services/giftService');

async function testRules() {
    console.log("--- TEST REGLAS V3.6.5 ---");

    // 1. Verificar Distribución L1
    const distL1 = giftService.calculateRewardDistribution(1, 'OWNER', 'RECRUITER');
    console.log("Nivel 1 (Spillover):", distL1);

    const distL1Direct = giftService.calculateRewardDistribution(1, 'OWNER', 'OWNER');
    console.log("Nivel 1 (Directo):", distL1Direct);

    // 2. Verificar Distribución L12
    const distL12 = giftService.calculateRewardDistribution(12, 'OWNER', 'OWNER');
    console.log("Nivel 12 (Directo):", distL12);

    console.log("--- FIN TEST ---");
}

testRules();
