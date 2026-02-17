import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LawyerCTA = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return null;

  const handleNavigate = () => {
    navigate("/lawyer-consultation", {
      state: { matchData: data }
    });
  };

  return (
    <div className="flex gap-4 w-full animate-fade-in">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/40 border border-indigo-400/30">
        <Sparkles size={18} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <div className="text-sm font-semibold text-slate-100">Lawyer Consultation</div>
              <div className="text-xs text-slate-400">
                Category: <span className="text-indigo-300 font-semibold">{data.category}</span> | Urgency: <span className="text-slate-200 font-semibold">{data.urgency}</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Free & Unlimited
            </div>
          </div>

          <p className="text-sm text-slate-300">
            We found <span className="font-semibold text-slate-100">{data.matched_lawyers?.length || 0}</span> lawyers for your query. Continue to the consultation page to connect.
          </p>

          <button
            onClick={handleNavigate}
            className="mt-4 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            Go to Lawyer Consultation
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LawyerCTA);
