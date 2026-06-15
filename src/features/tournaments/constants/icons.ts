import { BasketballIcon, PlusIcon } from "../../../assets/icons";
import { TennisBallIcon } from "../../../assets/icons/TennisBallIcon";

export const TOURNAMENT_ICONS = {
  plus: PlusIcon,
  basketball: BasketballIcon,
  tennis: TennisBallIcon,
} as const;

export type IconName = keyof typeof TOURNAMENT_ICONS;
