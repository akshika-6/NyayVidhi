import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading, setInput, input }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-panel border-t border-border shrink-0">
      <div className="relative flex items-center gap-3">
        <textarea
          className="grow bg-background border border-border rounded-large p-3 pr-12 text-text-primary resize-none overflow-hidden max-h-40 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-card focus:outline-none focus:border-accent transition-colors"
          rows="1"
          placeholder="Describe your legal situation..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = 'auto'; // Reset height
            e.target.style.height = e.target.scrollHeight + 'px'; // Set new height
          }}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className="absolute right-3 flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-white disabled:bg-gray-600 transition-all hover:bg-indigo-700"
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
        >
          <Send size={18} />
          <span className="hidden sm:inline text-sm font-semibold">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
