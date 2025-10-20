import { ComplaintStatusEnum } from "../enums/complaint-status-enum";
import { ScreenViewerEnum } from "../enums/screen-viewer.enum";

export interface ClientComplaintInterface {
  id: string;
  index: null;
  tenant_id: string;
  title: string;
  details: string;
  full_name: string;
  phone: string;
  max_time_to_solve: number | null;
  screen_viewer: ScreenViewerEnum;
  screen_viewer_id: string;
  screen_viewer_password: string | null;
  start_solve_at: Date | null;
  end_solve_at: Date | null;
  status: ComplaintStatusEnum;
  accept_excuse: boolean | null;
  created_at: Date | string;
  updated_at: Date | string;
}
