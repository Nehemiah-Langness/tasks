import React from "react";

export function Radio<T extends string | number>({
  formValue,
  label,
  onChange,
  ...inputProps
}: Omit<React.JSX.IntrinsicElements["input"], 'onChange' | 'value'> & {
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
        id={inputProps.value.toString()}
        {...inputProps}
      />
      <label
        className="form-check-label fw-normal"
        htmlFor={inputProps.id ?? inputProps.value.toString()}
      >
        {label}
      </label>
    </div>
  );
}
