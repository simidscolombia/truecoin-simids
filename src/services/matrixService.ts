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
                    full_name,
                    current_level
                ),
                recruiter:profiles!recruiter_id (
                    full_name,
                    referral_code
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
            current_level: item.profiles?.current_level || 1,
            recruiter_id: item.recruiter_id,
            recruiter_name: item.recruiter?.full_name || 'Sistema / IA',
            recruiter_code: item.recruiter?.referral_code || 'SB-AUTO'
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

        // 4. Verificar si completó la matriz para subir de nivel
        const { count } = await supabase
            .from('matrix_slots')
            .select('*', { count: 'exact', head: true })
            .eq('matrix_owner_id', params.matrixOwnerId)
            .eq('level', params.level);

        if (count === 4) {
            // Subir al siguiente nivel en el perfil
            const nextLevel = params.level + 1;
            await supabase
                .from('profiles')
                .update({ current_level: nextLevel })
                .eq('id', params.matrixOwnerId);

            console.log(`🚀 Usuario ${params.matrixOwnerId} subió al Nivel ${nextLevel}`);
        }

        return true;
    },

    /**
     * Obtiene referidos directos que NO han sido ubicados en ninguna matriz de nivel 1
     */
    async getUnplacedReferrals(userId: string) {
        // 1. Obtener todos los referidos directos
        const { data: directs, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, created_at')
            .eq('referred_by', userId);

        if (error) throw error;

        // 2. Obtener los IDs de socios que ya tienen un lugar en el sistema (Nivel 1)
        // Buscamos en toda la tabla de slots, sin importar quién sea el dueño
        const { data: placed } = await supabase
            .from('matrix_slots')
            .select('occupant_id')
            .eq('level', 1);

        const placedIds = new Set(placed?.map(p => p.occupant_id) || []);

        // 3. Solo mostrar los que NO están en ninguna silla todavía
        return directs.filter(d => !placedIds.has(d.id));
    },

    /**
     * Ubica AUTOMÁTICAMENTE a un usuario en el primer hueco libre de su reclutador
     */
    async autoPlaceUser(userId: string, level: number = 1) {
        // 1. Obtener quién lo recomendó
        const { data: profile } = await supabase
            .from('profiles')
            .select('referred_by')
            .eq('id', userId)
            .single();

        if (!profile || !profile.referred_by) {
            console.log("Usuario sin mentor, no se puede auto-ubicar.");
            return false;
        }

        const mentorId = profile.referred_by;

        // 2. Función interna para buscar el "Mejor Lugar" (Búsqueda por niveles - Spillover)
        const findBestSlot = async (rootId: string): Promise<{ ownerId: string, pos: number } | null> => {
            // Nivel A: Buscar en la matriz directa del Mentor
            const { data: rootSlots } = await supabase
                .from('matrix_slots')
                .select('position, occupant_id')
                .eq('matrix_owner_id', rootId)
                .eq('level', level);

            const rootTaken = new Set(rootSlots?.map(s => s.position) || []);
            for (let i = 1; i <= 4; i++) {
                if (!rootTaken.has(i)) return { ownerId: rootId, pos: i };
            }

            // Nivel B: Si el mentor está lleno, buscar en las matrices de sus 4 directos (Derrame)
            // Ordenamos por posición para ser consistentes (Izquierda a Derecha)
            const directs = rootSlots?.sort((a, b) => a.position - b.position) || [];

            for (const d of directs) {
                if (!d.occupant_id) continue;

                const { data: subSlots } = await supabase
                    .from('matrix_slots')
                    .select('position')
                    .eq('matrix_owner_id', d.occupant_id)
                    .eq('level', level);

                const subTaken = new Set(subSlots?.map(s => s.position) || []);
                for (let i = 1; i <= 4; i++) {
                    if (!subTaken.has(i)) return { ownerId: d.occupant_id, pos: i };
                }
            }

            // Si llegamos aquí, los dos primeros niveles están llenos (Mentor + sus 4 directos)
            // Se podría seguir profundizando, pero por ahora queda en Sala de Espera para el mentor
            return null;
        };

        const target = await findBestSlot(mentorId);

        if (!target) {
            console.log("Estructura de equipo llena en 2 niveles, requiere ubicación manual.");
            return false;
        }

        // 3. Ubicar conservando siempre al mentor original como 'recruiter_id'
        // pero cambiando el 'matrix_owner_id' si es por derrame
        return await this.placeUser({
            matrixOwnerId: target.ownerId,
            occupantId: userId,
            recruiterId: mentorId,
            level: level,
            position: target.pos
        });
    }
};
