import React from 'react';

const MessageBubble = ({ text, sender = 'user', sections = [], confidence }) => {
  const isUser = sender === 'user';

  const showMeta = !isUser && (sections.length > 0 || Boolean(confidence));

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 animate-fade-up`}>
      <div
        className={
          `p-4 rounded-large max-w-xl text-sm transition-all duration-300 ` +
          (isUser
            ? 'bg-linear-to-r from-accent to-indigo-700 text-white shadow-soft rounded-br-none'
            : 'glass-card text-text-primary rounded-bl-none')
        }
      >
        <div>{text}</div>
        {showMeta && (
          <div className="mt-3 text-xs text-text-secondary">
            {sections.length > 0 ? sections.join(', ') : 'No sections'}
            {confidence ? ` • ${confidence}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
