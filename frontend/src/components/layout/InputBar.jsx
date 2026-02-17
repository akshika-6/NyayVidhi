import React, { useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const InputBar = ({ input, setInput, onSendMessage, isLoading }) => {
  const textareaRef = useRef(null);

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
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg ring-1 ring-white/5 focus-within:ring-white/10 transition-all">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-[15px] px-4 py-3.5 max-h-[200px] min-h-[52px] resize-none focus:outline-none scrollbar-hide"
          rows={1}
          placeholder="Describe your legal situation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <div className="absolute right-2 bottom-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white transition-all shadow-sm"
          >
            <ArrowUp size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
      <p className="text-center text-[10px] text-slate-600 mt-2.5">
        NyayVidhi can make mistakes. Please consult a qualified lawyer.
      </p>
    </div>
  );
};

export default React.memo(InputBar);
