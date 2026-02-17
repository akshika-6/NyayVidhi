import React from "react";

const SectionCard = ({ title, icon: Icon, children, className = "" }) => {
  return (
    <section className={`glass-section rounded-large p-4 border border-border ${className}`}>
      <h3 className="flex items-center text-sm font-semibold text-text-secondary mb-2">
        {Icon ? <Icon size={16} className="mr-2 text-accent" /> : null}
        {title}
      </h3>
      {children}
    </section>
  );
};

export default React.memo(SectionCard);
