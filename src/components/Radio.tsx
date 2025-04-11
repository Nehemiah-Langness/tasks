import React from "react";


export function Radio<T extends string>({
  formValue, label, onChange, ...inputProps
}: React.JSX.IntrinsicElements["input"] & {
  formValue: T;
  value: T;
  label: string;
  onChange: (v: T) => void;
}) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        checked={inputProps.value === formValue}
        onChange={() => onChange(inputProps.value)}
        id={inputProps.value}
        {...inputProps} />
      <label
        className="form-check-label fw-normal"
        htmlFor={inputProps.id ?? inputProps.value}
      >
        {label}
      </label>
    </div>
  );
}
