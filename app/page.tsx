"use client";
import GenerateForm from "@/components/GenerateForm/GenerateForm";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Explore from "@/components/Explore/Explore";

const timer = (ms: number | undefined) =>
  new Promise((res) => setTimeout(res, ms));

async function poll(id: string) {
  let ok = false,
    response;
  while (!ok) {
    await timer(3000);
    try {
      response = { ok } = await fetch(`/api/topic/${id}`);
    } catch (e) {
      console.debug("polling for topic...");
    }
  }
  return response;
}

export default function Home() {
  const [error, setError] = useState(false);
  const [recent, setRecent] = useState([]);
  const { push } = useRouter();

  // Auto dismiss Alert
  useEffect(() => {
    setTimeout(() => setError(false), 5000);
  }, [error]);

  useEffect(() => {
    fetch("/api/topic")
      .then((response) => response.json())
      .then((data) => setRecent(data));
  }, []);

  const onGenerate = useCallback(
    async (topic: string, setLoading: (loading: boolean) => void) => {
      setLoading(true);
      const response = await fetch(`/api/generate`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          // "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) setError(true);
      const { id } = await response.json();
      await poll(id);
      setLoading(false);
      push(`./topic/${id}`);
    },
    []
  );
  return (
    <main>
      <div className="w-full h-0.5 bg-secondary-500 my-2"></div>
      <div className="w-full h-0.5 bg-primary-500 my-2"></div>
      <div className="w-full h-0.5 bg-accent-500 my-2"></div>
      <div className="w-full h-0.5 bg-text-300 my-2"></div>
      <div className="w-full h-0.5 bg-secondary-500 my-2"></div>
      {error && (
        <div className="alert alert-error fixed w-2/3 top-4 text-base justify-center">
          Error generating quiz. Please try again!
        </div>
      )}
      <GenerateForm onGenerate={onGenerate} />
      <div className="w-full h-0.5 bg-white my-4"></div>
      <Explore recent={recent} />
    </main>
  );
}
