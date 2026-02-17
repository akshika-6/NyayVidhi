import React from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center py-12 px-4 relative">
      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
           <span className="text-white text-2xl">⚖️</span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          NyayVidhi
        </h1>
        <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">AI Legal Assistant</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        
        {children}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-slate-600 text-xs flex items-center gap-2 relative z-10">
        <span>✅ Secure Legal-Grade Analysis</span>
      </div>
    </div>
  );
};

export default AuthLayout;
