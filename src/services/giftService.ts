/**
 * ShopyBrands Gift Network Service - V1.0
 * Lógica de Matriz 1x4 con Bono de Mérito (Shannon Effect)
 */

export interface MatrixSlot {
    position: number;
    occupant_id: string | null;
    occupant_name?: string;
    recruiter_id: string | null;
    recruiter_name?: string;
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

    // Calcular Reparto de un Slot de forma dinámica
    calculateRewardDistribution(level: number, matrixOwnerId: string, actualRecruiterId: string) {
        const totalValue = this.getLevelValue(level);

        // 50% para el Salto de Nivel (Bloqueado)
        const nextLevelFund = totalValue * 0.50;

        // 25% para ShopyBrands (Operación)
        const platformFee = totalValue * 0.25;

        // 25% es la Recompensa Humana (Se puede dividir por mérito)
        const humanRewardBase = totalValue * 0.25;

        if (matrixOwnerId === actualRecruiterId) {
            // Caso Normal: El dueño trajo a su propio referido
            return {
                nextLevelFund,
                platformFee,
                ownerGain: humanRewardBase,
                recruiterBonus: 0,
                isSpillover: false
            };
        } else {
            // Caso Mérito (Efecto Shannon): El líder puso a alguien debajo de otro
            return {
                nextLevelFund,
                platformFee,
                ownerGain: humanRewardBase * 0.50,    // 50% del premio para el dueño de la matriz
                recruiterBonus: humanRewardBase * 0.50, // 50% del premio para el Líder que trajo al cliente
                isSpillover: true
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
