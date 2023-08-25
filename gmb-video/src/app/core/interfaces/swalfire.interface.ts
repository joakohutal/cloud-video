import { SweetAlertIcon } from "sweetalert2";

export interface ISwalfire {
  icon: SweetAlertIcon | undefined,
  title: string,
  text?: string
}
