/// Shared item model — mirrors @leaksync/core Item / ItemKind. Images live in
/// external storage via the file-service; we only carry the local uri/filename
/// for the UI here (no API yet).
enum ItemKind { text, url, image }

class SentItem {
  SentItem({
    required this.id,
    required this.kind,
    required this.content,
    required this.sentAt,
    this.uri,
  });

  final String id;
  final ItemKind kind;

  /// text body, the URL, or the image filename.
  final String content;

  /// local file uri for an image preview (kind == image).
  final String? uri;

  /// when the item was sent.
  final DateTime sentAt;
}
