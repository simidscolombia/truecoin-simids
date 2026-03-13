const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY5NDgsImV4cCI6MjA4ODY0Mjk0OH0.XUjNkWStJT7R6JviAap1Czr4Wq98fyJ7q5ANwCtJGzE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDeletable(userId) {
    console.log(`Checking conflicts for user: ${userId}`);

    // Check transactions as sender
    const { count: txSender } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('sender_id', userId);
    console.log(`Transactions as sender: ${txSender}`);

    // Check transactions as receiver
    const { count: txReceiver } = await supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('receiver_id', userId);
    console.log(`Transactions as receiver: ${txReceiver}`);

    // Check prospects
    const { count: prospects } = await supabase.from('prospects').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    console.log(`Prospects: ${prospects}`);

    // Try delete
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    if (error) {
        console.error('DELETE ERROR:', error.message);
        console.error('DETAIL:', error.details);
    } else {
        console.log('User deleted successfully (or not found)');
    }
}

// IDs from screenshot:
// Jorby 1: 07ed5cc0-ce56-490a-a8c5-00b3b86c9fd4
// Jorby 2: 734b4b4a-bb89-4a71-a67e-6123e06047bc
const target1 = '07ed5cc0-ce56-490a-a8c5-00b3b86c9fd4';
const target2 = '734b4b4a-bb89-4a71-a67e-6123e06047bc';

checkDeletable(target1).then(() => checkDeletable(target2));
