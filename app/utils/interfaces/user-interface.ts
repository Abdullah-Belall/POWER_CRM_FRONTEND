import { LangsEnum } from "../enums/langs-enums";
import { RoleInterface } from "./common.interface";

export interface UserInterface {
  id: string;
  index: number;
  user_name: string;
  phone: string;
  email: string;
  role: RoleInterface;
  lang: LangsEnum;
  created_at: Date;
}
