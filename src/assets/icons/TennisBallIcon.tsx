import type { IconProps } from "../../shared/types";

export function TennisBallIcon({ className, size = 16 }: IconProps) {
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
        <mask id="tennisBallMask">
          <rect width="16" height="16" fill="white" />
          <path
            d="M7.35 0.7C7.95 3.8 6.45 6.45 4.1 7.2C2.95 7.55 1.85 7.45 0.8 7.05"
            stroke="black"
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M8.65 15.3C8.05 12.2 9.55 9.55 11.9 8.8C13.05 8.45 14.15 8.55 15.2 8.95"
            stroke="black"
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
          />
        </mask>
      </defs>

      <circle
        cx="8"
        cy="8"
        r="7.2"
        fill="currentColor"
        mask="url(#tennisBallMask)"
      />
    </svg>
  );
}
