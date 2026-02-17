import React, { useCallback, useState } from "react";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./layout/ChatWindow";
import AnalysisPanel from "./layout/AnalysisPanel";
import { PanelRightOpen } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8001";

function ChatContainer({ messages, setMessages }) { // Accept messages and setMessages as props
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false); // Default closed

  const handleSendMessage = useCallback(async (question) => {
    if (isLoading || !question.trim()) return;

    setIsLoading(true);
    const userMsg = { id: `u-${Date.now()}`, sender: "user", text: question };
    setMessages(prev => [...prev, userMsg]);
    
    if (window.innerWidth < 768) setIsAnalysisOpen(false); 

    try {
      // --- Parallel API Calls ---
      const askPromise = fetch(`${API_BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question }),
      });

      const lawyerPromise = fetch(`${API_BASE_URL}/lawyer/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: question }),
      });

      const [askResponse, lawyerResponse] = await Promise.all([askPromise, lawyerPromise]);

      if (!askResponse.ok || !lawyerResponse.ok) {
        throw new Error("One or more API calls failed");
      }

      const askData = await askResponse.json();
      const lawyerData = await lawyerResponse.json();

      // --- Construct Messages ---
      const botMsg = {
        id: `b-${Date.now()}`,
        sender: "assistant",
        text: askData.summary || "No detailed response available."
      };

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

      // Add both messages to the state
      setMessages(prev => [...prev, botMsg, ctaMsg]);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, sender: "assistant", text: "Sorry, I encountered an error connecting to the legal engine." }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setMessages]); // Add setMessages to dependency array


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
