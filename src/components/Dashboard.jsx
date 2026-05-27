import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell
} from "recharts";
import dayjs from "dayjs";

const COLORS = ["#14b8a6", "#f87171"];

export default function Dashboard({ uid }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users", uid, "tasks"));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [uid]);

  const currentMonth = dayjs().format("YYYY-MM");
  const monthTasks = tasks.filter(t => t.dateKey?.startsWith(currentMonth));

  const dayMap = {};
  monthTasks.forEach(t => {
    if (!dayMap[t.dateKey]) dayMap[t.dateKey] = { date: t.dateKey, completed: 0, pending: 0 };
    t.completed ? dayMap[t.dateKey].completed++ : dayMap[t.dateKey].pending++;
  });
  const barData = Object.values(dayMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ ...d, date: dayjs(d.date).format("DD MMM") }));

  const totalCompleted = monthTasks.filter(t => t.completed).length;
  const totalPending = monthTasks.filter(t => !t.completed).length;
  const pieData = [
    { name: "Completed", value: totalCompleted },
    { name: "Pending", value: totalPending },
  ];

  const percent = monthTasks.length
    ? Math.round((totalCompleted / monthTasks.length) * 100)
    : 0;

  return (
    <div className="mt-6 rounded-2xl p-6 shadow-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)"
      }}>

      <h2 className="text-xl font-bold text-teal-400 mb-1">
        Monthly Dashboard — {dayjs().format("MMMM YYYY")}
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Overall productivity:{" "}
        <span className="text-teal-300 font-bold">{percent}%</span>
        {" "}({totalCompleted} completed / {monthTasks.length} total)
      </p>

      {monthTasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks this month yet.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Bar Chart */}
          <div className="flex-1">
            <h3 className="text-sm text-gray-400 mb-3 font-medium tracking-wide uppercase">
              Daily Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={barData}
                style={{ background: "transparent" }}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="date" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#e5e7eb"
                  }}
                  labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Legend
                  wrapperStyle={{ color: "#9ca3af", fontSize: "12px" }}
                />
                <Bar dataKey="completed" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm text-gray-400 mb-3 font-medium tracking-wide uppercase">
              Overall Split
            </h3>
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx={100} cy={100}
                innerRadius={55} outerRadius={80}
                dataKey="value"
                paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px"
                }}
              />
            </PieChart>
            <div className="flex gap-4 mt-1 text-xs font-medium">
              <span className="text-teal-400">● Completed</span>
              <span className="text-red-400">● Pending</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}