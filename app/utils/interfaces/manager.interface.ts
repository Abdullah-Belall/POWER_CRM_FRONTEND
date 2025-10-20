import { ClientComplaintInterface } from "./clients.interface";

export interface ManagerComplaintInterface extends ClientComplaintInterface {
  user: {
    id: string;
    user_name: string;
  };
  solving: {
    id: string;
    tenant_id: string;
    index: number;
    //* SUPPORTER
    user: {
      id: string;
      user_name: string;
    };
    accept_status: string;
    choice_taked_at: Date;
    created_at: Date;
  }[];
}
