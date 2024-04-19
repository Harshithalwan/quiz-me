import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";
import { isUUID } from "@/utils/utils";


export const GET = async (
  request: NextApiRequest,
  { params }: { params: { documentId: string } },
  response: NextApiResponse
) => {
  
  const documentId = params.documentId;
  if (!documentId || !isUUID(documentId))
    return Response.json({ message: "Invalid Request" }, { status: 400 });
  const document = await fetchDocument(documentId);
  return Response.json(document[0]);
};

const fetchDocument = async (id: string) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  supabase.auth.getUser();
  const { data, error } = await supabase
    .from("document")
    .select()
    .filter("id", "eq", id);
  if (error) {
    console.debug(error);
    throw error;
  }
  return data;
};
