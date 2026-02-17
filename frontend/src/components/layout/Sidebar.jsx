import React from "react";
import { MessageSquare, Plus, Trash2, LogOut, Settings } from "lucide-react";

// Mock history for now
const MOCK_HISTORY = [
  "Contract breach remedies",
  "IPC 420 overview",
  "Property dispute steps",
  "Cyber fraud complaint",
  "Divorce petition process",
  "Check bounce norms"
];

const Sidebar = ({ onClearConversation, isOpen, onClose, variant = "desktop" }) => {
  const sidebarClasses = variant === "mobile"
    ? `fixed inset-y-0 left-0 z-50 w-[260px] bg-[#0f172a] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
    : "hidden md:flex md:w-[260px] md:flex-col bg-[#0f172a] border-r border-white/5";

  return (
    <>
      {/* Mobile Overlay */}
      {variant === "mobile" && isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full p-3">
          {/* New Chat Button */}
          <button
            onClick={onClearConversation}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm mb-4 group"
          >
            <Plus size={18} className="text-white" />
            <span className="text-sm font-medium">New Chat</span>
          </button>

          {/* History List */}
          <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-1">
            <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today
            </h3>
            {MOCK_HISTORY.map((item, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors truncate group flex items-center justify-between"
              >
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>

          {/* Footer User Profile */}
          <div className="pt-3 border-t border-white/10 mt-2">
            <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors text-left">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">User Account</div>
                <div className="text-xs text-slate-500">Free Plan</div>
              </div>
              <Settings size={16} className="text-slate-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
