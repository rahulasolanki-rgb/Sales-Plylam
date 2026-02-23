import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiProxy } from "../apiProxy";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiProxy.login({ email, password, app_role: "Sales Person" });
      navigate("/dashboard");
    } catch {
      setError("Login failed. Please verify your sales account credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <img src="/plylam.png" alt="Plylam" className="w-12 h-12 mb-4 object-contain" />
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Sales Person Portal</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Timber & Plywood</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sales@example.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl"
            required
          />
          {error && <div className="text-red-600 text-xs font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
