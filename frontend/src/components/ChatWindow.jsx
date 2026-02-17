import React, { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

const ChatWindow = ({ messages, isLoading, onSendMessage, input, setInput }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]); // Scroll when messages or loading state changes

  return (
    <div className="flex flex-col h-full min-w-0">
      <header className="shrink-0 text-center py-4 border-b border-border bg-panel">
        <h1 className="text-xl font-headings font-bold text-text-primary">
          <span className="text-accent mr-2">⚖️</span> NyayVidhi Legal AI
        </h1>
      </header>
      
      <main className="flex-1 p-6 overflow-y-auto space-y-6 min-h-0">
        {messages.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              sender={msg.sender}
              sections={msg.sections}
              confidence={msg.confidence}
            />
          ))
        )}
        {isLoading && (
          <div className="flex justify-start pl-4">
              <div className="glass-card p-4 rounded-large rounded-bl-none">
                  <TypingIndicator />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} input={input} setInput={setInput} />
    </div>
  );
};

export default ChatWindow;
