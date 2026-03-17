
const https = require('https');

const SUPABASE_URL = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2Njk0OCwiZXhwIjoyMDg4NjQyOTQ4fQ.h8eePhGxrXBENU2J27NuWL8XfSqwCtMDQdnYbPmxliw';

function httpsReq(path, method, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(SUPABASE_URL + path);
        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'apikey': SERVICE_ROLE,
                'Authorization': `Bearer ${SERVICE_ROLE}`,
                'Content-Type': 'application/json',
                ...(body ? { 'Prefer': 'return=representation' } : {})
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

const MENTOR_CODE = 'TCMASTER';
const NUM_TEST_USERS = 6;

async function runSimulation() {
    console.log(`🚀 Iniciando Simulación de Red ShopyBrands (via REST)...`);

    // 1. Buscar al Mentor
    const mentorRes = await httpsReq(`/rest/v1/profiles?referral_code=eq.${MENTOR_CODE}&select=id,full_name`, 'GET');
    const mentor = mentorRes.data?.[0];

    if (!mentor) {
        console.error("❌ Mentor no encontrado.");
        return;
    }
    console.log(`✅ Mentor: ${mentor.full_name} (${mentor.id})`);

    // 2. Simular usuarios
    for (let i = 1; i <= NUM_TEST_USERS; i++) {
        const suffix = Math.random().toString(36).substring(7);
        const userData = {
            full_name: `Test Spillover ${i} (${suffix})`,
            email: `spillover_${Date.now()}_${i}@test.com`,
            referral_code: `SP${i}${suffix.toUpperCase()}`,
            referred_by: mentor.id,
            is_vip: true,
            current_level: 1
        };

        console.log(`\n--- Creando [${userData.full_name}] ---`);
        const createRes = await httpsReq('/rest/v1/profiles', 'POST', userData);
        const profile = createRes.data?.[0];

        if (!profile) {
            console.error("❌ Error creando perfil:", createRes.status, createRes.data);
            continue;
        }

        // Ubicar
        await autoPlaceUser(profile.id, mentor.id);
    }

    console.log(`\n🏁 SIMULACIÓN FINALIZADA.`);
}

async function autoPlaceUser(userId, mentorId) {
    const findBestSlot = async (rootId) => {
        // Nivel A
        const { data: rootSlots } = await httpsReq(`/rest/v1/matrix_slots?matrix_owner_id=eq.${rootId}&level=eq.1&select=position,occupant_id`, 'GET');
        const taken = new Set(rootSlots?.map(s => s.position) || []);

        for (let i = 1; i <= 4; i++) {
            if (!taken.has(i)) return { ownerId: rootId, pos: i };
        }

        // Nivel B
        const directs = rootSlots?.sort((a, b) => a.position - b.position) || [];
        for (const d of directs) {
            if (!d.occupant_id) continue;
            const { data: subSlots } = await httpsReq(`/rest/v1/matrix_slots?matrix_owner_id=eq.${d.occupant_id}&level=eq.1&select=position`, 'GET');
            const subTaken = new Set(subSlots?.map(s => s.position) || []);
            for (let i = 1; i <= 4; i++) {
                if (!subTaken.has(i)) return { ownerId: d.occupant_id, pos: i };
            }
        }
        return null;
    };

    const target = await findBestSlot(mentorId);
    if (!target) {
        console.log("   ⚠️ No hay espacio en 2 niveles.");
        return;
    }

    const slotData = {
        matrix_owner_id: target.ownerId,
        occupant_id: userId,
        recruiter_id: mentorId,
        level: 1,
        position: target.pos
    };

    const slotRes = await httpsReq('/rest/v1/matrix_slots', 'POST', slotData);
    if (slotRes.status >= 200 && slotRes.status < 300) {
        if (target.ownerId === mentorId) {
            console.log(`   ✅ Ubicado DIRECTO en Posición ${target.pos}`);
        } else {
            const { data: owner } = await httpsReq(`/rest/v1/profiles?id=eq.${target.ownerId}&select=full_name`, 'GET');
            console.log(`   🌊 DERRAME: Ubicado bajo ${owner?.[0]?.full_name} en Posición ${target.pos}`);
        }
    } else {
        console.error("   ❌ Error ubicando:", slotRes.status, slotRes.data);
    }
}

runSimulation();
