/* =========================================
   Lamine Yamal Fan Website
   Supabase Configuration
   ========================================= */

// آدرس پروژه Supabase
const SUPABASE_URL =
  "https://kcnxopqwqzxhzaciskwq.supabase.co";

// Publishable Key
const SUPABASE_KEY =
  "sb_publishable_snszD0JjmcAF8f9BDgKbfg_DezmJl6Y";


/*
   ساخت اتصال به Supabase
   توجه:
   فقط Publishable/Anon Key باید در سایت باشد.
   Service Role Key را هرگز داخل سایت قرار نده.
*/

window.sb =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );