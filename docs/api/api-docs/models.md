# Data models (MongoDB)

Two collections. The default database is `leaksync` (`MONGO_DB_NAME`).

## `pairs`

One document per Mac↔Android pairing. `_id` is the `pairId` (a hex string).

```ts
interface PairDoc {
  _id: string;            // pairId
  macName: string;
  userName: string;
  devices: Array<{
    deviceId: string;     // JWT subject; lets unpair target one device
    platform: 'mac' | 'android';
    deviceName: string;
    pairedAt: Date;
  }>;
  seqCounter: number;     // monotonic; bumped on each item POST → item.seqId
  pairingCode?: string;   // 6 digits; present until redeemed, then unset
  codeExpiresAt?: Date;   // TTL anchor for an unredeemed code; unset on redeem
  createdAt: Date;
}
```

**Indexes**

| Index | Why |
|-------|-----|
| `{ pairingCode: 1 }` (sparse) | Redeem lookup by code |
| `{ codeExpiresAt: 1 }` TTL `expireAfterSeconds: 0` (sparse) | An unredeemed pair self-cleans when its code expires |

## `items`

One document per shared thing. `_id` is the item id.

```ts
interface ItemDoc {
  _id: string;            // item id
  pairId: string;
  kind: 'text' | 'url' | 'image';
  text?: string;          // text | url
  fileKey?: string;       // image — the file-service key (no bytes stored here)
  mime?: string;
  filename?: string;
  seqId: number;          // = pairs.seqCounter at insert time (per-pair cursor)
  createdAt: Date;        // TTL anchor
}
```

**Indexes**

| Index | Why |
|-------|-----|
| `{ pairId: 1, seqId: 1 }` | Poll: items with `seqId > since`, ordered |
| `{ pairId: 1, createdAt: -1 }` | Recent list, newest-first |
| `{ createdAt: 1 }` TTL `expireAfterSeconds: 86400` | **24h auto-delete** (PRD §3) |

## Notes

- **Device tokens are not stored.** They're stateless JWTs; the server verifies
  signatures. `devices[].deviceId` exists only so `unpair` can remove one device.
- **`seqId` is allocated atomically** via `findOneAndUpdate($inc seqCounter)` on
  the pair, so concurrent POSTs never collide.
- **Images never touch this DB or its storage** — only the file-service `key`.
