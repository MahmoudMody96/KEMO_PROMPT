// src/components/ui/VisualSelector.jsx - Button Group Selector

import React from 'react';

/**
 * Visual button group selector for choosing from options
 * @param {Array} options - Array of {value, label} objects
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {boolean} isRTL - Right-to-left mode
 */
const VisualSelector = ({ options = [], value, onChange, isRTL }) => (
    <div className={`selector-group ${isRTL ? 'flex-row-reverse' : ''}`}>
        {(options || []).map((opt) => (
            <button
                key={opt?.value || Math.random()}
                onClick={() => onChange(opt?.value)}
                className={`selector-btn ${value === opt?.value ? 'active' : ''}`}
            >
                {opt?.label || opt?.value || ''}
            </button>
        ))}
    </div>
);

export default VisualSelector;
