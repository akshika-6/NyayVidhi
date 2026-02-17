import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import LawyerInfoPanel from './LawyerInfoPanel';
import MessageBubble from './MessageBubble';

const API_BASE_URL = "http://127.0.0.1:8000";

const ChatModal = ({ lawyer, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (lawyer) {
      const initialMessage = {
        sender: 'assistant',
        text: `Hello, I am Adv. ${lawyer.name || lawyer.full_name}. Please describe your issue in detail.`,
      };
      setMessages([initialMessage]);
    }
  }, [lawyer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/send_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawyer_id: lawyer.id,
          user_message: input,
          chat_history: messages,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      
      const assistantMessage = { sender: 'assistant', text: data.lawyer_reply };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage = { sender: 'assistant', text: 'Sorry, I am having trouble responding right now.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = async (slotInfo) => {
    if(isBooking || bookedSlot) return;
    setIsBooking(true);
    try {
        const res = await fetch(`${API_BASE_URL}/chat/book_slot`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slotInfo),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.detail || 'Failed to book slot.');
        }
        const data = await res.json();
        setBookedSlot(data.booked_slot);
        const confirmationMessage = { sender: 'assistant', text: data.confirmation_message };
        setMessages(prev => [...prev, confirmationMessage]);

    } catch (error) {
        const errorMessage = { sender: 'assistant', text: `Booking failed: ${error.message}` };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsBooking(false);
    }
  };

  if (!lawyer) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950/80 border border-slate-700/50 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col md:flex-row shadow-2xl shadow-indigo-900/20">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-5 md:right-5 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          <div className="p-4 border-b border-slate-800">
             <h2 className="text-base font-semibold text-white text-center">Consult with {lawyer.name || lawyer.full_name}</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender} text={msg.text} />
            ))}
            {isLoading && <MessageBubble sender="assistant" text="..." isLoading={true} />}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-800">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-800/70 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading || !input.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Lawyer Info Panel */}
        <LawyerInfoPanel 
            lawyer={lawyer} 
            onSlotSelect={handleSlotSelect}
            bookedSlot={bookedSlot}
            isBooking={isBooking}
        />
      </div>
    </div>
  );
};

export default ChatModal;
