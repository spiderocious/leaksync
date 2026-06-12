/// Item kinds — mirror the backend's @leaksync/core ItemKind.
enum ItemKind { text, url, image }

extension ItemKindWire on ItemKind {
  /// The string the backend uses ('text' | 'url' | 'image').
  String get wire => switch (this) {
        ItemKind.text => 'text',
        ItemKind.url => 'url',
        ItemKind.image => 'image',
      };

  static ItemKind fromWire(String s) => switch (s) {
        'url' => ItemKind.url,
        'image' => ItemKind.image,
        _ => ItemKind.text,
      };
}

/// The backend Item shape (returned by POST /items, GET /items/recent). Images
/// carry a file-service `fileKey`, never bytes.
class Item {
  Item({
    required this.id,
    required this.kind,
    required this.createdAt,
    required this.seqId,
    this.text,
    this.fileKey,
    this.mime,
    this.filename,
  });

  final String id;
  final ItemKind kind;
  final String? text;
  final String? fileKey;
  final String? mime;
  final String? filename;
  final DateTime createdAt;
  final int seqId;

  factory Item.fromJson(Map<String, dynamic> j) => Item(
        id: j['id'] as String,
        kind: ItemKindWire.fromWire(j['kind'] as String),
        text: j['text'] as String?,
        fileKey: j['fileKey'] as String?,
        mime: j['mime'] as String?,
        filename: j['filename'] as String?,
        createdAt: DateTime.parse(j['createdAt'] as String),
        seqId: (j['seqId'] as num).toInt(),
      );

  /// The display string for the home "recently sent" list.
  String get display => switch (kind) {
        ItemKind.image => filename ?? 'Image',
        _ => text ?? '',
      };
}

/// A locally-composed item before/while sending (the compose + share flows build
/// this; on success it becomes a backend Item).
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
  final String content;
  final String? uri;
  final DateTime sentAt;
}
