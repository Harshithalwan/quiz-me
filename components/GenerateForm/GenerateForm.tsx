import { useState } from "react";
import "./styles.css";
import { MdErrorOutline } from "react-icons/md";

const GenerateForm = ({ onGenerate }: any) => {
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(false);
  return (
    <div className="z-10 w-full flex max-w-5xl items-center justify-center font-mono text-sm lg:flex flex-wrap gap-8 py-8">
      <div className="text-center w-60">
        <img src="./quizmeLogo.png"></img>
      </div>
      <h2 className="w-full text-center text-lg pb-12">
        Test your knowledge with interactive quizzes
      </h2>
      <div className="w-full flex items-start justify-center gap-4 flex-wrap sm:flex-nowrap ">
        <div className="w-full flex flex-col gap-2">
          <input
            className="topicInput input w-full rounded-2xl"
            placeholder="Indian History, Java, ISRO"
            value={topic}
            onChange={(e) => {
              setInfo(false);
              setTopic(e.target.value);
            }}
          ></input>
          {info ? (
            <div className="px-4 text-red-600 flex gap-1 items-center">
              <MdErrorOutline />
              <span>Enter a topic.</span>
            </div>
          ) : null}
        </div>
        <button
          className="topicButton btn w-full min-w-24 disabled:bg-accent-500 sm:w-auto bg-accent-500 hover:bg-accent-500 text-black shadow-accent-700 hover:shadow-accent-700 shadow-lg hover:shadow-sm rounded-2xl transition-all"
          onClick={() => {
            if (!topic || topic.length < 3) {
              setInfo(true);
              return;
            }
            onGenerate(topic, setLoading);
          }}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-md text-black"></span>
          ) : (
            <span>Generate</span>
          )}
        </button>
      </div>
      {loading ? <div className="animate-pulse">New questions are hatching. Meanwhile checkout existing quizzes from the section below</div> : null}
    </div>
  );
};

export default GenerateForm;
