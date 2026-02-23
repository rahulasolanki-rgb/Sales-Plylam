import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { apiService } from "../apiService";
import { apiProxy } from "../apiProxy";
import { LogIn, Building2, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [mode, setMode] = useState<"email" | "gst">("gst");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gst, setGst] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "email") {
        await apiProxy.login({ email, password });
      } else {
        await apiProxy.login({ email: gst, password: phone, app_role: "Customer" });
      }
      // Fetch profile after login
      try {
        const profile = await apiProxy.getMe();
        localStorage.setItem("profile", JSON.stringify(profile));
      } catch (err) {
        // Profile fetch failed, continue
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mb-6 shadow-sm">
            <img src="/plylam.png" alt="Plylam" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest">Natural Plylam</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Customer Portal Login</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => setMode("gst")}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              mode === "gst" ? "bg-white text-primary shadow-sm" : "text-slate-400"
            }`}
          >
            GST & Phone
          </button>
          <button
            onClick={() => setMode("email")}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              mode === "email" ? "bg-white text-primary shadow-sm" : "text-slate-400"
            }`}
          >
            Email & Pass
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {mode === "gst" ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Number</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder="27AAACR1234A1Z1"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@example.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary hover:scale-[1.02] active:scale-[0.98] text-white font-black rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? "Logging in..." : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            Demo: GST <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">27AAACR1234A1Z1</code><br/>
            Phone <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">9876543210</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
