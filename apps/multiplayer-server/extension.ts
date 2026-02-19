import type {
  beforeHandleMessagePayload,
  Extension,
  onAuthenticatePayload,
  onAwarenessUpdatePayload,
  onConnectPayload,
  onDestroyPayload,
  onDisconnectPayload,
  onListenPayload,
} from "@hocuspocus/server";
import { isAuthValid } from "./utils/auth";

export class DropnoteMultiplayerServerExtension implements Extension {
  private readonly serverName: string;
  private readonly address: string;
  private readonly apiKey: string;
  private readonly maxUsersPerRoom: number;

  constructor(
    serverName: string,
    address: string,
    apiKey: string,
    maxUsersPerRoom: number,
  ) {
    this.serverName = serverName;
    this.address = address;
    this.apiKey = apiKey;
    this.maxUsersPerRoom = maxUsersPerRoom;
  }

  onListen(data: onListenPayload): Promise<void> {
    console.log(
      `🚀 ${this.serverName} is listening on ${this.address}:${data.port}`,
    );
    console.log(`IPv6 enabled: ${this.address}`);

    return Promise.resolve();
  }

  onConnect(data: onConnectPayload): Promise<void> {
    console.log(`📥 Client connected to room: ${data.documentName}`);

    return Promise.resolve();
  }

  onAuthenticate(data: onAuthenticatePayload): Promise<void> {
    const { token } = data;
    const isAuthenticated = isAuthValid(this.apiKey, token);

    if (isAuthenticated) {
      console.log(
        `✅ Authentication successful for room: ${data.documentName}`,
      );
      return Promise.resolve();
    }

    console.log(`❌ Authentication failed for room: ${data.documentName}`);
    throw new Error("Invalid API key.");
  }

  beforeHandleMessage(data: beforeHandleMessagePayload): Promise<void> {
    const awarenessStates = data.document.awareness.getStates();
    const activeUsers = awarenessStates.size;

    if (activeUsers > this.maxUsersPerRoom) {
      console.log(
        `❌ Room ${data.documentName} is full: ${activeUsers}/${this.maxUsersPerRoom} users`,
      );
      throw new Error(
        `Room is full. Maximum ${this.maxUsersPerRoom} users allowed.`,
      );
    }

    return Promise.resolve();
  }

  onAwarenessUpdate(data: onAwarenessUpdatePayload): Promise<void> {
    const activeUsers = data.states.length;
    console.log(
      `👥 Active users in room ${data.documentName}: ${activeUsers}/${this.maxUsersPerRoom}`,
    );

    return Promise.resolve();
  }

  onDisconnect(data: onDisconnectPayload): Promise<void> {
    console.log(`📤 Client disconnected from room: ${data.documentName}`);

    return Promise.resolve();
  }

  onDestroy(_: onDestroyPayload): Promise<void> {
    console.log(`🛑 ${this.serverName} is shutting down`);

    return Promise.resolve();
  }
}
