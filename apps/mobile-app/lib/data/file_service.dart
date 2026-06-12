import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;

import 'api_client.dart' show ApiException;

/// Uploads image/video bytes to the external file-service and returns the
/// permanent `key`. The flow (per the file-service doc):
///   1. GET /get-upload-uri?ext=<ext>  → { key, uri }
///   2. PUT bytes directly to `uri`   (straight to storage, not through us)
///   3. send the `key` to our backend
///
/// Works on web (bytes) and mobile (bytes from XFile.readAsBytes()).
class FileService {
  FileService({required this.base});

  /// e.g. https://go-file-service-production.up.railway.app
  String base;

  Future<UploadResult> upload(Uint8List bytes, {required String filename, String? mime}) async {
    final ext = _ext(filename);

    // 1. signed upload URI + key
    final uriRes = await http.get(Uri.parse('$base/get-upload-uri${ext.isNotEmpty ? '?ext=$ext' : ''}'));
    if (uriRes.statusCode != 200) {
      throw ApiException('internal', 'Could not start upload', uriRes.statusCode);
    }
    final body = jsonDecode(uriRes.body) as Map<String, dynamic>;
    final key = body['key'] as String;
    final putUrl = body['uri'] as String;

    // 2. PUT the bytes straight to storage
    final putRes = await http.put(
      Uri.parse(putUrl),
      headers: {if (mime != null) 'Content-Type': mime},
      body: bytes,
    );
    if (putRes.statusCode < 200 || putRes.statusCode >= 300) {
      throw ApiException('internal', 'Upload failed', putRes.statusCode);
    }

    return UploadResult(key: key, mime: mime, filename: filename);
  }

  // 'photo.jpg' -> 'jpg'  (alphanumeric only, no dot — per the service rules)
  String _ext(String filename) {
    final dot = filename.lastIndexOf('.');
    if (dot < 0 || dot == filename.length - 1) return '';
    final raw = filename.substring(dot + 1).toLowerCase();
    return raw.replaceAll(RegExp(r'[^a-z0-9]'), '');
  }
}

class UploadResult {
  UploadResult({required this.key, required this.filename, this.mime});
  final String key;
  final String filename;
  final String? mime;
}
