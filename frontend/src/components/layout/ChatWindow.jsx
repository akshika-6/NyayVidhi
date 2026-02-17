import React, { useEffect, useRef } from "react";
import { Menu, PanelRight, Shield, Sparkles } from "lucide-react";
import InputBar from "./InputBar";
import MessageBubble from "./MessageBubble";
import LawyerCTA from "../LawyerCTA";

const ChatWindow = ({
  messages,
  isLoading,
  input,
  setInput,
  onSendMessage,
  onOpenSidebar,
  onOpenAnalysis,
  isAnalysisOpen,
  preferredLanguage,
  onChangeLanguage,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const quickQuestions = [
    "My husband is asking for divorce without reason",
    "Someone hacked my Instagram account",
    "Cheque bounced, what are my options?",
    "Boss terminated me without notice"
  ];

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Top Mobile Bar */}
      <header className="shrink-0 h-14 md:hidden flex items-center justify-between px-4 sticky top-0 bg-gradient-to-b from-slate-900/95 to-slate-900/80 backdrop-blur z-20 border-b border-indigo-500/20">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-indigo-400 transition-colors duration-200"
        >
          <Menu size={20} />
        </button>
        <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles size={18} className="text-indigo-400" />
          NyayVidhi
        </span>
        <button
          onClick={onOpenAnalysis}
          className={`p-2 -mr-2 transition-all duration-200 ${isAnalysisOpen ? 'text-indigo-400 bg-indigo-500/20 rounded-lg' : 'text-slate-400 hover:text-indigo-400'}`}
        >
          <PanelRight size={20} />
        </button>
      </header>

      {/* Desktop Top Bar */}
      <header className="hidden md:flex shrink-0 h-20 items-center justify-between px-8 sticky top-0 z-20 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent border-b border-indigo-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">NyayVidhi</div>
            <div className="text-xs text-slate-500">Legal AI Assistant</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Language
          </span>
          <select
            value={preferredLanguage}
            onChange={(e) => onChangeLanguage?.(e.target.value)}
            className="bg-slate-900/80 border border-indigo-500/30 text-xs text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
          </select>
        </div>
      </header>

      {/* Messages Area - Centered Column */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col min-h-full max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-4">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
               {/* Main Title Section */}
               <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/25 border border-indigo-400/20 hover:shadow-indigo-500/40 transition-all duration-300">
                    <Shield size={40} className="text-indigo-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                      Welcome to <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">NyayVidhi</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                      Your AI-powered legal assistant for the Indian Penal Code. Get instant analysis of legal situations and IPC sections.
                    </p>
                  </div>
               </div>

               {/* Features Grid */}
               <div className="w-full max-w-2xl">
                 <div className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-4 text-center">✨ Powered by Advanced AI</div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {[
                     { icon: '⚖️', label: 'IPC Analysis' },
                     { icon: '📋', label: 'Section Search' },
                     { icon: '🔍', label: 'Case Law' },
                     { icon: '⚡', label: 'Instant Response' },
                     { icon: '📊', label: 'Legal Reasoning' },
                     { icon: '🛡️', label: 'Confidential' }
                   ].map((feature, idx) => (
                     <div 
                       key={idx}
                       className="px-4 py-3 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-indigo-500/10 hover:border-indigo-500/30 text-center transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
                     >
                       <div className="text-xl mb-1">{feature.icon}</div>
                       <div className="text-xs font-semibold text-slate-300">{feature.label}</div>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Quick Actions */}
               <div className="w-full max-w-2xl">
                 <p className="text-xs uppercase font-bold text-slate-500 tracking-widest mb-4 text-center">Try Asking:</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {quickQuestions.map((q, idx) => (
                     <button
                       key={idx}
                       onClick={() => onSendMessage(q)}
                       className="px-5 py-4 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-300 text-sm font-medium transition-all duration-300 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-indigo-500/10 group"
                     >
                       <div className="flex items-center justify-between">
                         <span>{q}</span>
                         <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.map((message) => {
                if (message.type === "lawyer_cta") {
                  return (
                    <LawyerCTA
                      key={message.id}
                      data={message.data}
                    />
                  );
                }

                return (
                  <MessageBubble
                    key={message.id}
                    text={message.text}
                    sender={message.sender}
                    isStreaming={message.isStreaming}
                  />
                );
              })}
              
              {isLoading && (
                <div className="flex gap-4 w-full animate-fade-in">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-indigo-500/30">
                      <Shield size={16} className="text-white" />
                   </div>
                   <div className="flex items-center gap-3 h-8">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent font-semibold">Analyzing your query...</span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-0" />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Centered Bottom */}
      <InputBar
        input={input}
        setInput={setInput}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default React.memo(ChatWindow);
