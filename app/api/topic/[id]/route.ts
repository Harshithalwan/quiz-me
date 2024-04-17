import { createClient } from "@/utils/supabase/server";
import { isUUID } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export const GET = async (
  request: NextApiRequest,
  { params }: { params: { id: string } },
  response: NextApiResponse
) => {
  const id = params.id;
  if (!id || !isUUID(id))
    return Response.json({ message: "Invalid Request" }, { status: 400 });
  const topic = await fetchTopic(id);
  if (!topic || topic.length == 0)
    Response.json({ message: "Not found" }, { status: 404 });
  return Response.json(topic[0]);
};

const fetchTopic = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  supabase.auth.getUser();
  const { data, error } = await supabase
    .from("topic")
    .select()
    .filter("id", "eq", id);
  if (error) {
    console.debug(error);
    throw error;
  }
  return data;
};
