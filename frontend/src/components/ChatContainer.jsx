import React, { useCallback, useState } from "react";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./layout/ChatWindow";
import AnalysisPanel from "./layout/AnalysisPanel";
import { PanelRightOpen, PanelRightClose } from "lucide-react";

// Mock Service Call Wrapper (Replace with real later if needed, mostly logic is same)
const API_URL = "http://127.0.0.1:8001/ask";

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false); // Default closed

  const handleSendMessage = useCallback(async (question) => {
    if (isLoading || !question.trim()) return;

    setIsLoading(true);
    // Optimistic User Message
    const userMsg = { id: `u-${Date.now()}`, sender: "user", text: question };
    setMessages(prev => [...prev, userMsg]);
    
    // Reset analysis panel focus
    if (window.innerWidth < 768) setIsAnalysisOpen(false); 

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      
      const analysisData = {
         summary: data.summary,
         legal_reasoning: data.legal_reasoning,
         sections: data.sections || [],
         citations: data.citations || [],
         confidence: data.confidence,
         disclaimer: data.disclaimer
      };

      setCurrentAnalysis(analysisData);
      
      // Display response naturally without robotic labels
      const messageText = data.summary || "No response available.";
      
      const botMsg = { 
        id: `b-${Date.now()}`, 
        sender: "assistant", 
        text: messageText
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, sender: "assistant", text: "Sorry, I encountered an error connecting to the legal engine." }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleClear = () => {
    setMessages([]);
    setCurrentAnalysis(null);
    setInput("");
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans overflow-hidden selection:bg-indigo-500/30">
      
      {/* Top Header Line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent z-40" />
      
      {/* 1. Sidebar (Fixed Width) */}
      <Sidebar 
         onClearConversation={handleClear} 
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)}
         variant="desktop" 
      />
      <Sidebar 
         onClearConversation={handleClear} 
         isOpen={isSidebarOpen} 
         onClose={() => setIsSidebarOpen(false)}
         variant="mobile" 
      />

      {/* 2. Main Content (Flex Grow) */}
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
         />
         
         {/* Toggle Analysis Button (Desktop Floating if closed) */}
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

      {/* 3. Analysis Panel (Collapsible) */}
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
