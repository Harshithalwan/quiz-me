import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";
import { isUUID } from "@/utils/utils";


export const GET = async (
  request: NextApiRequest,
  { params }: { params: { topicId: string } },
  response: NextApiResponse
) => {
  
  const topicId = params.topicId;
  if (!topicId || !isUUID(topicId))
    return Response.json({ message: "Invalid Request" }, { status: 400 });
  const questions = await fetchQuestions(topicId);
  return Response.json({ questions });
};

const fetchQuestions = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  supabase.auth.getUser();
  const { data, error } = await supabase
    .from("question")
    .select()
    .filter("topic_id", "eq", id);
  if (error) {
    console.debug(error);
    throw error;
  }
  return data;
};
