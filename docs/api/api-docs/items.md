# Items

An item is a shared thing: text, a URL, or an image. The **Android** device
sends; the **Mac** receives (via WebSocket push, with polling as the fallback).
Items auto-delete from the server **24 hours** after creation.

Images are not stored here. The client uploads the bytes to the external
file-service, then sends only the resulting `fileKey` (+ `mime`, `filename`).

**The `Item` shape** (shared in `@leaksync/core`):

```ts
interface Item {
  id: string;
  kind: 'text' | 'url' | 'image';
  text?: string;       // present for text | url
  fileKey?: string;    // present for image — the file-service key
  mime?: string;       // image only
  filename?: string;   // image only
  createdAt: string;   // ISO 8601
  seqId: number;       // monotonic per-pair cursor
}
```

---

## `POST /items`

Send an item. **Auth: `android` only** (`403` for a Mac token).

**Request — text or url**

```jsonc
{ "kind": "text", "text": "hello mac" }
{ "kind": "url",  "text": "https://example.com/article" }
```

**Request — image** (after uploading bytes to the file-service)

```jsonc
{
  "kind": "image",
  "fileKey": "avtar-550e8400-...-440000.jpg",  // required for images
  "mime": "image/jpeg",
  "filename": "photo.jpg"
}
```

**Response `201`**

```jsonc
{
  "data": {
    "item": {
      "id": "d10a4baaf70a348155b30be9",
      "kind": "text",
      "text": "hello mac",
      "createdAt": "2026-06-12T15:02:49.472Z",
      "seqId": 1
    }
  }
}
```

On success the server **relays the item to the Mac's WebSocket** if it's open.

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `validation_error` | `image` without `fileKey`; `text`/`url` without `text` |
| `401` | `unauthorized` | No/invalid token |
| `403` | `forbidden` | A `mac` token tried to POST |

---

## `GET /items?since=<seqId>&limit=<n>`

Poll for items past a cursor. **Auth: `mac` only.**

| Query | Default | Notes |
|-------|---------|-------|
| `since` | `0` | Return items with `seqId > since` |
| `limit` | `5` | 1–50 |

**Response `200`**

```jsonc
{
  "data": {
    "items": [ /* Item[], oldest-first */ ],
    "latestSeq": 7          // use as the next `since`
  }
}
```

When there's nothing new, `items` is `[]` and `latestSeq` equals the `since` you
sent. A poll that returns items should flip the Mac back to the WebSocket (see
[realtime.md](realtime.md)).

**Errors** — `401 unauthorized`, `403 forbidden` (an `android` token tried to
poll).

---

## `GET /items/recent?limit=<n>`

Last N items, **newest-first**. **Auth required** (either device). Used for the
Mac's 5-item list and the Android "recently sent" list.

```jsonc
{ "data": { "items": [ /* Item[], newest-first */ ] } }
```

`limit` default `5`, max `50`.

---

## `GET /items/:id`

Fetch a single item (e.g. a notification deep-link → highlight that item). **Auth
required.** Scoped to the caller's pair — another pair's item id returns `404`.

```jsonc
{ "data": { "item": { /* Item */ } } }
```

**Errors** — `401 unauthorized`, `404 not_found`.

---

## `DELETE /items/:id`

Dismiss an item before its 24h TTL. **Auth required.** Scoped to the caller's
pair.

**Response `204`** — empty body.

**Errors** — `401 unauthorized`, `404 not_found` (unknown id, or not in this
pair).
