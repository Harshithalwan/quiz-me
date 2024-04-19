"use client";
import { useCallback, useState } from "react";

const timer = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

async function poll(id: string) {
  let ok = false,
    response;
  while (!response?.ok) {
    await timer(3000);
    try {
      response = await fetch(`/api/answer/${id}`);
    } catch (e) {
      console.debug("polling for topic...");
    }
  }
  return response;
}

const Quiz = () => {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>();
  const [response, setResponse] = useState<any>();
  const [loading, setLoading] = useState(false);

  const generateResponse = useCallback(
    async (e: any) => {
      e.preventDefault();
      if (file == null || question == null || question === "") return;
      setLoading(true);

      const formdata = new FormData();
      formdata.append("book", file, file.name);
      formdata.append("question", question);

      const requestOptions = {
        method: "POST",
        body: formdata,
      };

      const fetchResponse = await fetch(
        "/api/generateFromContext",
        requestOptions
      );
      // if (!response.ok) setError(true);
      const { id } = await fetchResponse.json();
      const answerResponse = await poll(id);
      const answerJsonResponse = await answerResponse.json();
      setResponse(answerJsonResponse);
      setLoading(false);
      console.log(answerJsonResponse);
    },
    [file, question]
  );
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <form
        className="flex flex-col gap-4 max-w-xl"
        onSubmit={generateResponse}
      >
        <input
          type="file"
          className="file-input"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        ></input>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input"
          placeholder="Ask your question..."
        ></input>
        <button type="submit" className="btn bg-primary-900">
          Ask Question
        </button>
      </form>

      {loading ? <div className="loading-spinner loading"></div> : <></>}
      {response ? (
        <div className="card card-bordered w-3/6 max-w-4xl">
          <div className="p-4 font-bold text-green-500">
            {response.question}
          </div>
          <div className="p-4">{response.answer}</div>
          <div className="p-4">{response.detail}</div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Quiz;
