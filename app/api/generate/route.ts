import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const ERROR_RESPONSE = "Can't provide response. Please try a different topic!";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const client = new GoogleGenerativeAI(GEMINI_API_KEY).getGenerativeModel({
  model: "gemini-1.5-pro-latest",
});

export const POST = async (request: NextRequest) => {
  const requestJson = await request.json();
  const topic = requestJson.topic;
  if (!topic || topic == "") {
    return Response.json({ message: "Invalid request" }, { status: 403 });
  }
  const topicId = randomUUID();
  // Google Generative AI
  processRequest(topic, topicId);
  return Response.json({ id: topicId });
};
const processRequest = async (topic: any, topicId: any) => {
  const prompt = `I'll be providing a topic name, and your job is to generate 5 multichoice questions, each with 4 plausible options and only one of the options will be correct. please use this JSON format for response [{ question: 'Text of the question', options: [{text: 'text of the option', correct: 'if this option is correct set this to 'true' otherwise set this to 'false''}] }] If provided topic is not valid or you're not able to generate a response in the provided structure then return "${ERROR_RESPONSE}"`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Give me questions on this topic" }, { text: topic }],
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
  };
  const result = await client.generateContent(payload);
  const response = result.response.text();

  // Can't get response in said JSON format, or provided subject is vague
  if (response == ERROR_RESPONSE) {
    console.debug("Google messed up")
  }
  const json = parseJSON(response);
  dbInsert(json, topic, topicId);
};

const dbInsert = async (json: any, topic: any, topicId: any) => {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const user = supabase.auth.getUser();
    await createTopic(supabase, topic, topicId);
    await createQuestions(supabase, json, topicId);
  } catch (e) {
    console.debug("Error in db update");
    throw e;
  }
};

async function createQuestions(supabase: any, json: any, topicId: any) {
  const insertData = json.map((question: { question: any; options: any }) => {
    return {
      text: question.question,
      options: question.options,
      topic_id: topicId,
    };
  });
  try {
    const { data, error } = await supabase
      .from("question")
      .insert(insertData)
      .select();
    if (error) throw new Error(error.message);
    if (data == null) throw new Error("Error inserting questions data");
  } catch (e) {
    console.debug(e);
    throw e;
  }
}

async function createTopic(
  supabase: SupabaseClient<any, "public", any>,
  topic: any,
  topicId: any
): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("topic")
      .insert({
        id: topicId,
        name: topic,
      })
      .select();
    if (error) {
      console.debug(error);
      throw new Error("Error in creating topic");
    }
    return topicId;
  } catch (e) {
    console.debug("Error in creating topic");
    throw e;
  }
}

function parseJSON(response: string) {
  try {
    const responseStartTrim = response.substring(response.indexOf("["));
    const responseEndTrim = responseStartTrim.substring(
      0,
      responseStartTrim.lastIndexOf("]") + 1
    );
    return JSON.parse(responseEndTrim);
  } catch (e) {
    console.info(response);
    console.debug("Error in parsing generative JSON");
    throw e;
  }
}
