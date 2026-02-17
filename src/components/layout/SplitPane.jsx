import React from 'react';

const SplitPane = ({ left, right, className = '' }) => {
    return (
        <div className={`
      grid grid-cols-1 lg:grid-cols-2 gap-6
      ${className}
    `}>
            <div className="glass-card p-6 fade-in">
                {left}
            </div>
            <div className="glass-card p-6 fade-in" style={{ animationDelay: '0.1s' }}>
                {right}
            </div>
        </div>
    );
};

export default SplitPane;
