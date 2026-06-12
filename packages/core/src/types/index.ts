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
