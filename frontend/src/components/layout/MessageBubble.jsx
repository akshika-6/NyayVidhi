import React from "react";
import { Copy, Check } from "lucide-react";

const MessageBubble = ({ text, sender = "user", sections = [], confidence, isStreaming }) => {
  const isUser = sender === "user";
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-fade-in group`}>
      <div
        className={`max-w-[85%] lg:max-w-[70%] relative ${
          isUser
            ? "bg-[var(--accent-primary)] text-white rounded-2xl rounded-tr-sm shadow-md"
            : "glass-card text-[var(--text-primary)] rounded-2xl rounded-tl-sm shadow-sm"
        }`}
      >
        <div className="p-4 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {text}
          {isStreaming && <span className="typing-dot animate-pulse ml-1" />}
        </div>
        
        {/* Meta info for Assistant */}
        {!isUser && !isStreaming && (
          <div className="px-4 pb-3 flex items-center justify-between gap-3 text-xs text-[var(--text-tertiary)] border-t border-[var(--border-color)]/30 pt-3 mt-1">
             <div className="flex items-center gap-2">
                {sections.length > 0 && (
                 <span className="flex items-center gap-1">
                   ⚖️ {sections.length} Sections
                 </span>
                )}
                {confidence && (
                  <span className={`px-1.5 py-0.5 rounded-md ${
                    confidence.toLowerCase() === 'high' ? 'bg-green-500/10 text-green-500' : 
                    confidence.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {confidence} Confidence
                  </span>
                )}
             </div>
             
             <button 
               onClick={handleCopy}
               className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--bg-tertiary)] rounded"
               title="Copy message"
             >
               {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
