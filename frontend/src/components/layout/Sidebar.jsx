import React from "react";
import { MessageSquare, Plus, Trash2, Settings, History, LogOut } from "lucide-react";
import { useAuth } from "../AuthContext";

const Sidebar = ({ onClearConversation, history = [], activeChatId, onSelectHistory, isOpen, onClose, variant = "desktop" }) => {
  const { user, logout } = useAuth();
  const sidebarClasses = variant === "mobile"
    ? `fixed inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-slate-900 to-slate-950 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} shadow-2xl`
    : "hidden md:flex md:w-[280px] md:flex-col bg-gradient-to-b from-slate-900/80 to-slate-950 border-r border-indigo-500/10";

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
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 font-bold mb-4 group border border-indigo-400/20"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-bold">New Chat</span>
          </button>

          {/* History List */}
          <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-2">
            <h3 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <History size={12} className="text-indigo-400" />
              Recent Chats
            </h3>
            
            {history.length > 0 ? (
              history.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectHistory(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-300 truncate group flex items-center justify-between border ${
                    activeChatId === chat.id 
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" 
                      : "text-slate-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-indigo-600/10 hover:text-indigo-300 border-transparent hover:border-indigo-400/20"
                  } font-medium`}
                >
                  <span className="truncate">{chat.title}</span>
                  <MessageSquare size={14} className={`${activeChatId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity shrink-0 ml-2`} />
                </button>
              ))
            ) : (
              <div className="px-3 py-10 text-center">
                <div className="text-slate-600 italic text-sm mb-2">No recent chats</div>
                <p className="text-xs text-slate-700">Your conversations will appear here</p>
              </div>
            )}
          </div>

          {/* Footer User Profile */}
          <div className="pt-3 border-t border-slate-700/50 mt-2 space-y-2">
            <button className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-all duration-300 text-left border border-transparent font-medium group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-indigo-500/30">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{user?.name || "User Account"}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user ? "Professional Plan" : "Free Plan"}</div>
              </div>
              <Settings size={16} className="text-slate-500 hover:text-indigo-400 transition-colors shrink-0" />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-300 text-left border border-transparent font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <LogOut size={16} />
              </div>
              <span className="text-sm font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default React.memo(Sidebar);
