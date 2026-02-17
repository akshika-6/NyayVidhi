import React, { useCallback, useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./layout/ChatWindow";
import AnalysisPanel from "./layout/AnalysisPanel";
import { PanelRightOpen } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

function ChatContainer() {
  const [allChats, setAllChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState("English");

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("nyayvidhi_chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setAllChats(parsed);
      } catch (e) {
        console.error("Failed to parse chats", e);
      }
    }

    // Load user's default language preference
    try {
      const rawUser = localStorage.getItem("nyayvidhi_user");
      if (rawUser) {
        const storedUser = JSON.parse(rawUser);
        if (storedUser?.preferred_language) {
          setPreferredLanguage(storedUser.preferred_language);
        }
      }
    } catch (e) {
      console.error("Failed to load user language preference", e);
    }
  }, []);

  // Sync current state with active chat in allChats
  useEffect(() => {
    if (activeChatId) {
      const activeChat = allChats.find(c => c.id === activeChatId);
      if (activeChat) {
        setMessages(activeChat.messages || []);
        setCurrentAnalysis(activeChat.analysis || null);
      }
    } else {
      setMessages([]);
      setCurrentAnalysis(null);
    }
  }, [activeChatId, allChats]);

  const saveToHistory = (chatId, updatedMessages, updatedAnalysis) => {
    setAllChats(prev => {
      const chatIndex = prev.findIndex(c => c.id === chatId);
      let newChats = [...prev];
      
      if (chatIndex >= 0) {
        newChats[chatIndex] = {
          ...newChats[chatIndex],
          messages: updatedMessages,
          analysis: updatedAnalysis || newChats[chatIndex].analysis,
          timestamp: Date.now()
        };
      } else {
        newChats = [{
          id: chatId,
          title: updatedMessages[0]?.text || "New Chat",
          messages: updatedMessages,
          analysis: updatedAnalysis,
          timestamp: Date.now()
        }, ...prev];
      }
      
      const sorted = newChats.sort((a, b) => b.timestamp - a.timestamp).slice(0, 20);
      localStorage.setItem("nyayvidhi_chats", JSON.stringify(sorted));
      return sorted;
    });
  };

  const handleSendMessage = useCallback(async (question) => {
    if (isLoading || !question.trim()) return;

    setIsLoading(true);
    let currentId = activeChatId;
    
    if (!currentId) {
      currentId = `chat-${Date.now()}`;
      setActiveChatId(currentId);
    }

    const userMsg = { id: `u-${Date.now()}`, sender: "user", text: question };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    
    saveToHistory(currentId, newMessages, currentAnalysis);
    
    if (window.innerWidth < 768) setIsAnalysisOpen(false); 

    try {
      // Parallel API Calls: Legal AI + Lawyer Consultation
      // We use Promise.allSettled so one failure doesn't block the other
      const [askResult, lawyerResult] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            question,
            preferred_language: preferredLanguage || "English"
          }),
        }),
        fetch(`${API_BASE_URL}/lawyer/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_query: question }),
        })
      ]);

      const finalMessages = [...newMessages];
      let analysisData = null;

      // Handle Legal AI Result
      if (askResult.status === 'fulfilled' && askResult.value.ok) {
          try {
              const askData = await askResult.value.json();
              
              // Ensure summary is always a string
              let summaryText = "";
              if (typeof askData.summary === 'string') {
                  summaryText = askData.summary;
              } else if (askData.summary && typeof askData.summary === 'object') {
                  // Convert object to formatted string
                  summaryText = Object.entries(askData.summary)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join('\n\n');
              } else {
                  summaryText = askData.summary ? String(askData.summary) : "No response available.";
              }
              
              analysisData = {
                  summary: summaryText,
                  legal_reasoning: askData.legal_reasoning,
                  sections: askData.sections || [],
                  citations: askData.citations || [],
                  confidence: askData.confidence,
                  disclaimer: askData.disclaimer
              };
              
              const botMsg = {
                  id: `b-${Date.now()}`,
                  sender: "assistant",
                  text: summaryText
              };
              finalMessages.push(botMsg);
          } catch (e) {
              console.error("Failed to parse AI response", e);
              finalMessages.push({ id: `e-${Date.now()}`, sender: "assistant", text: "I found some legal info, but couldn't process it correctly." });
          }
      } else {
          console.error("Legal AI API failed", askResult.reason || askResult.value?.statusText);
          finalMessages.push({ id: `e-${Date.now()}`, sender: "assistant", text: "I'm having trouble accessing the legal database right now, but let me check for lawyers who can help you." });
      }

      // Handle Lawyer Matcher Result
      if (lawyerResult.status === 'fulfilled' && lawyerResult.value.ok) {
        try {
          const lawyerData = await lawyerResult.value.json();
          const ctaMsg = {
            id: `m-${Date.now()}`,
            sender: "assistant",
            type: "lawyer_cta",
            data: {
              query: question,
              category: lawyerData.category,
              urgency: lawyerData.urgency,
              matched_lawyers: lawyerData.matched_lawyers || [],
              rate_limit: lawyerData.rate_limit,
              ai_summary: lawyerData.ai_summary 
            }
          };
          finalMessages.push(ctaMsg);
        } catch (e) {
          console.error("Failed to parse lawyer response", e);
        }
      }

      setMessages(finalMessages);
      setCurrentAnalysis(analysisData);
      
      saveToHistory(currentId, finalMessages, analysisData);

    } catch (e) {
      console.error(e);
      const errorMsg = { id: `e-${Date.now()}`, sender: "assistant", text: "Sorry, I encountered an unexpected error." };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);
      saveToHistory(currentId, finalMessages, currentAnalysis);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, activeChatId, currentAnalysis, preferredLanguage]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setCurrentAnalysis(null);
    setInput("");
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    setIsSidebarOpen(false);
    setIsAnalysisOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-40" />
      
      <Sidebar 
         onClearConversation={handleNewChat} 
         history={allChats}
         activeChatId={activeChatId}
         onSelectHistory={handleSelectChat}
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)}
         variant="desktop" 
      />
      <Sidebar 
         onClearConversation={handleNewChat} 
         history={allChats}
         activeChatId={activeChatId}
         onSelectHistory={handleSelectChat}
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)}
         variant="mobile" 
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
         <ChatWindow
            messages={messages}
            isLoading={isLoading}
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenAnalysis={() => setIsAnalysisOpen(true)}
            isAnalysisOpen={isAnalysisOpen}
            preferredLanguage={preferredLanguage}
            onChangeLanguage={setPreferredLanguage}
         />
         
         {!isAnalysisOpen && currentAnalysis && (
            <button 
              onClick={() => setIsAnalysisOpen(true)}
              className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 hidden md:block z-10 border border-white/5"
              title="Show Analysis"
            >
               <PanelRightOpen size={20} />
            </button>
         )}
      </main>

      <AnalysisPanel 
        analysis={currentAnalysis} 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        variant="desktop"
      />
      <AnalysisPanel 
        analysis={currentAnalysis} 
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        variant="mobile"
      />

    </div>
  );
}

export default ChatContainer;
