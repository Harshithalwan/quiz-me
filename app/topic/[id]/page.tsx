"use client";
import Header from "@/components/Header/Header";
import QuestionsList from "@/components/Question/QuestionsList";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Quiz = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const topicResponse = fetch(`/api/topic/${id}`);
    const questionsResponse = fetch(`/api/questions/${id}`);

    Promise.all([
      topicResponse.then((response) => response.json()),
      questionsResponse.then((response) => response.json()),
    ])
      .then(([topic, questions]) => {
        setTopic(topic);
        setQuestions(questions.questions);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching data", e);
      });
  }, []);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
        <Header />
        <h1 className="text-3xl font-extrabold">{topic.name}</h1>
        <div className="bg-white w-full h-0.5 my-4"></div>
        <QuestionsList questions={questions} />
      </div>
    );
  }
};

const Loader = () => {
  return (
    <div className="w-full h-screen sticky bg-black flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
};

export default Quiz;
