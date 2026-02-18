import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, BookOpen, Gavel, TrendingUp } from 'lucide-react';

const JudgmentComparison = ({ judgmentData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!judgmentData || !judgmentData.judgments || judgmentData.judgments.length === 0) {
    return null;
  }

  const { judgments, comparison, recommendation } = judgmentData;

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-900/20 backdrop-blur-sm overflow-hidden animate-fade-in mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 px-6 py-4 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Judgment Comparison Tool</h3>
            <p className="text-xs text-indigo-200">Compare {judgments.length} relevant judgments</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* What it does */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-2">
            <BookOpen size={16} />
            What it does
          </h4>
          <p className="text-sm text-slate-300 mb-3">Compare {judgments.length} judgments:</p>
          <ul className="space-y-1 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Differences</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Precedents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Impact</span>
            </li>
          </ul>
        </div>

        {/* Judgments */}
        <div className="space-y-3">
          {judgments.map((judgment, idx) => (
            <div key={idx} className="bg-slate-800/60 rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <Gavel size={16} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-white text-sm mb-1">{judgment.case_name}</h5>
                  <div className="text-xs text-slate-400 space-y-1 mb-2">
                    <div><span className="text-indigo-400">Citation:</span> {judgment.citation}</div>
                    <div><span className="text-indigo-400">Court:</span> {judgment.court} ({judgment.year})</div>
                  </div>
                  {judgment.key_points && judgment.key_points.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-semibold text-slate-300 mb-1">Key Points:</div>
                      <ul className="text-xs text-slate-400 space-y-1">
                        {judgment.key_points.slice(0, 2).map((point, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-indigo-400 shrink-0">→</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="text-xs text-slate-300 bg-slate-900/50 rounded-lg p-2 border border-slate-700/50">
                    <span className="font-semibold text-indigo-300">Relevance:</span> {judgment.relevance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Analysis */}
        {comparison && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 rounded-xl p-4 border border-indigo-500/30 hover:border-indigo-500/50 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-400" />
              <span className="font-semibold text-white text-sm">Detailed Comparison Analysis</span>
            </div>
            {isExpanded ? <ChevronUp size={18} className="text-indigo-400" /> : <ChevronDown size={18} className="text-indigo-400" />}
          </button>
        )}

        {isExpanded && comparison && (
          <div className="space-y-3 animate-fade-in">
            {/* Common Principles */}
            {comparison.common_principles && comparison.common_principles.length > 0 && (
              <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                <h5 className="text-sm font-bold text-green-400 mb-2">Common Legal Principles</h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {comparison.common_principles.map((principle, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 shrink-0">✓</span>
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Differences */}
            {comparison.differences && comparison.differences.length > 0 && (
              <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-500/30">
                <h5 className="text-sm font-bold text-amber-400 mb-2">Key Differences</h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {comparison.differences.map((diff, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">⚠</span>
                      <span>{diff}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precedent Value */}
            {comparison.precedent_value && (
              <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/30">
                <h5 className="text-sm font-bold text-indigo-400 mb-2">Precedent Value</h5>
                <p className="text-xs text-slate-300">{comparison.precedent_value}</p>
              </div>
            )}

            {/* Practical Impact */}
            {comparison.practical_impact && (
              <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                <h5 className="text-sm font-bold text-purple-400 mb-2">Practical Impact on Your Case</h5>
                <p className="text-xs text-slate-300">{comparison.practical_impact}</p>
              </div>
            )}
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-xl p-4 border border-emerald-500/30">
            <h5 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
              <Scale size={16} />
              Expert Recommendation
            </h5>
            <p className="text-xs text-slate-200 leading-relaxed">{recommendation}</p>
          </div>
        )}

        {/* Why it's powerful */}
        <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 text-center">
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-indigo-300">Why it's powerful:</span> For students + professionals
          </p>
        </div>
      </div>
    </div>
  );
};

export default JudgmentComparison;
