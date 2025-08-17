import { environment } from "@/config/environment";
import { createClient } from "@supabase/supabase-js";

export default function createClientRealtime() {
    return createClient(
        environment.SUPABASE_URL!,
        environment.SUPABASE_ANON_KEY!,
    );
}