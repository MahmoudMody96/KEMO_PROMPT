// src/components/ui/FormField.jsx - Form Field Wrapper

import React from 'react';

/**
 * Form field wrapper with label and icon support
 * @param {string} label - Field label text
 * @param {React.Component} icon - Icon component to display
 * @param {React.ReactNode} children - Field content
 * @param {boolean} isRTL - Right-to-left mode
 */
const FormField = ({ label, icon: Icon, children, isRTL }) => (
    <div className="field-group">
        <label className={`field-label ${isRTL ? 'flex-row-reverse' : ''}`}>
            {Icon && <Icon className="w-4 h-4 field-label-icon" />}
            <span>{label || ''}</span>
        </label>
        {children}
    </div>
);

export default FormField;
