interface AlertState {
  isShow: boolean;
  msg: string;
  type: "error" | "success" | "warning" | "info";
}
