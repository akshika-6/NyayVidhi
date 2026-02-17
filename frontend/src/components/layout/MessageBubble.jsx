import React from "react";
import { Copy, Check, User, Bot } from "lucide-react";

const MessageBubble = ({ text, sender = "user", isStreaming }) => {
  const isUser = sender === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[85%] md:max-w-[70%] shadow-sm">
          <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full animate-fade-in group">
      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1">
        <Bot size={18} className="text-indigo-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
          {text}
          {isStreaming && <span className="typing-dot bg-slate-400 ml-1" />}
        </div>
        
        {/* Actions Footer */}
        {!isStreaming && (
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleCopy}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              title="Copy"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
