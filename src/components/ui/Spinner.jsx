import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`${sizes[size]} relative`}>
                <div className="
          absolute inset-0 rounded-full
          border-2 border-[#2a2a3e]
        "></div>
                <div className="
          absolute inset-0 rounded-full
          border-2 border-transparent border-t-[#00f5ff] border-r-[#ff00ff]
          spinner
        "></div>
            </div>
        </div>
    );
};

export default Spinner;
