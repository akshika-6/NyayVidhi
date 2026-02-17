import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import LawyerMatches from "../components/LawyerMatches";
import ChatModal from "../components/ChatModal";

const LawyerConsultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [matchData, setMatchData] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    const incoming = location.state?.matchData;
    if (incoming) {
      setMatchData(incoming);
    }
  }, [location.state]);

  const handleConnectLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    setIsChatModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable background scroll
  };

  const handleCloseModal = () => {
    setIsChatModalOpen(false);
    setSelectedLawyer(null);
    document.body.style.overflow = 'auto'; // Re-enable background scroll
  };

  return (
    <div className="h-screen overflow-y-auto w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-indigo-500/40 transition-all duration-300"
            title="Back to chat"
          >
            <ArrowLeft size={18} className="text-slate-200" />
          </button>
          <div>
            <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Lawyer Consultation
            </div>
            <div className="text-xs text-slate-400">Connect with a lawyer for a free consultation</div>
          </div>
        </header>

        <div className="mt-6">
          <LawyerMatches
            data={matchData}
            onConnect={handleConnectLawyer}
          />
        </div>
      </div>

      {isChatModalOpen && selectedLawyer && (
        <ChatModal
          lawyer={selectedLawyer}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LawyerConsultPage;
