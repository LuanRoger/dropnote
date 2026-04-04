export class WebhookSecretVerificationFailed extends Error {
  constructor() {
    super("Webhook signature verification failed.");
    this.name = "WebhookSecretVerificationFailed";
  }
}

export class NoMetadataProductError extends Error {
  constructor(productId: string) {
    super(`Product ${productId} is missing internal name in metadata.`);
    this.name = "NoMetadataProductError";
  }
}
