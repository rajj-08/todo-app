import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddTask({ uid, dateKey }) {
  const [text, setText] = useState("");

  async function handleAdd() {
    if (!text.trim()) return;
    await addDoc(collection(db, "users", uid, "tasks"), {
      text,
      completed: false,
      dateKey,
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 bg-gray-800 text-white p-3 rounded-lg outline-none"
        placeholder="Add a task..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleAdd()}
      />
      <button
        onClick={handleAdd}
        className="bg-teal-500 hover:bg-teal-400 px-5 py-3 rounded-lg font-semibold transition">
        Add
      </button>
    </div>
  );
}