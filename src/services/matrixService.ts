import { supabase } from '../lib/supabase';
import { MatrixSlot } from './giftService';

export const matrixService = {
    /**
     * Obtiene los slots ocupados en la matriz de un usuario para un nivel específico
     */
    async getMatrixSlots(ownerId: string, level: number = 1): Promise<MatrixSlot[]> {
        const { data, error } = await supabase
            .from('matrix_slots')
            .select(`
                position,
                occupant_id,
                recruiter_id,
                profiles!occupant_id (
                    full_name
                )
            `)
            .eq('matrix_owner_id', ownerId)
            .eq('level', level)
            .order('position', { ascending: true });

        if (error) {
            console.error("Error fetching matrix slots:", error);
            return [];
        }

        return data.map((item: any) => ({
            position: item.position,
            occupant_id: item.occupant_id,
            occupant_name: item.profiles?.full_name || 'Desconocido',
            recruiter_id: item.recruiter_id
        }));
    },

    /**
     * Ubica a un usuario en una posición específica de la matriz de un dueño
     */
    async placeUser(params: {
        matrixOwnerId: string,
        occupantId: string,
        recruiterId: string,
        level: number,
        position: number
    }) {
        // 1. Verificar si la posición ya está ocupada
        const { data: posTaken } = await supabase
            .from('matrix_slots')
            .select('id')
            .eq('matrix_owner_id', params.matrixOwnerId)
            .eq('level', params.level)
            .eq('position', params.position)
            .single();

        if (posTaken) {
            throw new Error(`La posición ${params.position} ya está ocupada.`);
        }

        // 2. Verificar si el usuario ya está ubicado en este tablero (nivel)
        const { data: userAlreadyPlaced } = await supabase
            .from('matrix_slots')
            .select('id')
            .eq('matrix_owner_id', params.matrixOwnerId)
            .eq('level', params.level)
            .eq('occupant_id', params.occupantId)
            .single();

        if (userAlreadyPlaced) {
            throw new Error(`Este socio ya está ubicado en tu tablero de nivel ${params.level}.`);
        }

        // 3. Insertar el slot
        const { error } = await supabase
            .from('matrix_slots')
            .insert([{
                matrix_owner_id: params.matrixOwnerId,
                occupant_id: params.occupantId,
                recruiter_id: params.recruiterId,
                level: params.level,
                position: params.position
            }]);

        if (error) throw error;

        return true;
    },

    /**
     * Obtiene referidos directos que NO han sido ubicados en ninguna matriz de nivel 1
     */
    async getUnplacedReferrals(userId: string) {
        // Esta consulta es un poco más compleja porque necesitamos saber quiénes no están en matrix_slots
        // Por ahora, traemos todos los directos y filtramos en JS o con una subquery si es posible

        const { data: directs, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, created_at')
            .eq('referred_by', userId);

        if (error) throw error;

        const { data: placed } = await supabase
            .from('matrix_slots')
            .select('occupant_id')
            .eq('matrix_owner_id', userId)
            .eq('level', 1);

        const placedIds = new Set(placed?.map(p => p.occupant_id) || []);

        return directs.filter(d => !placedIds.has(d.id));
    }
};
