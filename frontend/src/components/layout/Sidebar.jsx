import React from "react";
import { MessageSquare, Moon, Sun, X, Gavel, History, ChevronRight, Plus } from "lucide-react";

const HISTORY_ITEMS = [
  "Contract breach remedies",
  "IPC 420 overview",
  "Property dispute steps",
];

const QUICK_EXAMPLES = [
  "Someone stole my wallet",
  "Employer withheld my salary",
  "Tenant refused to vacate",
];

const SidebarContent = ({ onClearConversation, onToggleTheme, isDarkMode, showClose, onClose }) => {
  return (
    <div className="flex h-full flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-glow">
            <Gavel size={18} />
          </div>
          <span className="text-xl font-display font-bold text-[var(--text-primary)] tracking-tight">
            NyayVidhi
          </span>
        </div>
        {showClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={onClearConversation}
        className="btn-primary w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium mb-8"
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>New Consultation</span>
      </button>

      {/* Navigation Areas */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 px-2">
            Quick Start
          </h3>
          <div className="space-y-1">
            {QUICK_EXAMPLES.map((item, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all group flex items-center justify-between"
              >
                <span className="truncate">{item}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-tertiary)]" />
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
           <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
            <History size={12} /> Recent
          </h3>
          <div className="space-y-1">
            {HISTORY_ITEMS.map((item, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all truncate"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Theme Toggle */}
      <div className="pt-4 mt-4 border-t border-[var(--divider-color)]">
        <button
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-primary)]/50 transition-all group"
        >
          <div className="flex items-center gap-3">
             <div className="p-1.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
             </div>
             <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
               {isDarkMode ? "Dark Mode" : "Light Mode"}
             </span>
          </div>
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({
  onClearConversation,
  onToggleTheme,
  isDarkMode,
  variant = "desktop",
  isOpen = false,
  onClose,
}) => {
  if (variant === "drawer") {
    return (
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
      >
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} 
          onClick={onClose} 
        />
        <aside
          className={`absolute left-0 top-0 w-[280px] h-full bg-[var(--bg-secondary)] border-r border-[var(--border-color)] p-5 transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SidebarContent
            onClearConversation={onClearConversation}
            onToggleTheme={onToggleTheme}
            isDarkMode={isDarkMode}
            showClose
            onClose={onClose}
          />
        </aside>
      </div>
    );
  }

  return (
    <aside className="w-[280px] min-w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--divider-color)] p-5 hidden lg:flex flex-col h-full">
      <SidebarContent
        onClearConversation={onClearConversation}
        onToggleTheme={onToggleTheme}
        isDarkMode={isDarkMode}
      />
    </aside>
  );
};

export default React.memo(Sidebar);
