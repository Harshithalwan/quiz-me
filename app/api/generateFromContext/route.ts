import { createClient } from "@/utils/supabase/server";
import {
  FunctionCallingMode,
  FunctionDeclarationSchemaType,
  GenerateContentRequest,
  GoogleGenerativeAI,
  Part,
} from "@google/generative-ai";
import { UUID, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const client = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

const getJSONResponse = (question: string, answer: string, detail: string) => {
  return {
    question,
    answer,
    detail,
  };
};

export const POST = async (request: NextRequest) => {
  // const requestJson = await request.json();
  const body = await request.formData();
  const file = body.get("book") as File;
  const question = body.get("question") as string;
  const id = randomUUID();
  console.log(question);

  generateAnswerAndUpdateDB(id, question, file);
  //   const fun = result.response.functionCalls();

  return Response.json({ id });
};

const generateAnswerAndUpdateDB = async (
  id: UUID,
  question: string,
  file: File
) => {
  const txt = Buffer.from(await file.arrayBuffer()).toString("utf-8");
  const ERROR_RESPONSE = "Question seems unrelated! Try a different one";
  const prompt = `You'll be provided with a large document, Read the document and answer the users question related to it. Give the straight answer first then add some additional details related to the answer. If the users question is vague or is not related to the document return a response saying ${ERROR_RESPONSE}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: txt }, { text: question }],
      },
    ],
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: prompt,
        },
      ],
    },
    tools: [
      {
        functionDeclarations: [
          {
            name: "getJSONResponse",
            parameters: {
              type: FunctionDeclarationSchemaType.STRING,
              properties: {
                answer: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description: "A single line answer to the question",
                },
                detail: {
                  type: FunctionDeclarationSchemaType.STRING,
                  description:
                    "A detailed answer with additonal related details",
                },
              },
            },
          },
        ],
      },
    ],
    toolConfig: {
      functionCallingConfig: {
        mode: FunctionCallingMode.ANY,
        allowedFunctionNames: ["getJSONResponse"],
      },
    },
  };
  const result = await client.generateContent(payload);
  dbInsert(
    id,
    question,
    result?.response?.candidates?.at(0)?.content?.parts[0]?.functionCall?.args
  );
};

const dbInsert = async (
  id: UUID,
  question: string,
  geminiResponse: { answer?: string; detail?: string } | null | undefined
) => {
  if (geminiResponse == null)
    throw new Error("Gemini response is shit. Google messed up or maybe i did");
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = supabase.auth.getUser();
  try {
    const { data, error } = await supabase
      .from("document")
      .insert({
        id,
        question,
        answer: geminiResponse.answer,
        detail: geminiResponse.detail,
      })
      .select();
    if (error) {
      console.debug(error);
      throw new Error("Error in creating topic");
    }
    return id;
  } catch (e) {
    console.debug("Error in creating topic");
    throw e;
  }
};
