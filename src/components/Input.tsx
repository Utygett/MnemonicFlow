import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
}

export function Input({
  value,
  onChange,
  placeholder,
  label,
  multiline = false,
  rows = 3,
  disabled = false,
}: InputProps) {
  const baseStyles = 'w-full px-4 py-3 rounded-lg border-2 border-[#2D3548] focus:border-[#4A6FA5] focus:outline-none transition-colors bg-[#1A1F2E] text-[#E8EAF0] placeholder:text-[#9CA3AF]';
  
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-[#E8EAF0]">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`${baseStyles} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={baseStyles}
        />
      )}
    </div>
  );
}