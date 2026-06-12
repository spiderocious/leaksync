// Shared domain types for LeakSync. These cross the backend ↔ client seam, so
// the backend Zod schemas and the client TS types must describe the same shape.

export type DevicePlatform = 'mac' | 'android';

export type ItemKind = 'text' | 'url' | 'image';

// A single shared thing (text, url, or image). Images live in external storage
// via the file-service; we only carry the `fileKey` here, never the bytes.
export interface Item {
  id: string;
  kind: ItemKind;
  // Present for kind 'text' | 'url'.
  text?: string;
  // Present for kind 'image' — the file-service key + metadata.
  fileKey?: string;
  mime?: string;
  filename?: string;
  createdAt: string; // ISO 8601
  seqId: number; // monotonic per-pair cursor, used by Mac polling
}

// ---------- Pairing ----------

export interface PairDevice {
  platform: DevicePlatform;
  deviceName: string;
  pairedAt: string; // ISO 8601
}

// The pairing relationship between one Mac and one Android device.
export interface Pair {
  pairId: string;
  macName: string;
  userName: string;
  devices: PairDevice[];
  paired: boolean; // true once both devices are present
}

// Response from POST /pair/code — the Mac creates a pair and gets its token.
export interface PairCodeResult {
  pairId: string;
  pairingCode: string; // 6 digits
  expiresAt: string; // ISO 8601
  deviceToken: string; // the Mac's long-lived JWT
}

// Response from POST /pair/redeem — the Android device joins the pair.
export interface PairRedeemResult {
  pairId: string;
  deviceToken: string; // the Android device's long-lived JWT
  macName: string;
  userName: string;
}

// ---------- Realtime push (Mac WebSocket) ----------

// Messages the server pushes down the Mac's socket.
export type WsServerMessage =
  | { type: 'item'; item: Item }
  | { type: 'hello'; pairId: string }
  | { type: 'closing'; reason: 'ttl' }; // server closing the 5-min socket; client should poll
