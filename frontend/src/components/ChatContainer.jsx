import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import LegalCard from './LegalCard';
import { BookOpen } from 'lucide-react';
import Sidebar from './Sidebar'; // Import Sidebar

const API_URL = 'http://127.0.0.1:8000/ask';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [currentLegalAnalysis, setCurrentLegalAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState(''); // State for the ChatInput

  const handleSendMessage = async (question) => {
    if (isLoading || !question.trim()) return;
    
    setIsLoading(true);
    setCurrentLegalAnalysis(null); // Clear previous analysis when new question is asked
    
    // Add user message to chat history
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: question }]);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const normalized = {
        summary: data.summary || "",
        legal_reasoning: data.legal_reasoning || "",
        sections: Array.isArray(data.sections) ? data.sections : [],
        confidence: data.confidence || "low",
        disclaimer: data.disclaimer || "This is not legal advice",
      };

      setCurrentLegalAnalysis(normalized);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: normalized.summary,
          sections: normalized.sections,
          confidence: normalized.confidence,
        },
      ]);

    } catch (error) {
      console.error("API call failed:", error);
      const fallback = {
        summary: "Error",
        legal_reasoning: "Sorry, something went wrong. Please check the backend connection and try again.",
        confidence: "low",
        sections: [],
        disclaimer: "This is not legal advice."
      };
      setCurrentLegalAnalysis(fallback);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: fallback.summary,
          sections: fallback.sections,
          confidence: fallback.confidence,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setCurrentLegalAnalysis(null);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full flex-row bg-background text-text-primary overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar onClearConversation={handleClearConversation} />

      {/* Center Chat Panel */}
      <div className="flex-1 min-w-0 bg-background">
        <ChatWindow 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage}
          input={input}
          setInput={setInput}
        />
      </div>

      {/* Right Legal Analysis Panel */}
      <aside className="w-[320px] sm:w-[360px] lg:w-[400px] shrink-0 bg-panel border-l border-border flex flex-col p-6 overflow-y-auto">
        {currentLegalAnalysis || isLoading ? (
          <LegalCard analysis={currentLegalAnalysis} isStreaming={isLoading} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary text-lg">
            <BookOpen className="w-16 h-16 text-gray-600 mb-4" />
            <p>Your legal analysis will appear here.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default ChatContainer;
