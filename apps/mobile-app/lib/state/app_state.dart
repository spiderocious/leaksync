import 'package:flutter/foundation.dart';

import '../models/item.dart';

/// In-memory app state. NO API yet — this models what the share/compose flows
/// will eventually POST to the backend, so the UI is real and the wiring is a
/// drop-in later. ChangeNotifier so screens rebuild when state changes.
class AppState extends ChangeNotifier {
  AppState() {
    _seed();
  }

  bool paired = true;
  String macName = 'Ada’s MacBook';
  String userName = 'Ada';
  final List<SentItem> sent = [];

  int _counter = 0;
  String _nextId() => 'local-${++_counter}';

  void pair(String code, {String? mac}) {
    paired = true;
    if (mac != null) macName = mac;
    notifyListeners();
  }

  void unpair() {
    paired = false;
    sent.clear();
    notifyListeners();
  }

  SentItem addSent({required ItemKind kind, required String content, String? uri}) {
    final item = SentItem(
      id: _nextId(),
      kind: kind,
      content: content,
      uri: uri,
      sentAt: DateTime.now(),
    );
    sent.insert(0, item);
    if (sent.length > 5) sent.removeRange(5, sent.length);
    notifyListeners();
    return item;
  }

  void _seed() {
    final now = DateTime.now();
    sent.addAll([
      SentItem(
        id: _nextId(),
        kind: ItemKind.url,
        content: 'https://www.nytimes.com/2026/the-quiet-web',
        sentAt: now.subtract(const Duration(minutes: 2)),
      ),
      SentItem(
        id: _nextId(),
        kind: ItemKind.text,
        content: '“The best interface is the one that gets out of the way.”',
        sentAt: now.subtract(const Duration(minutes: 18)),
      ),
    ]);
  }
}

/// "just now", "5m ago" — mirrors @leaksync/core formatRelative for the UI.
String formatRelative(DateTime when) {
  final diff = DateTime.now().difference(when);
  if (diff.inSeconds < 45) return 'just now';
  if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return '${diff.inHours}h ago';
  return '${diff.inDays}d ago';
}
