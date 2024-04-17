import Question, { QuestionProp } from "./Question";

type QuestionsListProp = { questions: QuestionProp[] };

const QuestionsList = ({ questions }: QuestionsListProp) => {
  return (
    <div className="flex flex-col gap-16 py-8">
      {questions.map((question, index) => {
        return (
          <Question
            key={index}
            question={question}
            questionNumber={index + 1}
          />
        );
      })}
    </div>
  );
};

export default QuestionsList;
