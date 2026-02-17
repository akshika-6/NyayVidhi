import React from "react";
import { X, Scale, AlertTriangle, Book, ChevronRight } from "lucide-react";

const SectionCard = ({ title, children, icon: Icon, className = "" }) => (
  <div className={`p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 ${className}`}>
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
      {Icon && <Icon size={12} />}
      <span>{title}</span>
    </div>
    <div className="text-sm text-slate-200 leading-relaxed">
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

  const widthClass = variant === "desktop" ? "w-[320px] min-w-[320px]" : "w-full";
  const containerClass = variant === "desktop" 
    ? `hidden md:flex flex-col h-full bg-[#0b1020] border-l border-white/5 ${widthClass}`
    : `fixed inset-y-0 right-0 z-50 w-[300px] bg-[#0b1020] shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 space-y-4 animate-pulse">
           <div className="h-6 bg-slate-800 rounded w-1/3 mb-6"></div>
           <div className="h-32 bg-slate-800 rounded-xl"></div>
           <div className="h-20 bg-slate-800 rounded-xl"></div>
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-40">
           <Scale size={32} className="mb-4 text-slate-500" />
           <p className="text-sm text-slate-400">Analysis details will appear here</p>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {/* Summary */}
         <div className="mb-2">
            <h2 className="text-lg font-semibold text-white mb-1">{analysis.summary}</h2>
         </div>

         {/* Tags */}
         <div className="flex flex-wrap gap-2 mb-2">
            {analysis.sections?.map((sec, i) => (
               <span key={i} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs rounded-md font-mono">
                 {sec}
               </span>
            ))}
            {analysis.confidence && (
              <span className={`px-2.5 py-1 text-xs rounded-md border ${
                 analysis.confidence.toLowerCase() === 'high' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                 analysis.confidence.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {analysis.confidence} Confidence
              </span>
            )}
         </div>

         <SectionCard title="Reasoning" icon={Book}>
            {analysis.legal_reasoning}
         </SectionCard>

         <div className="mt-4 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 flex gap-2 items-start">
            <AlertTriangle size={14} className="text-orange-400 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-200/60 leading-relaxed">
               {analysis.disclaimer}
            </p>
         </div>
      </div>
    );
  };

  return (
    <>
      {variant === "mobile" && isOpen && (
         <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      )}
      <aside className={containerClass}>
        <div className="shrink-0 h-14 border-b border-white/5 flex items-center justify-between px-4">
          <span className="font-semibold text-slate-300 text-sm">Case Analysis</span>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>
        </div>
        {renderContent()}
      </aside>
    </>
  );
};

export default React.memo(AnalysisPanel);
