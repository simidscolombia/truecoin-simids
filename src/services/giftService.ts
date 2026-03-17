/**
 * ShopyBrands Gift Network Service - V1.0
 * Lógica de Matriz 1x4 con Bono de Mérito (Shannon Effect)
 */

export interface MatrixSlot {
    position: number;
    occupant_id: string | null;
    occupant_name?: string;
    current_level?: number;
    recruiter_id: string | null;
    recruiter_name?: string;
    recruiter_code?: string;
    created_at?: string;
}

export const giftService = {
    // Valores por nivel según Plan V3.1
    getLevelValue(level: number): number {
        const values: Record<number, number> = {
            1: 50, 2: 100, 3: 200, 4: 400, 5: 800,
            6: 1600, 7: 3200, 8: 6400, 9: 12800,
            10: 25600, 11: 51200, 12: 102400
        };
        return values[level] || 50;
    },

    // Calcular Reparto de un Slot de forma dinámica (Plan Maestro V3.6.5)
    calculateRewardDistribution(level: number, matrixOwnerId: string, actualRecruiterId: string) {
        const totalValue = this.getLevelValue(level);

        if (level < 12) {
            // Lógica Niveles 1-11: 25% Tú, 25% Sistema, 50% Salto
            const nextLevelFund = totalValue * 0.50;
            const platformFee = totalValue * 0.25;
            const humanRewardBase = totalValue * 0.25;

            return {
                nextLevelFund,
                platformFee,
                ownerGain: matrixOwnerId === actualRecruiterId ? humanRewardBase : humanRewardBase * 0.5,
                recruiterBonus: matrixOwnerId === actualRecruiterId ? 0 : humanRewardBase * 0.5,
                tsunamiFund: 0,
                isSpillover: matrixOwnerId !== actualRecruiterId
            };
        } else {
            // Lógica NIVEL 12 (SOY LEYENDA): 50% Tú, 10% Sistema, 40% Tsunami
            const platformFee = totalValue * 0.10;
            const tsunamiFund = totalValue * 0.40;
            const humanRewardBase = totalValue * 0.50;

            return {
                nextLevelFund: 0, // No hay nivel 13
                platformFee,
                ownerGain: matrixOwnerId === actualRecruiterId ? humanRewardBase : humanRewardBase * 0.5,
                recruiterBonus: matrixOwnerId === actualRecruiterId ? 0 : humanRewardBase * 0.5,
                tsunamiFund,
                isSpillover: matrixOwnerId !== actualRecruiterId
            };
        }
    },

    // Sugerencia de IA para Colocación (Simulado por ahora)
    async getIASuggestion(_ownerId: string, pendingReferrals: any[]) {
        // En el futuro, esto analizará la profundidad de la red
        if (pendingReferrals.length === 0) return null;

        return {
            referralId: pendingReferrals[0].id,
            suggestedPosition: 1, // Ejemplo
            reason: "Este movimiento cierra el ciclo de tu socio directo y te empuja a Nivel 2."
        };
    }
};
