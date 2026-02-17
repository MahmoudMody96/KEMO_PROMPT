// src/components/ui/Select.jsx - Dropdown Select Component

import React from 'react';

/**
 * Styled select dropdown component
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback when selection changes
 * @param {Array} options - Array of {value, label} objects
 * @param {boolean} isRTL - Right-to-left mode
 */
const Select = ({ value = '', onChange, options = [], isRTL }) => (
    <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`input-base input-md select-base ${isRTL ? 'text-right' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
    >
        {(options || []).map((opt, idx) => (
            <option key={opt?.value || idx} value={opt?.value || ''}>
                {opt?.label || opt?.value || ''}
            </option>
        ))}
    </select>
);

export default Select;
