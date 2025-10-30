import { ClientComplaintInterface } from "./clients.interface";

export interface ManagerComplaintInterface extends ClientComplaintInterface {
  client: {
    id: string;
    user_name: string;
  };
  solving: {
    id: string;
    tenant_id: string;
    index: number;
    //* SUPPORTER
    supporter: {
      id: string;
      user_name: string;
    };
    accept_status: string;
    intervention_date: Date | null;
    choice_taked_at: Date;
    created_at: Date;
  }[];
}
