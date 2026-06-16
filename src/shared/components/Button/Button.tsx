import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

type ButtonVariants = "primary" | "accent";
type ButtonSize = "small" | "medium" | "large" | "full";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariants;
  size?: ButtonSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} button--${size} ${className}`}
      type={type}
      {...props}
    >
      <div className="button__label">{children}</div>
    </button>
  );
}

export default Button;
