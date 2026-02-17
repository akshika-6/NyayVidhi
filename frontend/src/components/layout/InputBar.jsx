import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, AlertCircle } from "lucide-react";

const InputBar = ({ input, setInput, onSendMessage, isLoading }) => {
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6 pt-4">
      <div className="relative flex flex-col bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl shadow-2xl ring-1 ring-white/5 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/60 transition-all duration-300 hover:shadow-indigo-500/20">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-[15px] px-5 py-4 max-h-[200px] min-h-[56px] resize-none focus:outline-none scrollbar-hide font-medium"
          rows={1}
          placeholder="Ask a legal question to match with lawyers..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="flex items-center justify-between px-5 pb-4 pt-3 border-t border-slate-700/30">
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <AlertCircle size={13} className="text-indigo-400/70" />
            Press Enter to send
          </p>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 disabled:shadow-none font-semibold"
            title="Send message (Ctrl+Enter)"
          >
            <ArrowUp size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-slate-600 mt-3 flex items-center justify-center gap-2 font-medium flex-wrap">
        <span>🎓 NyayVidhi Legal Assistant</span>
      </p>
    </div>
  );
};

export default React.memo(InputBar);
