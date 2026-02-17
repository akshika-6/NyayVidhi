import React from "react";
import { X, Copy, Check, Scale, BookOpen, AlertCircle, ShieldAlert } from "lucide-react";

const SectionItem = ({ title, children, icon: Icon, color = "text-[var(--accent-primary)]" }) => (
  <div className="bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-xl p-4 mb-4 transition-all hover:border-[var(--accent-primary)]/30">
    <div className="flex items-center gap-2 mb-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
      <Icon size={14} className={color} />
      {title}
    </div>
    <div className="text-[var(--text-primary)] text-sm leading-relaxed">
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
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!analysis) return;
    const text = `Summary: ${analysis.summary}\nReasoning: ${analysis.legal_reasoning}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Content = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-[var(--bg-tertiary)] rounded-xl"></div>
          <div className="h-20 bg-[var(--bg-tertiary)] rounded-xl"></div>
          <div className="h-40 bg-[var(--bg-tertiary)] rounded-xl"></div>
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[var(--text-tertiary)]">
          <Scale size={48} className="mb-4 opacity-20" />
          <p>Legal analysis will appear here after your inquiry.</p>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar pb-24">
         {/* Summary Header */}
         <div>
            <span className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-widest mb-2 block">
              Case Summary
            </span>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)] leading-tight">
              {analysis.summary || "No summary available"}
            </h2>
         </div>

         {/* Sections Tag Cloud */}
         <div className="flex flex-wrap gap-2">
            {analysis.sections && analysis.sections.length > 0 ? (
               analysis.sections.map((sec, i) => (
                 <span key={i} className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs rounded-full border border-[var(--border-color)] font-mono">
                   {sec}
                 </span>
               ))
            ) : (
              <span className="text-xs text-[var(--text-tertiary)] italic">No specific sections cited</span>
            )}
         </div>

         {/* Detailed Analysis */}
         <SectionItem title="Legal Reasoning" icon={BookOpen}>
            {analysis.legal_reasoning || "No reasoning provided."}
         </SectionItem>

         {/* Disclaimer */}
         <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
            <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200/80 leading-relaxed">
              {analysis.disclaimer || "This is AI-generated information and does not constitute professional legal advice."}
            </p>
         </div>
      </div>
    );
  };

  const wrapperClass = variant === "drawer"
    ? `fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`
    : "hidden md:flex w-[400px] min-w-[400px] bg-[var(--bg-secondary)] border-l border-[var(--divider-color)] flex-col h-full";

  const backdropClass = variant === "drawer"
    ? `absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`
    : "hidden";

  const panelClass = variant === "drawer"
    ? `absolute right-0 top-0 w-[90%] max-w-[360px] h-full bg-[var(--bg-secondary)] shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`
    : "flex flex-col h-full";

  return (
    <aside className={wrapperClass}>
      <div className={backdropClass} onClick={onClose} />
      
      <div className={panelClass}>
        {/* Header */}
        <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-[var(--divider-color)] bg-[var(--bg-secondary)]/95 backdrop-blur">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
             <ShieldAlert size={18} className="text-[var(--accent-primary)]"/>
             <span>Analysis</span>
          </div>
          <div className="flex items-center gap-1">
             <button
               onClick={handleCopy}
               className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
               disabled={!analysis}
             >
               {copied ? <Check size={18} className="text-[var(--success)]" /> : <Copy size={18} />}
             </button>
             {variant === "drawer" && (
                <button
                onClick={onClose}
                className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
             )}
          </div>
        </div>

        <Content />
      </div>
    </aside>
  );
};

export default React.memo(AnalysisPanel);
