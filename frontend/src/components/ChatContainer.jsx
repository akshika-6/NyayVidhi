import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./layout/ChatWindow";
import AnalysisPanel from "./layout/AnalysisPanel";

const API_URL = "http://127.0.0.1:8000/ask";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [currentLegalAnalysis, setCurrentLegalAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.documentElement.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

  const handleSendMessage = useCallback(async (question) => {
    if (isLoading || !question.trim()) return;

    setIsLoading(true);
    setCurrentLegalAnalysis(null);

    const userMessage = {
      id: `${Date.now()}-user`,
      sender: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          sender: "assistant",
          text: normalized.summary,
          sections: normalized.sections,
          confidence: normalized.confidence,
        },
      ]);
      setIsAnalysisOpen(true);
    } catch (error) {
      console.error("API call failed:", error);
      const fallback = {
        summary: "Error",
        legal_reasoning: "Sorry, something went wrong. Please check the backend connection and try again.",
        confidence: "low",
        sections: [],
        disclaimer: "This is not legal advice.",
      };
      setCurrentLegalAnalysis(fallback);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          sender: "assistant",
          text: fallback.summary,
          sections: fallback.sections,
          confidence: fallback.confidence,
        },
      ]);
      setIsAnalysisOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleClearConversation = useCallback(() => {
    setMessages([]);
    setCurrentLegalAnalysis(null);
    setInput("");
    setIsLoading(false);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  const stableMessages = useMemo(() => messages, [messages]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-primary)] selection:text-white">
      <Sidebar
        onClearConversation={handleClearConversation}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      <div className="flex-1 min-w-0 relative flex flex-col">
        <ChatWindow
          messages={stableMessages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          input={input}
          setInput={setInput}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
        />
      </div>

      <AnalysisPanel
        analysis={currentLegalAnalysis}
        isLoading={isLoading}
      />

      <Sidebar
        variant="drawer"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onClearConversation={handleClearConversation}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
      />

      <AnalysisPanel
        variant="drawer"
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        analysis={currentLegalAnalysis}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ChatContainer;
