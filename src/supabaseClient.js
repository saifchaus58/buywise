import { createClient } from "@supabase/supabase-js";

// ==========================================
// 🔑 SUPABASE CONFIGURATION
// Paste your Supabase Project URL and Public Anon Key below:
// ==========================================

const SUPABASE_URL = "https://emtggfjwsojiduvjmznr.supabase.co/rest/v1/";
const SUPABASE_PUBLIC_KEY = "sb_publishable_3MRD0ZuSd81jcxw3LLjBIg_RwX1rAf1";

// Normalize URL in case /rest/v1/ suffix was included
const formattedUrl = SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");

// Create and export a single Supabase client instance
export const supabase = createClient(formattedUrl, SUPABASE_PUBLIC_KEY);
