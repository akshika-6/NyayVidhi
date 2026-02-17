import React from 'react';
import { Sparkles } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
      <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center mb-6 shadow-glow border border-[var(--border-color)]">
        <Sparkles size={40} className="text-[var(--accent-primary)]" strokeWidth={1.5} />
      </div>
      <h2 className="text-4xl font-display font-medium text-[var(--text-primary)] mb-4 tracking-tight">
        NyayVidhi Legal AI
      </h2>
      <p className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
        Your advanced AI legal assistant. Describe your situation to receive instant analysis based on the Indian Penal Code.
      </p>
    </div>
  );
};

export default EmptyState;
