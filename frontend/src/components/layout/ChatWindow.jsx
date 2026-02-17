import React, { useEffect, useRef } from "react";
import { Menu, PanelRight, Sparkles } from "lucide-react";
import InputBar from "./InputBar";
import MessageBubble from "./MessageBubble";
import EmptyState from "../EmptyState"; // Assuming this exists, might need refactor too but skipping for now

const ChatWindow = ({
  messages,
  isLoading,
  input,
  setInput,
  onSendMessage,
  onOpenSidebar,
  onOpenAnalysis,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg-primary)] relative">
      {/* Header - Mobile Only mostly, but stays for structure */}
      <header className="shrink-0 h-16 border-b border-[var(--divider-color)] bg-[var(--bg-primary)]/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex flex-col lg:hidden">
            <span className="font-display font-bold text-[var(--text-primary)]">NyayVidhi</span>
          </div>
           {/* Desktop Title if needed, or breadcrumbs */}
           <div className="hidden lg:flex items-center gap-2 text-[var(--text-secondary)] text-sm">
              <Sparkles size={14} className="text-[var(--accent-primary)]"/>
              <span>AI Legal Assistant</span>
           </div>
        </div>

        <button
          onClick={onOpenAnalysis}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
        >
          <PanelRight size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
             <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                <Sparkles size={32} className="text-[var(--accent-primary)]" />
             </div>
             <h2 className="text-3xl font-display font-bold text-[var(--text-primary)] mb-3">
               How can I help you today?
             </h2>
             <p className="max-w-md text-[var(--text-secondary)] text-lg">
               Ask about Indian Penal Code sections, legal procedures, or case analysis.
             </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              text={message.text}
              sender={message.sender}
              sections={message.sections}
              confidence={message.confidence}
              isStreaming={message.isStreaming} // You might need to handle streaming state if implemented
            />
          ))
        )}
        
        {isLoading && (
           <div className="flex w-full justify-start animate-fade-in">
              <div className="glass-card px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                 <span className="typing-dot bg-[var(--accent-primary)]"/>
                 <span className="typing-dot bg-[var(--accent-primary)]"/>
                 <span className="typing-dot bg-[var(--accent-primary)]"/>
              </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
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
