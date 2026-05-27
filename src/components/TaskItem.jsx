import { db } from "../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState } from "react";

export default function TaskItem({ task, uid }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const ref = doc(db, "users", uid, "tasks", task.id);

  async function toggleComplete() {
    await updateDoc(ref, { completed: !task.completed });
  }

  async function handleDelete() {
    await deleteDoc(ref);
  }

  async function handleEdit() {
    if (editing && editText.trim()) {
      await updateDoc(ref, { text: editText });
    }
    setEditing(!editing);
  }

  return (
    <li className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg group">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={toggleComplete}
        className="w-4 h-4 accent-teal-400 cursor-pointer"
      />

      {/* Text or Edit input */}
      {editing ? (
        <input
          className="flex-1 bg-gray-700 text-white p-1 rounded outline-none text-sm"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleEdit()}
          autoFocus
        />
      ) : (
        <span className={`flex-1 text-sm ${task.completed
          ? "line-through text-gray-500"
          : "text-white"}`}>
          {task.text}
        </span>
      )}

      {/* Actions */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={handleEdit}
          className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold">
          {editing ? "Save" : "Edit"}
        </button>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 text-xs font-semibold">
          Del
        </button>
      </div>
    </li>
  );
}