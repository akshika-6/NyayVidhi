import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LegalTimeline = ({ icon, title, content }) => {
  // Assuming steps are separated by numbered lists in markdown
  const steps = content.split(/\n\d+\.\s/).filter(s => s.trim() !== '');

  return (
    <div className="bg-slate-800/40 rounded-xl border border-slate-700/80 shadow-lg transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
      <div className="p-5 flex items-center gap-4 border-b border-slate-700/80">
        <div className="w-10 h-10 flex items-center justify-center bg-slate-700/50 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-indigo-200">{title}</h3>
      </div>
      <div className="p-6">
        <div className="relative pl-8">
          {steps.map((step, index) => (
            <div key={index} className="relative pb-8 last:pb-0">
              {index < steps.length -1 && <div className="absolute top-2 -left-[3px] w-0.5 h-full bg-slate-600"></div>}
              <div className="absolute top-2 -left-[7px] w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-800"></div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {step}
                 </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalTimeline;
