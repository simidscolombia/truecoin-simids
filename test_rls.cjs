
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testUpdate() {
    console.log("Testing update on a profile...");
    // Try to update juangarcia's name to something else using the ANON key
    const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: 'JUAN TEST ' + Date.now() })
        .eq('email', 'juangarcia@gmail.com')
        .select();

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Result (data):", data);
        if (data.length === 0) {
            console.log("⚠️ NO ROWS UPDATED. This likely means RLS is blocking the update or the ID is wrong.");
        } else {
            console.log("✅ SUCCESSFUL UPDATE.");
        }
    }
}

testUpdate();
