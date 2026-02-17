import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LegalSectionCard = ({ icon, title, content }) => {
  return (
    <div className="bg-slate-800/40 rounded-xl border border-slate-700/80 shadow-lg transition-all duration-300 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
      <div className="p-5 flex items-center gap-4 border-b border-slate-700/80">
        <div className="w-10 h-10 flex items-center justify-center bg-slate-700/50 rounded-lg">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-indigo-200">{title}</h3>
      </div>
      <div className="p-6">
        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default LegalSectionCard;
