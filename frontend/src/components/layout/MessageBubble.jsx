import React from "react";
import { User, Bot } from "lucide-react";
import LegalResponseContainer from './LegalResponseContainer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ text, sender = "user", isStreaming }) => {
  const isUser = sender === "user";

  // Check if the response is a structured legal analysis
  const isStructuredResponse = !isUser && text.includes("### Understanding Your Situation");

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 rounded-2xl rounded-br-sm max-w-[85%] md:max-w-[70%] shadow-xl hover:shadow-indigo-500/40 transition-shadow duration-300 border border-indigo-400/30 backdrop-blur-sm">
          <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{text}</p>
        </div>
      </div>
    );
  }

  // Render the new legal response container for structured answers
  if (isStructuredResponse) {
    return <LegalResponseContainer text={text} />;
  }

  // Fallback for simple/non-structured assistant messages
  return (
    <div className="flex gap-4 w-full animate-fade-in">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shrink-0 mt-1 shadow-lg border border-slate-600/50">
        <Bot size={18} className="text-indigo-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur rounded-2xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 shadow-lg">
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {text}
             </ReactMarkdown>
          </div>
          {isStreaming && (
            <div className="h-3 w-24 bg-slate-700/80 rounded-full animate-pulse mt-3" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
