import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariants = "primary" | "secondary" | "success" | "accent";
type ButtonSize = "small" | "medium" | "large" | "full";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariants;
  size?: ButtonSize;
  leftIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  children,
  variant = "primary",
  size = "medium",
  leftIcon,
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
      {leftIcon && <span className="button__icon">{leftIcon}</span>}
      <span className="button__label">{children}</span>
    </button>
  );
}

export default Button;
