type FlagIconProps = {
  className?: string;
  code: string;
  label: string;
};

function FlagIcon({ className, code, label }: FlagIconProps) {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} ${className}`}
      role="img"
      aria-label={`${label} flag`}
    />
  );
}

export default FlagIcon;
