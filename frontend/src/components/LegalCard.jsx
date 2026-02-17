import React from 'react';
import { Type, FileText, Anchor, Copy, Check, Info } from 'lucide-react';

const SectionPill = ({ section }) => {
  return (
    <div className="bg-gray-700 text-text-secondary text-sm font-medium px-3 py-1 rounded-full">
      {section}
    </div>
  );
};

const LegalCard = ({ analysis, isStreaming }) => {
  const [copied, setCopied] = React.useState(false);

  if (isStreaming) {
    return (
      <div className="bg-card p-6 rounded-large shadow-soft animate-pulse shrink-0 w-full h-[25rem]">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6 mb-6"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div className="w-full h-full flex items-center justify-center text-text-secondary text-center">
        Legal analysis will appear here.
      </div>
    );
  }

  const handleCopy = () => {
    const safeSections = Array.isArray(analysis.sections) ? analysis.sections : [];
    const textToCopy = `Summary: ${analysis.summary}

Legal Reasoning: ${analysis.legal_reasoning}

Sections: ${safeSections.join(', ')}

Disclaimer: ${analysis.disclaimer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const confidenceLower = analysis.confidence?.toLowerCase() || 'low';
  const confidenceMap = {
    low: { label: 'Low', value: 35, color: 'bg-danger' },
    medium: { label: 'Medium', value: 65, color: 'bg-warning' },
    high: { label: 'High', value: 90, color: 'bg-success' },
  };
  const confidence = confidenceMap[confidenceLower] || confidenceMap.low;

  return (
    <div className="glass-card p-6 rounded-large border border-border w-full animate-fade-up">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
        <h2 className="text-xl font-headings font-bold text-text-primary">Legal Analysis</h2>
         <button 
            onClick={handleCopy} 
            className="text-text-secondary hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
          </button>
      </div>

      <div className="space-y-4">
        <section className="glass-section rounded-large p-4">
          <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
            <Type size={16} className="mr-2 text-accent" /> Offence Title
          </h3>
          <p className="text-text-primary text-base font-semibold">{analysis.summary}</p>
        </section>

        <section className="glass-section rounded-large p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center text-sm font-semibold text-text-secondary">
              <Info size={16} className="mr-2 text-accent" /> Confidence
            </h3>
            <span className="text-xs text-text-secondary">{confidence.value}%</span>
          </div>
          <div className="h-2 rounded-full progress-track overflow-hidden">
            <div
              className={`h-full rounded-full progress-fill ${confidence.color}`}
              style={{ width: `${confidence.value}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">{confidence.label} confidence</p>
        </section>

        <section className="glass-section rounded-large p-4">
          <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
            <Anchor size={16} className="mr-2 text-accent" /> Applicable Sections
          </h3>
          <div className="flex flex-wrap gap-2">
            {(analysis.sections && analysis.sections.length > 0)
              ? analysis.sections.map(sec => <SectionPill key={sec} section={sec} />)
              : <span className="text-xs text-text-secondary">No sections</span>}
          </div>
        </section>
        
        <section className="glass-section rounded-large p-4">
          <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
            <FileText size={16} className="mr-2 text-accent" /> Legal Reasoning
          </h3>
          <p className="text-text-primary text-sm leading-relaxed">{analysis.legal_reasoning}</p>
        </section>
      </div>
      
      <p className="text-xs text-text-secondary mt-6 p-3 rounded-md bg-gray-800 border border-border">
        <span className="font-semibold">Disclaimer:</span> {analysis.disclaimer}
      </p>
    </div>
  );
};

export default LegalCard;
