import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const GET = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  supabase.auth.getUser();
  const { data, error } = await supabase
    .from("topic")
    .select()
    .order("created_at", { ascending: false })
    .limit(5);
  return Response.json(data);
};
