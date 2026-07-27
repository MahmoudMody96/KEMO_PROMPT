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
        {(options || []).map((opt, index) => (
            <button
                // Index, not Math.random(): a fresh random key on every render
                // remounts every button and drops focus mid-interaction.
                key={opt?.value ?? `option-${index}`}
                onClick={() => onChange(opt?.value)}
                className={`selector-btn ${value === opt?.value ? 'active' : ''}`}
            >
                {opt?.label || opt?.value || ''}
            </button>
        ))}
    </div>
);

export default VisualSelector;
