import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, query, where, onSnapshot, orderBy
} from "firebase/firestore";
import TaskItem from "./TaskItem";

export default function TaskList({ uid, dateKey }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "users", uid, "tasks"),
      where("dateKey", "==", dateKey),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [uid, dateKey]);

  if (tasks.length === 0)
    return <p className="text-gray-500 text-sm">No tasks for this date.</p>;

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} uid={uid} />
      ))}
    </ul>
  );
}