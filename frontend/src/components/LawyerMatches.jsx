import React from "react";
import { ShieldCheck, MapPin, Star, Circle, Sparkles } from "lucide-react";

const LawyerMatches = ({ data, onConnect, connectingLawyerId }) => {
  if (!data || !data.matched_lawyers || data.matched_lawyers.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-4 w-full animate-fade-in">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/40 border border-indigo-400/30">
        <Sparkles size={18} className="text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-sm font-semibold text-slate-100">Matched Lawyers</div>
              <div className="text-xs text-slate-400">
                Category: <span className="text-indigo-300 font-semibold">{data.category}</span> | Urgency: <span className="text-slate-200 font-semibold">{data.urgency}</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              Free & Unlimited
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.matched_lawyers.map((lawyer) => (
              <div
                key={lawyer.id}
                className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={lawyer.profile_image}
                    alt={lawyer.name}
                    className="w-12 h-12 rounded-xl object-cover border border-indigo-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-100 truncate">{lawyer.name}</span>
                      <ShieldCheck size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <MapPin size={12} className="text-slate-500" />
                      {lawyer.city}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {lawyer.specialization.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 text-[11px] rounded-lg bg-indigo-500/20 text-indigo-200 border border-indigo-500/30"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400" />
                    {lawyer.rating}
                  </span>
                  <span>{lawyer.experience}</span>
                  <span className="flex items-center gap-1">
                    <Circle size={8} className={lawyer.availability === "online" ? "text-emerald-400" : "text-slate-500"} />
                    {lawyer.availability}
                  </span>
                </div>

                <button
                  onClick={() => onConnect(lawyer)}
                  disabled={connectingLawyerId === lawyer.id}
                  className="mt-4 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold transition-all duration-300 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400"
                >
                  {connectingLawyerId === lawyer.id ? "Connecting..." : "Connect"}
                </button>
              </div>
            ))}
          </div>

          {data.rate_limit && (
            <div className="mt-4 text-xs text-slate-400">
              Daily limit: {data.rate_limit.queries_used}/{data.rate_limit.queries_used + data.rate_limit.queries_remaining} used
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(LawyerMatches);
