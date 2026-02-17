import React, { useEffect, useRef } from "react";
import { Menu, PanelRight, Shield, Command } from "lucide-react";
import InputBar from "./InputBar";
import MessageBubble from "./MessageBubble";
import EmptyState from "../EmptyState"; // We'll keep EmptyState but might need a tweak too

const ChatWindow = ({
  messages,
  isLoading,
  input,
  setInput,
  onSendMessage,
  onOpenSidebar,
  onOpenAnalysis,
  isAnalysisOpen
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Top Mobile Bar */}
      <header className="shrink-0 h-14 md:hidden flex items-center justify-between px-4 sticky top-0 bg-[#0b1020]/80 backdrop-blur z-20 border-b border-white/5">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-slate-200">NyayVidhi</span>
        <button
          onClick={onOpenAnalysis}
          className={`p-2 -mr-2 ${isAnalysisOpen ? 'text-indigo-400' : 'text-slate-400'} hover:text-white`}
        >
          <PanelRight size={20} />
        </button>
      </header>

      {/* Desktop Top Bar (Minimal) */}
      <header className="hidden md:flex shrink-0 h-14 items-center justify-between px-6 sticky top-0 z-20">
         <div className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
            <span className="font-medium">NyayVidhi</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-500 border border-white/5">Beta</span>
         </div>
         <div className="flex items-center">
            {/* Can add model selector here later */}
         </div>
      </header>

      {/* Messages Area - Centered Column */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col min-h-full max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-4">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center space-y-4 max-w-sm">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">Describe your legal situation</h2>
                  <p className="text-slate-400 leading-relaxed">
                    NyayVidhi will identify applicable IPC sections and provide a preliminary analysis.
                  </p>
               </div>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  text={message.text}
                  sender={message.sender}
                  isStreaming={message.isStreaming}
                />
              ))}
              
              {isLoading && (
                <div className="flex gap-4 w-full animate-fade-in">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 mt-1">
                      <Shield size={16} className="text-indigo-400" />
                   </div>
                   <div className="flex items-center h-8">
                      <span className="text-xs text-slate-500 font-medium animate-pulse">NyayVidhi is thinking...</span>
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
