import React from "react";

const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 p-2">
    <div className="typing-dot bg-[var(--text-secondary)]" style={{ animationDelay: "-0.32s" }} />
    <div className="typing-dot bg-[var(--text-secondary)]" style={{ animationDelay: "-0.16s" }} />
    <div className="typing-dot bg-[var(--text-secondary)]" />
  </div>
);

export default React.memo(TypingIndicator);
