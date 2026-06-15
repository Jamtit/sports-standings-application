import {
  TOURNAMENT_ICONS,
  type IconName,
} from "../../features/tournaments/constants/icons";
import type { IconProps } from "../types";

type IconComponentProps = {
  name: IconName;
  className: IconProps["className"];
  size?: IconProps["size"];
};

function Icon({ name, className, size = 16 }: IconComponentProps) {
  const SelectedIcon = TOURNAMENT_ICONS[name];
  return <SelectedIcon className={className} size={size} />;
}

export default Icon;
