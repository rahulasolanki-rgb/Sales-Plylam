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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7f4ef] via-white to-[#eef4f0] flex items-center justify-center p-6">
      <div className="pointer-events-none absolute -top-32 -right-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 shadow-sm border border-white">
            Sales Access Only
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-[36px] shadow-2xl border border-white/70 p-8">
          <div className="flex flex-col items-center gap-3 text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center">
              <img src="/plylam.png" alt="Plylam" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Sales Person Portal</h1>
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2">Timber & Plywood Operations</p>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Manage orders, customers, invoices, and stock movement from one secure console.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sales@plylam.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            {error && <div className="text-red-600 text-xs font-semibold">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/25 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
            No self sign-up. Contact your admin to create a sales account.
          </div>
        </div>
      </div>
    </div>
  );
}
