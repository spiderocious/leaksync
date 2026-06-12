import 'dart:typed_data';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../data/api_client.dart';
import '../data/config.dart';
import '../data/file_service.dart';
import '../models/item.dart';

/// The app's real backend-backed state. Persists the device token + pair
/// identity (and an optional API-base override) in shared_preferences, so the
/// phone stays paired across launches. Screens call the async methods and react
/// to notifyListeners().
class AppState extends ChangeNotifier {
  AppState();

  static const _kToken = 'leaksync.deviceToken';
  static const _kPairId = 'leaksync.pairId';
  static const _kMac = 'leaksync.macName';
  static const _kUser = 'leaksync.userName';
  static const _kApiBase = 'leaksync.apiBase';

  late SharedPreferences _prefs;
  late ApiClient _api;
  late FileService _files;

  bool _ready = false;
  bool get ready => _ready;

  bool paired = false;
  String macName = '';
  String userName = '';
  String? _token;

  /// The last-5 items this phone has sent (loaded from the backend when paired).
  final List<Item> sent = [];

  String get apiBase => _api.base;

  // ---- bootstrap ----

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    final base = _prefs.getString(_kApiBase) ?? kApiBaseDefine;
    _token = _prefs.getString(_kToken);
    macName = _prefs.getString(_kMac) ?? '';
    userName = _prefs.getString(_kUser) ?? '';
    paired = _token != null;

    _api = ApiClient(base: base, token: _token);
    _files = FileService(base: kFileServiceDefine);

    _ready = true;
    notifyListeners();

    if (paired) {
      // best-effort: refresh the recent list
      unawaited(loadRecent());
    }
  }

  // ---- config ----

  Future<void> setApiBase(String base) async {
    final clean = base.trim();
    _api.base = clean;
    await _prefs.setString(_kApiBase, clean);
    notifyListeners();
  }

  // ---- pairing ----

  /// Redeem the 6-digit code. Throws ApiException on failure (caller shows it).
  Future<void> pair(String code, {String deviceName = 'My phone'}) async {
    final result = await _api.redeem(code, deviceName);
    _token = result.deviceToken;
    _api.token = result.deviceToken;
    macName = result.macName;
    userName = result.userName;
    paired = true;
    sent.clear();
    await _persistPair();
    notifyListeners();
    unawaited(loadRecent());
  }

  Future<void> unpair() async {
    try {
      await _api.unpair();
    } catch (_) {
      // even if the call fails, drop local state
    }
    _token = null;
    _api.token = null;
    paired = false;
    macName = '';
    userName = '';
    sent.clear();
    await _prefs.remove(_kToken);
    await _prefs.remove(_kPairId);
    await _prefs.remove(_kMac);
    await _prefs.remove(_kUser);
    notifyListeners();
  }

  // ---- sending ----

  /// Send a text or URL item. Throws ApiException on failure.
  Future<void> sendText(String text) async {
    final kind = _isUrl(text) ? ItemKind.url : ItemKind.text;
    final item = await _api.sendItem(kind: kind, text: text);
    _prepend(item);
  }

  /// Send an image: upload bytes to the file-service, then POST the key.
  Future<void> sendImage(Uint8List bytes, {required String filename, String? mime}) async {
    final up = await _files.upload(bytes, filename: filename, mime: mime);
    final item = await _api.sendItem(
      kind: ItemKind.image,
      fileKey: up.key,
      mime: up.mime,
      filename: up.filename,
    );
    _prepend(item);
  }

  // ---- recent ----

  Future<void> loadRecent() async {
    if (!paired) return;
    try {
      final items = await _api.recent(limit: 5);
      sent
        ..clear()
        ..addAll(items);
      notifyListeners();
    } catch (_) {
      // offline / transient — leave the existing list
    }
  }

  // ---- internals ----

  void _prepend(Item item) {
    sent.insert(0, item);
    if (sent.length > 5) sent.removeRange(5, sent.length);
    notifyListeners();
  }

  Future<void> _persistPair() async {
    if (_token != null) await _prefs.setString(_kToken, _token!);
    await _prefs.setString(_kMac, macName);
    await _prefs.setString(_kUser, userName);
  }

  bool _isUrl(String s) {
    final t = s.trim();
    return RegExp(r'^https?://\S+$', caseSensitive: false).hasMatch(t) ||
        RegExp(r'^www\.\S+$', caseSensitive: false).hasMatch(t);
  }
}

/// "just now", "5m ago" — unchanged.
String formatRelative(DateTime when) {
  final diff = DateTime.now().difference(when);
  if (diff.inSeconds < 45) return 'just now';
  if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
  if (diff.inHours < 24) return '${diff.inHours}h ago';
  return '${diff.inDays}d ago';
}
