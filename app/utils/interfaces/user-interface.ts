import { LangsEnum } from "../enums/langs-enums";

export interface UserInterface {
  id: string;
  index: number;
  user_name: string;
  email: string;
  roles: string;
  lang: LangsEnum;
  created_at: Date;
}
