import React, { useState } from 'react';
import ChatContainer from "../components/ChatContainer";
import StrategyBuilderForm from '../components/StrategyBuilderForm';
import StrategyDashboard from '../components/StrategyDashboard';
import MessageBubble from '../components/layout/MessageBubble';

export default function ChatPage() {
  const [mode, setMode] = useState('professional'); // Default to professional for testing
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStrategyGeneration = (data) => {
    console.log("ChatPage received data:", data);
    if (data.userQuery) {
      setMessages(prev => [...prev, { text: data.userQuery, sender: 'user' }]);
      setIsLoading(true);
      setError(null);
    }
    if (data.assistantResponse) {
      console.log("Adding assistant response:", data.assistantResponse);
      setMessages(prev => [...prev, { text: data.assistantResponse, sender: 'assistant' }]);
      setIsLoading(false);
    }
    if (data.error) {
      setError(data.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-center">
        <div className="bg-slate-800 p-1 rounded-lg flex gap-1">
          <button
            onClick={() => { setMode('individual'); setMessages([]); setError(null); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'individual' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Individual Guidance
          </button>
          <button
            onClick={() => { setMode('professional'); setMessages([]); setError(null); }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'professional' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
          >
            Professional / MSME Strategy Builder
          </button>
        </div>
      </div>

      {mode === 'individual' ? (
        <ChatContainer messages={messages} setMessages={setMessages} />
      ) : (
        <div className="flex-1 p-4 space-y-8">
          <div className="max-w-4xl mx-auto">
            <StrategyBuilderForm onStrategyGeneration={handleStrategyGeneration} />
          </div>

          {messages.length > 0 && (
            <div className="max-w-4xl mx-auto border-t border-slate-800 pt-8">
              <h3 className="text-xl font-bold text-slate-400 mb-6 px-4">Generated Strategy & Analysis</h3>
            </div>
          )}

          {messages.map((msg, index) => (
            msg.sender === 'user'
              ? <div key={index} className="max-w-4xl mx-auto animate-fade-in"><MessageBubble text={msg.text} sender="user" /></div>
              : <StrategyDashboard key={index} strategyText={msg.text} />
          ))}

          <div ref={messagesEndRef} />

          {isLoading && (
            <div className="flex justify-center items-center p-8">
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-4">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
