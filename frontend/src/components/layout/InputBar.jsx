import React, { useRef, useEffect } from "react";
import { Send, ArrowUp } from "lucide-react";

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
    <div className="p-4 bg-[var(--bg-primary)]/80 backdrop-blur-md sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto relative flex items-end gap-2 p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-lg transition-all focus-within:ring-2 focus-within:ring-[var(--accent-primary)]/20 focus-within:border-[var(--accent-primary)]/50">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-base p-3 max-h-40 min-h-[50px] resize-none focus:outline-none scrollbar-hide"
          rows={1}
          placeholder="Describe your legal situation..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="mb-1 p-2.5 rounded-xl bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-tertiary)] transition-all shadow-md hover:shadow-glow active:scale-95 disabled:shadow-none"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ArrowUp size={20} strokeWidth={3} />
          )}
        </button>
      </div>
      <div className="text-center mt-2">
        <p className="text-xs text-[var(--text-tertiary)]">
          NyayVidhi can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default React.memo(InputBar);
