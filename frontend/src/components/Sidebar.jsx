import React, { useState } from 'react';
import { Power, MessageSquare, BookOpen, Sun, Moon } from 'lucide-react';

const Sidebar = ({ onClearConversation }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark mode by default

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you'd apply dark/light classes to <html> or <body>
    document.documentElement.classList.toggle('light', isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  return (
    <div className="w-[240px] sm:w-[260px] shrink-0 bg-sidebar p-5 flex flex-col h-full border-r border-border">
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-headings font-bold text-text-primary flex items-center">
          <Power className="text-accent mr-2" /> NyayVidhi
        </h1>
      </div>
      <button
        className="w-full bg-linear-to-r from-accent to-indigo-600 text-white py-2.5 px-4 rounded-lg flex items-center justify-center font-semibold hover:brightness-110 transition-all shadow-soft"
        onClick={onClearConversation}
        type="button"
      >
        <MessageSquare className="mr-2 h-5 w-5" /> New Chat
      </button>
      <div className="mt-8 grow">
        <h2 className="text-sm font-semibold text-text-secondary mb-4">Chat History</h2>
        {/* Mock History */}
        <ul className="space-y-2">
          {[
            "Analysis of contract breach and remedies",
            "IPC 420 fraudulent inducement overview",
            "Property dispute summary and next steps",
          ].map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all truncate"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto pt-4 border-t border-border">
        <button 
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center text-text-secondary">
            {isDarkMode ? <Moon className="mr-2 h-5 w-5" /> : <Sun className="mr-2 h-5 w-5" />} 
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
          {/* Simple Toggle Switch (visual only for now) */}
          <div className={`relative w-10 h-5 rounded-full p-1 transition-all duration-300 ${isDarkMode ? 'bg-accent' : 'bg-gray-400'}`}>
             <div className={`absolute w-3 h-3 bg-white rounded-full shadow-md transition-all duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
