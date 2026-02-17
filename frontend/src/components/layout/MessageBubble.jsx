import React from "react";
import { Copy, Check, User, Bot, ThumbsUp, ThumbsDown } from "lucide-react";

const MessageBubble = ({ text, sender = "user", isStreaming }) => {
  const isUser = sender === "user";
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    setTimeout(() => setFeedback(null), 1500);
  };

  const formatText = (text) => {
    // Format sections like "Relevant IPC Sections:" with bold
    return text.split('\n').map((line, idx) => {
      if (line.includes(':') && (line.includes('IPC') || line.includes('Section') || line.includes('Disclaimer') || line.includes('Confidence'))) {
        const [label, ...rest] = line.split(':');
        return (
          <div key={idx} className="mb-3">
            <div className="font-semibold text-slate-100 mb-1">{label}:</div>
            <div className="text-slate-300 ml-2">{rest.join(':')}</div>
          </div>
        );
      }
      if (line.startsWith('•')) {
        return <div key={idx} className="ml-4 text-slate-300 mb-1">{line}</div>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <div key={idx} className="text-slate-300 mb-2 leading-relaxed">{line}</div>;
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 rounded-2xl rounded-br-sm max-w-[85%] md:max-w-[70%] shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 border border-indigo-400/30 backdrop-blur-sm">
          <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full animate-fade-in group">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/40 border border-indigo-400/30">
        <Bot size={18} className="text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 shadow-lg">
          <div className="text-slate-100 leading-relaxed text-[15px] font-medium">
            {formatText(text)}
            {isStreaming && <span className="inline-flex ml-1 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 animate-pulse" />}
          </div>
        </div>
        
        {/* Actions Footer */}
        {!isStreaming && (
          <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleCopy}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300 border border-transparent hover:border-indigo-500/30"
              title="Copy message"
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            </button>
            <button 
              onClick={() => handleFeedback('up')}
              className={`p-2 rounded-lg transition-all duration-300 border ${
                feedback === 'up' 
                  ? 'text-green-400 bg-green-500/20 border-green-500/50' 
                  : 'text-slate-500 hover:text-green-400 hover:bg-green-500/10 border-transparent hover:border-green-500/30'
              }`}
              title="Helpful"
            >
              <ThumbsUp size={16} />
            </button>
            <button 
              onClick={() => handleFeedback('down')}
              className={`p-2 rounded-lg transition-all duration-300 border ${
                feedback === 'down' 
                  ? 'text-red-400 bg-red-500/20 border-red-500/50' 
                  : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10 border-transparent hover:border-red-500/30'
              }`}
              title="Not helpful"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
