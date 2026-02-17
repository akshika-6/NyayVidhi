import React from "react";
import { User, Bot } from "lucide-react";
import LegalResponseContainer from './LegalResponseContainer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ text, sender = "user", isStreaming }) => {
  const isUser = sender === "user";

  // Ensure text is always a string
  const safeText = typeof text === 'string' ? text : (text ? String(text) : '');

  // Check if the response is a structured legal analysis
  const isStructuredResponse = !isUser && safeText.includes("### Understanding Your Situation");

  const formatText = (text) => {
    // Ensure text is a string before processing
    const textToFormat = typeof text === 'string' ? text : (text ? String(text) : '');
    if (!textToFormat) {
      return <div className="text-slate-300">No content available.</div>;
    }
    // Format sections like "Relevant IPC Sections:" with bold
    return textToFormat.split('\n').map((line, idx) => {
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
          <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{safeText}</p>
        </div>
      </div>
    );
  }

  // Render the new legal response container for structured answers
  if (isStructuredResponse) {
    return <LegalResponseContainer text={safeText} />;
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
              {safeText}
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
