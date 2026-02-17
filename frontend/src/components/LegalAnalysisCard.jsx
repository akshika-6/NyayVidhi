import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';
import SectionPill from './SectionPill';
import { Type, FileText, Anchor, Copy, Check } from 'lucide-react';

const LegalAnalysisCard = ({ analysis, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);

  if (isStreaming) {
    return (
      <div className="bg-card p-6 rounded-large shadow-soft animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }
  
  const handleCopy = () => {
    const textToCopy = `Summary: ${analysis.summary}

Legal Reasoning: ${analysis.legal_reasoning}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-[28.125rem] bg-card p-6 rounded-large shadow-soft shrink-0 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-headings font-bold text-text-primary">Legal Analysis</h2>
         <button onClick={handleCopy} className="text-text-secondary hover:text-white transition-colors">
            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
          </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
            <Type size={16} className="mr-2 text-accent" /> Offence Title
          </h3>
          <p className="text-text-primary font-semibold">{analysis.summary}</p>
        </div>

        {analysis.confidence && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Confidence</h3>
            <ConfidenceBadge level={analysis.confidence} />
          </div>
        )}

        {analysis.sections && analysis.sections.length > 0 && (
          <div>
            <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
              <Anchor size={16} className="mr-2 text-accent" /> Applicable Sections
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.sections.map(sec => <SectionPill key={sec} section={sec} />)}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
            <FileText size={16} className="mr-2 text-accent" /> Legal Reasoning
          </h3>
          <p className="text-text-primary text-sm leading-relaxed">{analysis.legal_reasoning}</p>
        </div>
      </div>
      
      <p className="text-xs text-text-secondary mt-6 text-center">{analysis.disclaimer}</p>
    </div>
  );
};

export default LegalAnalysisCard;
