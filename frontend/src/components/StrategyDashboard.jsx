import React, { useState, useMemo } from 'react';
import { File, BarChart, GanttChartSquare, ShieldAlert, CheckSquare, Download, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StrategyDashboard = ({ strategyText }) => {
  const [activeTab, setActiveTab] = useState('A');
  const [isDownloading, setIsDownloading] = useState(false);

  const sections = useMemo(() => {
    // If strategyText is already an object, use it directly
    let parsed = strategyText;

    // If it's a string (e.g. from history or raw response), try to parse it
    if (typeof strategyText === 'string') {
      try {
        parsed = JSON.parse(strategyText);
      } catch (e) {
        // If parsing fails, treat it as raw text
        return { raw: strategyText };
      }
    }

    if (!parsed || Object.keys(parsed).length === 0) {
      return { raw: "No strategy generated." };
    }

    // Check for raw/error wrappers from backend
    if (parsed.raw) return { raw: parsed.raw };
    if (parsed.error) return { raw: `Error: ${parsed.error}` };

    // Standardize keys from snake_case (API) to camelCase (Frontend)
    return {
      overview: { title: "Situation Overview", content: parsed.situation_overview || "" },
      legalPosition: { title: "Legal Position", content: parsed.legal_position || "" },
      options: {
        A: parsed.strategic_options?.pre_litigation || "",
        B: parsed.strategic_options?.litigation || "",
        C: parsed.strategic_options?.settlement || ""
      },
      risk: {
        title: "Risk Assessment",
        data: parsed.risk_assessment || {}
      },
      docs: { title: "Documentation Checklist", items: parsed.documentation_checklist || [] },
      nextActions: { title: "Recommended Next Steps", items: parsed.recommended_next_steps || [] }
    };
  }, [strategyText]);

  const generatePDF = () => {
    setIsDownloading(true);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    const addSectionTitle = (title) => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text(title, margin, yPos);
      yPos += 8;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    };

    const addText = (text) => {
      if (!text) return;
      const splitText = doc.splitTextToSize(text, pageWidth - (margin * 2));
      if (yPos + (splitText.length * 5) > 280) { doc.addPage(); yPos = 20; }
      doc.text(splitText, margin, yPos);
      yPos += (splitText.length * 5) + 5;
    };

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Case Strategy Report", margin, yPos);
    yPos += 15;

    addSectionTitle(sections.overview.title);
    addText(sections.overview.content);

    addSectionTitle(sections.legalPosition.title);
    addText(sections.legalPosition.content);

    addSectionTitle(sections.risk.title);
    const riskData = [
      ['Legal Risk', sections.risk.data.legal_risk || 'N/A'],
      ['Financial Risk', sections.risk.data.financial_risk || 'N/A'],
      ['Reputational Risk', sections.risk.data.reputational_risk || 'N/A'],
      ['Counterclaim Risk', sections.risk.data.counterclaim_risk || 'N/A'],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Risk Type', 'Level']],
      body: riskData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: margin, right: margin },
    });
    yPos = doc.lastAutoTable.finalY + 10;

    if (sections.risk.data.analysis_notes) {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      addText(`Analysis: ${sections.risk.data.analysis_notes}`);
      doc.setTextColor(0);
      doc.setFont("helvetica", "normal");
      yPos += 5;
    }

    addSectionTitle("Strategic Options");

    doc.setFont("helvetica", "bold");
    doc.text("Option A: Pre-Litigation", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    addText(sections.options.A);

    doc.setFont("helvetica", "bold");
    doc.text("Option B: Litigation", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    addText(sections.options.B);

    doc.setFont("helvetica", "bold");
    doc.text("Option C: Settlement", margin, yPos);
    yPos += 5;
    doc.setFont("helvetica", "normal");
    addText(sections.options.C);

    addSectionTitle(sections.docs.title);
    sections.docs.items.forEach(item => {
      addText(`• ${item}`);
    });

    addSectionTitle(sections.nextActions.title);
    sections.nextActions.items.forEach((item, index) => {
      addText(`${index + 1}. ${item}`);
    });

    doc.save("Case_Strategy_Report.pdf");
    setIsDownloading(false);
  };

  if (sections.raw) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-slate-900/50 rounded-2xl border border-red-500/30 p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <ShieldAlert size={24} />
          <h2 className="text-xl font-bold">Strategy Generation Issue</h2>
        </div>
        <div className="prose prose-invert max-w-none text-slate-300">
          <ReactMarkdown>{sections.raw}</ReactMarkdown>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-900/50 rounded-2xl border border-slate-700/50 shadow-2xl shadow-indigo-900/10 backdrop-blur-lg animate-fade-in p-6">
      <div className="flex flex-wrap justify-between items-center border-b border-slate-700/50 pb-4 mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Case Strategy Report</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={generatePDF}
            disabled={isDownloading}
            className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard icon={<File size={20} />} title={sections.overview?.title}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections.overview?.content}</ReactMarkdown>
          </DashboardCard>

          <DashboardCard icon={<Scale size={20} />} title={sections.legalPosition?.title}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections.legalPosition?.content}</ReactMarkdown>
          </DashboardCard>

          {/* Risk Assessment Table */}
          <DashboardCard icon={<ShieldAlert size={20} />} title={sections.risk?.title}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-800 text-slate-300 border-b border-slate-700">
                    <th className="p-3 text-sm font-semibold">Risk Type</th>
                    <th className="p-3 text-sm font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300 text-sm">
                  <tr><td className="p-3 font-medium">Legal Risk</td><td className="p-3"><RiskBadge level={sections.risk.data.legal_risk} /></td></tr>
                  <tr><td className="p-3 font-medium">Financial Risk</td><td className="p-3"><RiskBadge level={sections.risk.data.financial_risk} /></td></tr>
                  <tr><td className="p-3 font-medium">Reputational Risk</td><td className="p-3"><RiskBadge level={sections.risk.data.reputational_risk} /></td></tr>
                  <tr><td className="p-3 font-medium">Counterclaim Risk</td><td className="p-3"><RiskBadge level={sections.risk.data.counterclaim_risk} /></td></tr>
                </tbody>
              </table>
              <div className="mt-4 text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">
                <strong>Analysis:</strong> {sections.risk.data.analysis_notes}
              </div>
            </div>
          </DashboardCard>

          {/* Strategy Tabs */}
          <div className="bg-slate-800/40 rounded-xl border border-slate-700/80">
            <div className="p-5 border-b border-slate-700/80">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-indigo-400"><GanttChartSquare size={20} /></span>
                <h3 className="font-semibold text-white">Strategic Options</h3>
              </div>
              <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
                <TabButton title="Pre-Litigation" isActive={activeTab === 'A'} onClick={() => setActiveTab('A')} />
                <TabButton title="Litigation" isActive={activeTab === 'B'} onClick={() => setActiveTab('B')} />
                <TabButton title="Settlement" isActive={activeTab === 'C'} onClick={() => setActiveTab('C')} />
              </div>
            </div>
            <div className="p-5">
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                {activeTab === 'A' && <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections.options.A}</ReactMarkdown>}
                {activeTab === 'B' && <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections.options.B}</ReactMarkdown>}
                {activeTab === 'C' && <ReactMarkdown remarkPlugins={[remarkGfm]}>{sections.options.C}</ReactMarkdown>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <DashboardCard icon={<CheckSquare size={20} />} title={sections.docs?.title}>
            <ul className="list-disc list-outside ml-4 space-y-2 text-slate-300 text-sm">
              {sections.docs.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </DashboardCard>
          <DashboardCard icon={<BarChart size={20} />} title={sections.nextActions?.title}>
            <ol className="list-decimal list-outside ml-4 space-y-2 text-slate-300 text-sm">
              {sections.nextActions.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon, title, children }) => (
  <div className="bg-slate-800/40 rounded-xl border border-slate-700/80 p-5 transition-all hover:border-indigo-500/40">
    {title && <div className="flex items-center gap-3 mb-3">
      <span className="text-indigo-400">{icon}</span>
      <h3 className="font-semibold text-white">{title}</h3>
    </div>}
    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
      {children}
    </div>
  </div>
);

const TabButton = ({ title, isActive, onClick }) => (
  <button onClick={onClick} className={`flex-1 text-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700/50'}`}>
    {title}
  </button>
)

const RiskBadge = ({ level }) => {
  let color = 'bg-slate-600 text-slate-200';
  if (level?.toLowerCase().includes('high')) color = 'bg-red-500/20 text-red-300 border border-red-500/30';
  else if (level?.toLowerCase().includes('medium')) color = 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
  else if (level?.toLowerCase().includes('low')) color = 'bg-green-500/20 text-green-300 border border-green-500/30';

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color}`}>
      {level || 'N/A'}
    </span>
  );
}

export default StrategyDashboard;
