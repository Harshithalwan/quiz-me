import { useState } from "react";

export type QuestionProp = {
  text: string;
  options: {
    text: string;
    correct: string | boolean;
  }[];
};

const Question = ({
  question,
  questionNumber,
}: {
  question: QuestionProp;
  questionNumber: number;
}) => {
  const [selected, setSelected] = useState<number>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  return (
    <div>
      <div className="text-xl py-6 font-bold">
        <span className="pr-2">{`Q.${questionNumber}`}</span>
        <span>{question.text}</span>
      </div>
      <ul className="flex flex-col gap-4">
        {question.options.map((option, index) => {
          // TODO - options.correct is sometimes binary and sometimes it's string, putting this temporary check
          const isCorrect = option.correct === "true" || option.correct === true;
    
          console.log(option);
          let selectedStyle;
          if (selected == index && !submitted)
            selectedStyle = "shadow-none animate-bounce";
          let answerStyle;
          if (submitted && isCorrect) {
            answerStyle = "border-green-500";
          }
          if (submitted && isCorrect && selected == index)
            answerStyle = "bg-green-600";
          else if (submitted && !isCorrect && selected == index)
            answerStyle = "bg-red-600";
          let pendingStyle;
          if (!submitted) pendingStyle = "shadow-white";
          return (
            <li
              key={index}
              onClick={(e) => {
                if (submitted) {
                  e.preventDefault();
                  return;
                }
                setSelected(index);
              }}
              className={`p-4 shadow-inner hover:shadow-sm transition-all border rounded-md ${pendingStyle} ${selectedStyle} ${answerStyle}`}
            >{`${index + 1}. ${option.text}`}</li>
          );
        })}
      </ul>
      <button
        className="btn my-4 w-full text-lg bg-accent-500 hover:bg-accent-500 text-black shadow-accent-700 hover:shadow-accent-700 shadow-lg hover:shadow-sm rounded-2xl transition-all"
        onClick={() => {
          setSubmitted(true);
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default Question;
