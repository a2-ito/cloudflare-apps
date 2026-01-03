import { useState } from "react";

function ScoreModal({ score }: { score: number }) {
  const [name, setName] = useState("");

  async function submit() {
    await fetch("/api/score", {
      method: "POST",
      body: JSON.stringify({ name, score }),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-800 p-4 rounded">
        <h2 className="text-lg mb-2">New High Score</h2>
        <input
          className="bg-gray-700 p-2 rounded w-full"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={submit} className="mt-2 bg-blue-600 px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
}
