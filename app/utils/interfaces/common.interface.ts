import { UserInterface } from "./user-interface";

export interface RoleInterface {
  id: string;
  tenant_id: string;
  users: UserInterface[];
  users_count?: number;
  name: string;
  code: number;
  roles: string;
  created_at: Date;
  updated_at: Date;
}
