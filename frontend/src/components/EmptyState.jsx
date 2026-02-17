import React from 'react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fade-up">
      <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 text-3xl shadow-soft">
        ⚖️
      </div>
      <h2 className="text-2xl font-headings font-semibold text-text-primary mb-2">NyayVidhi Legal AI</h2>
      <p className="text-text-secondary text-lg">Welcome. Describe your legal situation to begin analysis.</p>
    </div>
  );
};

export default EmptyState;
