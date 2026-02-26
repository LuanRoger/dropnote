import { Resend } from "resend";
import { keys as env } from "./keys";

export const client = new Resend(env().RESEND_API_KEY);
