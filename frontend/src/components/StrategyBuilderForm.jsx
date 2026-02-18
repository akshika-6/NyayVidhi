import React, { useState } from 'react';
import { Briefcase, FileText, Users, Landmark, IndianRupee, AlertTriangle, MapPin, Send } from 'lucide-react';

const InputField = ({ icon, label, children }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

const StrategyBuilderForm = ({ onStrategyGeneration }) => {
  const [formData, setFormData] = useState({
    businessType: 'Pvt Ltd',
    disputeType: 'Vendor',
    contractExists: 'Yes',
    amountInvolved: '',
    opponentType: 'Company',
    urgency: 'Medium',
    jurisdiction: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Validating input...');

    if (!formData.description || formData.description.length < 50) {
      setError("Please provide a detailed description of at least 50 characters.");
      setStatusMessage('Validation failed: Description too short.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    setStatusMessage('Sending request to AI strategist...');

    const userQuery = `Generate a professional case strategy for the following situation:
- Business Type: ${formData.businessType}
- Dispute Type: ${formData.disputeType}
- Contract Exists: ${formData.contractExists}
- Amount Involved: ${formData.amountInvolved}
- Opponent Type: ${formData.opponentType}
- Urgency: ${formData.urgency}
- Jurisdiction: ${formData.jurisdiction}
- Description: ${formData.description}`;

    // Pass data up to parent
    onStrategyGeneration({
      userQuery,
      formData
    });

    try {
      console.log("Sending fetch request...");
      const response = await fetch('http://127.0.0.1:8000/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log("Response received:", response.status);
      setStatusMessage(`Response received: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred." }));
        throw new Error(errorData.detail || "Failed to generate strategy");
      }

      const data = await response.json();
      setStatusMessage('Processing strategy...');

      // Pass assistant response up to parent
      onStrategyGeneration({ assistantResponse: data.strategy });
      setStatusMessage('Strategy generated successfully!');

    } catch (error) {
      console.error("Error fetching strategy:", error);
      setError(error.message);
      setStatusMessage(`Error: ${error.message}`);
      onStrategyGeneration({ error: error.message });
    } finally {
      setIsSubmitting(false);
      // Clear status after 3 seconds if beneficial, but keep it for debugging now
      // setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const baseInputClasses = "w-full bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder:text-slate-500";

  return (
    <div className="p-6 bg-slate-900 border border-slate-700 rounded-xl shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<Briefcase size={16} />} label="Type of Business">
            <select name="businessType" value={formData.businessType} onChange={handleChange} className={baseInputClasses}>
              <option>Pvt Ltd</option>
              <option>LLP</option>
              <option>Partnership</option>
              <option>Proprietorship</option>
            </select>
          </InputField>

          <InputField icon={<FileText size={16} />} label="Nature of Dispute">
            <select name="disputeType" value={formData.disputeType} onChange={handleChange} className={baseInputClasses}>
              <option>Vendor</option>
              <option>Employee</option>
              <option>Customer</option>
              <option>IP</option>
              <option>Tax</option>
            </select>
          </InputField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<FileText size={16} />} label="Contract Exists?">
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-slate-300">
                <input type="radio" name="contractExists" value="Yes" checked={formData.contractExists === 'Yes'} onChange={handleChange} className="form-radio bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                Yes
              </label>
              <label className="flex items-center gap-2 text-slate-300">
                <input type="radio" name="contractExists" value="No" checked={formData.contractExists === 'No'} onChange={handleChange} className="form-radio bg-slate-700 border-slate-600 text-indigo-500 focus:ring-indigo-500" />
                No
              </label>
            </div>
          </InputField>
          <InputField icon={<IndianRupee size={16} />} label="Amount Involved">
            <input type="text" name="amountInvolved" value={formData.amountInvolved} onChange={handleChange} className={baseInputClasses} placeholder="e.g., 5,00,000" />
          </InputField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={<Users size={16} />} label="Opponent Type">
            <select name="opponentType" value={formData.opponentType} onChange={handleChange} className={baseInputClasses}>
              <option>Company</option>
              <option>Individual</option>
            </select>
          </InputField>
          <InputField icon={<AlertTriangle size={16} />} label="Urgency Level">
            <select name="urgency" value={formData.urgency} onChange={handleChange} className={baseInputClasses}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </InputField>
        </div>

        <InputField icon={<MapPin size={16} />} label="State Jurisdiction">
          <input type="text" name="jurisdiction" value={formData.jurisdiction} onChange={handleChange} className={baseInputClasses} placeholder="e.g., Maharashtra" />
        </InputField>

        <InputField icon={<Landmark size={16} />} label="Brief Description of the Dispute">
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={baseInputClasses} placeholder="Provide a summary of the events..."></textarea>
        </InputField>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg p-3">{error}</div>}

        <div className="space-y-2">
          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed">
            {isSubmitting ? 'Generating Strategy...' : <><Send size={16} /> Generate Case Strategy</>}
          </button>

          {statusMessage && <div className="text-center text-xs text-slate-400 font-mono animate-pulse">{statusMessage}</div>}
        </div>
      </form>
    </div>
  );
};

export default StrategyBuilderForm;
