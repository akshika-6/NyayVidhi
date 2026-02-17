import React, { useState } from 'react';
import LegalSectionCard from './LegalSectionCard';
import LegalTimeline from './LegalTimeline';
import LegalFooter from './LegalFooter';
import { Book, Scale, ShieldCheck, ListOrdered, BrainCircuit, Award, ChevronDown, ChevronUp } from 'lucide-react';

const sectionIcons = {
  "Understanding Your Situation": <Book size={20} className="text-indigo-300" />,
  "Legal Framework Under Indian Law": <Scale size={20} className="text-indigo-300" />,
  "Your Legal Rights": <ShieldCheck size={20} className="text-indigo-300" />,
  "Step-by-Step Course of Action": <ListOrdered size={20} className="text-indigo-300" />,
  "Strategic Considerations": <BrainCircuit size={20} className="text-indigo-300" />,
  "Professional Closing": <Award size={20} className="text-indigo-300" />,
};

const LegalResponseContainer = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sections = text.split('### ').filter(s => s.trim() !== '').map(s => {
    const [title, ...contentParts] = s.split('\n');
    return {
      title: title.trim(),
      content: contentParts.join('\n').trim(),
    };
  });

  if (sections.length === 0) {
    return null; // Or a fallback for unstructured messages
  }

  const visibleSections = isExpanded ? sections : sections.slice(0, 2);

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-2xl shadow-indigo-900/10 backdrop-blur-lg animate-fade-in">
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Legal Analysis Report</h2>
        <span className="flex items-center gap-2 text-xs px-3 py-1 bg-green-500/10 text-green-300 rounded-full border border-green-500/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Based on Indian Law
        </span>
      </div>

      <div className="p-6 space-y-6">
        {visibleSections.map((section, index) => {
          if (section.title === "Step-by-Step Course of Action") {
            return <LegalTimeline key={index} title={section.title} content={section.content} icon={sectionIcons[section.title]} />;
          }
          return <LegalSectionCard key={index} title={section.title} content={section.content} icon={sectionIcons[section.title]} />;
        })}
      </div>

      {sections.length > 2 && (
        <div className="px-6 pb-6 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg px-4 py-3 transition-all duration-300"
          >
            {isExpanded ? 'Collapse Legal Analysis' : 'View Full Legal Analysis'}
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
      
      <LegalFooter />
    </div>
  );
};

export default LegalResponseContainer;
