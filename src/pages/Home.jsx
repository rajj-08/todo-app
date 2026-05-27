import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/AuthContext";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";
import Dashboard from "../components/Dashboard";
import dayjs from "dayjs";

export default function Home() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const menuRef = useRef(null);

  const dateKey = dayjs(selectedDate).format("YYYY-MM-DD");

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handlePasswordReset() {
    await sendPasswordResetEmail(auth, user.email);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  }

  return (
    <div className="min-h-screen text-white p-6"
      style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a1628 100%)" }}>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight"
            style={{ background: "linear-gradient(90deg, #14b8a6, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Todo App
          </h1>
          <p className="text-gray-500 text-xs mt-1 font-medium tracking-widest uppercase">
            Your daily productivity hub
          </p>
        </div>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
            style={{ background: "linear-gradient(135deg, #14b8a6, #6366f1)" }}>
            {user.email[0].toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                <p className="text-sm text-white font-semibold truncate">{user.email}</p>
              </div>
              <button
                onClick={handlePasswordReset}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition flex items-center gap-2">
                <span>Change Password</span>
                {resetSent && <span className="text-teal-400 text-xs">(Email sent!)</span>}
              </button>
              <button
                onClick={() => signOut(auth)}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition border-t border-gray-800">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="rounded-2xl p-4 w-fit shadow-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>

        {/* Tasks Panel */}
        <div className="flex-1 rounded-2xl p-6 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}>
          <h2 className="text-base font-semibold mb-4 text-teal-300 tracking-wide">
            {dayjs(selectedDate).format("dddd, DD MMMM YYYY")}
          </h2>
          <AddTask uid={user.uid} dateKey={dateKey} />
          <TaskList uid={user.uid} dateKey={dateKey} />
        </div>
      </div>

      <Dashboard uid={user.uid} />
    </div>
  );
}