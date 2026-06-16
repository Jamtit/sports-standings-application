import type { SelectHTMLAttributes } from "react";
import "./Select.scss";

type SelectOptions = {
  label: string;
  value: string;
};

type SelectSizes = "small" | "medium" | "large" | "full";

type SelectProps = {
  label?: string;
  options: SelectOptions[];
  placeholder?: string;
  selectSize: SelectSizes;
} & SelectHTMLAttributes<HTMLSelectElement>;

function Select({
  label,
  options,
  selectSize = "small",
  placeholder = "Select Option",
  id,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={`select ${className}`}>
      {label && (
        <label className="select__label" htmlFor={id}>
          {label}
        </label>
      )}

      <select
        className={`select__field select__field--${selectSize}`}
        id={id}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
