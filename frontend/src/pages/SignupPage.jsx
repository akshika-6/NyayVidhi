import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../components/AuthContext";

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "Hindi (हिन्दी)" },
  { code: "Marathi", name: "Marathi (मराठी)" },
  { code: "Gujarati", name: "Gujarati (ગુજરાતી)" },
  { code: "Tamil", name: "Tamil (தமிழ்)" },
  { code: "Telugu", name: "Telugu (తెలుగు)" },
  { code: "Kannada", name: "Kannada (ಕನ್ನಡ)" },
  { code: "Bengali", name: "Bengali (বাংলা)" },
  { code: "Malayalam", name: "Malayalam (മലയാളം)" },
  { code: "Punjabi", name: "Punjabi (ਪੰਜਾਬी)" }
];

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await signup(name, email, password, preferredLanguage);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the AI-powered legal revolution"
    >
      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            placeholder="Aditya Sharma"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            placeholder="name@company.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Default Language</label>
          <select 
            required
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Security Password</label>
          <input 
            type="password" 
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-slate-400 text-sm mt-4">
          Already a member?{" "}
          <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
