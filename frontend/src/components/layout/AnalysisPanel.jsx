import React from "react";
import { X, Scale, AlertTriangle, Book, ChevronRight, Sparkles } from "lucide-react";

const SectionCard = ({ title, children, icon: Icon, className = "" }) => (
  <div className={`p-4 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-indigo-500/10 hover:border-indigo-500/20 space-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 ${className}`}>
    <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-widest">
      {Icon && <Icon size={13} className="text-indigo-400 drop-shadow-lg" />}
      <span className="tracking-wider">{title}</span>
    </div>
    <div className="text-sm text-slate-300 leading-relaxed font-medium">
      {children}
    </div>
  </div>
);

const AnalysisPanel = ({
  analysis,
  isLoading = false,
  variant = "desktop",
  isOpen = false,
  onClose,
}) => {
  if (!isOpen && variant === "desktop") return null;

  const widthClass = variant === "desktop" ? "w-[340px] min-w-[340px]" : "w-full";
  const containerClass = variant === "desktop" 
    ? `hidden md:flex flex-col h-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 border-l border-indigo-500/10 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl ${widthClass}`
    : `fixed inset-y-0 right-0 z-50 w-[320px] bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 space-y-4 animate-pulse">
           <div className="h-6 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded w-2/3"></div>
           <div className="h-32 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-xl border border-indigo-500/20"></div>
           <div className="h-20 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-xl border border-indigo-500/20"></div>
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
           <Scale size={36} className="mb-4 text-indigo-400/50 drop-shadow-lg" />
           <p className="text-sm text-slate-400 font-medium">Analysis details will appear here</p>
        </div>
      );
    }

    const showSignals = analysis.category || analysis.urgency || analysis.rate_limit || analysis.matched_count;

    // Ensure summary is always a string
    const summaryText = typeof analysis.summary === 'string' 
      ? analysis.summary 
      : (analysis.summary && typeof analysis.summary === 'object')
        ? JSON.stringify(analysis.summary)
        : String(analysis.summary || '');

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {/* Summary */}
         <div className="mb-4 pb-4 border-b border-indigo-500/10 space-y-2">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
              Summary
            </h3>
            <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100 leading-snug">{summaryText}</h2>
         </div>

         {/* Tags */}
         <div className="flex flex-wrap gap-2 mb-4">
            {analysis.sections?.map((sec, i) => (
               <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:border-indigo-400/60 text-xs rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 backdrop-blur-sm">
                 {sec}
               </span>
            ))}
            {analysis.confidence && (
              <span className={`px-3 py-1.5 text-xs rounded-lg border font-bold transition-all duration-300 ${
                 analysis.confidence.toLowerCase() === 'high' ? 'bg-gradient-to-r from-green-500/30 to-green-600/30 text-green-200 border-green-500/40 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20' : 
                 analysis.confidence.toLowerCase() === 'medium' ? 'bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 text-yellow-200 border-yellow-500/40 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-500/20' : 
                 'bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-200 border-red-500/40 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20'
              }`}>
                {analysis.confidence}
              </span>
            )}
         </div>

         {showSignals && (
           <SectionCard title="Case Signals" icon={ChevronRight}>
             <div className="space-y-2">
               {analysis.category && (
                 <div>
                   <span className="text-slate-400">Category:</span> {analysis.category}
                 </div>
               )}
               {analysis.urgency && (
                 <div>
                   <span className="text-slate-400">Urgency:</span> {analysis.urgency}
                 </div>
               )}
               {analysis.matched_count !== undefined && (
                 <div>
                   <span className="text-slate-400">Matched lawyers:</span> {analysis.matched_count}
                 </div>
               )}
               {analysis.rate_limit && (
                 <div>
                   <span className="text-slate-400">Queries remaining:</span> {analysis.rate_limit.queries_remaining}
                 </div>
               )}
             </div>
           </SectionCard>
         )}

         {analysis.legal_reasoning && (
           <SectionCard title="Legal Reasoning" icon={Book}>
             {analysis.legal_reasoning}
           </SectionCard>
         )}

         {/* Judgment Summary */}
         {analysis.judgment_comparison && analysis.judgment_comparison.judgments && analysis.judgment_comparison.judgments.length > 0 && (
           <SectionCard title="Case Law" icon={Scale}>
             <div className="space-y-2">
               <div className="text-xs font-semibold text-indigo-300 mb-2">
                 {analysis.judgment_comparison.judgments.length} Relevant Judgments Found
               </div>
               {analysis.judgment_comparison.judgments.map((judgment, i) => (
                 <div key={i} className="text-xs border-l-2 border-indigo-500/30 pl-2 mb-2">
                   <div className="font-semibold text-slate-200">{judgment.case_name}</div>
                   <div className="text-slate-400">{judgment.citation}</div>
                 </div>
               ))}
               <div className="text-xs text-slate-400 mt-2">
                 View full comparison in chat window →
               </div>
             </div>
           </SectionCard>
         )}

         {analysis.disclaimer && (
           <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/20 hover:border-amber-500/30 flex gap-3 items-start transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10">
             <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0 drop-shadow-lg" />
             <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
               {analysis.disclaimer}
             </p>
           </div>
         )}
      </div>
    );
  };

  return (
    <>
      {variant === "mobile" && isOpen && (
         <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />
      )}
      <aside className={containerClass}>
        <div className="shrink-0 h-14 border-b border-indigo-500/10 flex items-center justify-between px-4 bg-gradient-to-r from-slate-900/95 via-indigo-900/20 to-slate-950/95 backdrop-blur-xl">
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-100 text-sm flex items-center gap-2">
            <Sparkles size={14} className="text-indigo-400 drop-shadow-lg" />
            Analysis
          </span>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-indigo-300 rounded-lg hover:bg-indigo-500/10 transition-all duration-300 border border-transparent hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/20"
            title="Close panel"
          >
            <X size={16} />
          </button>
        </div>
        {renderContent()}
      </aside>
    </>
  );
};

export default React.memo(AnalysisPanel);
