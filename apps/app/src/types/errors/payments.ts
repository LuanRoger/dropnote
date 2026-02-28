export class WebhookSecretVerificationFailed extends Error {
  constructor() {
    super("Webhook signature verification failed.");
    this.name = "WebhookSecretVerificationFailed";
  }
}
