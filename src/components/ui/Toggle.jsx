// src/components/ui/Toggle.jsx - iOS Style Toggle Switch

import React from 'react';

/**
 * iOS-style toggle switch component
 * @param {boolean} active - Whether the toggle is active
 * @param {function} onChange - Callback when toggle state changes
 * @param {boolean} purple - Use purple color instead of green
 */
const Toggle = ({ active, onChange, purple = false }) => (
    <button
        onClick={() => onChange(!active)}
        className={`toggle-switch ${active ? 'active' : ''} ${active && purple ? 'purple' : ''}`}
        role="switch"
        aria-checked={active}
    />
);

export default Toggle;
