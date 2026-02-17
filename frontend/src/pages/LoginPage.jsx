import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { useAuth } from "../components/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your legal workspace"
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
            placeholder="name@company.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <a href="#" className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">Forgot?</a>
          </div>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-white/5 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-blue-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-center text-slate-400 text-sm">
          New to NyayVidhi?{" "}
          <Link to="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
