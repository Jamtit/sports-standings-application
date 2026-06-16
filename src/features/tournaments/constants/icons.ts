import {
  BasketballIcon,
  PlusIcon,
  TennisBallIcon,
} from "../../../assets/icons";

export const TOURNAMENT_ICONS = {
  plus: PlusIcon,
  basketball: BasketballIcon,
  tennis: TennisBallIcon,
} as const;

export type IconName = keyof typeof TOURNAMENT_ICONS;
