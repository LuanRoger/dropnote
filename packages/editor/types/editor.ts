import type { Badge } from "./badge";

export type ColaborationOptions = {
  name: string;
  color: string;
  roomName: string;
  wssUrl: string;
  token: string;
};

export type EditorOptions = {
  maxLength: number;
  expireAt?: Date;
  colabration?: ColaborationOptions;
  badges?: Badge[];
};
