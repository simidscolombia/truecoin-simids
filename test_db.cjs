
const { createClient } = require('@supabase/supabase-js');
const url = 'https://rpodcifhgqzfmdbkeinu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwb2RjaWZoZ3F6Zm1kYmtlaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjY5NDgsImV4cCI6MjA4ODY0Mjk0OH0.XUjNkWStJT7R6JviAap1Czr4Wq98fyJ7q5ANwCtJGzE';

try {
    const supabase = createClient(url, key);
    console.log('Client created');
    supabase.from('profiles').select('count').then(({ data, error }) => {
        if (error) console.error('Query error:', error);
        else console.log('Query success:', data);
    });
} catch (e) {
    console.error('Catch error:', e.message);
}
