import type { IconProps } from "../../shared/types";

export function BasketballIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <mask id="basketball-mask">
          <circle cx="8" cy="8" r="6.8" fill="white" />

          <path
            d="M1.8 8H14.2"
            stroke="black"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          <path
            d="M8 1.8V14.2"
            stroke="black"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          <path
            d="M3.5 3.2C5.8 5.4 5.8 10.6 3.5 12.8"
            stroke="black"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M12.5 3.2C10.2 5.4 10.2 10.6 12.5 12.8"
            stroke="black"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>

      <g transform="rotate(45 8 8)">
        <circle
          cx="8"
          cy="8"
          r="6.8"
          fill="white"
          mask="url(#basketball-mask)"
        />
      </g>
    </svg>
  );
}
