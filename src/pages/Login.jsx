import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/");
    } catch (e) {
      setErr("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-sm shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
        {err && <p className="text-red-400 mb-4 text-sm">{err}</p>}
        <input className="w-full mb-3 p-3 rounded-lg bg-gray-800 text-white outline-none"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full mb-4 p-3 rounded-lg bg-gray-800 text-white outline-none"
          placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button onClick={handleLogin}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-lg transition">
          Login
        </button>
        <p className="text-gray-400 mt-4 text-sm text-center">
          No account? <Link to="/register" className="text-teal-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}