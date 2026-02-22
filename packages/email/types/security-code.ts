export type PasswordVerb = "create" | "update";

export type SendSecurityCodeToEmailParams = {
  passwordVerb: PasswordVerb;
  noteCode: string;
  securityCode: string;
  passwordUpdateUrl: string;
};
