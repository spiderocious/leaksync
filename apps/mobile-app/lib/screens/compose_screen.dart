import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../data/api_client.dart';
import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Compose — the two in-app ways to send without a share sheet:
///   1. Type text (a note or a pasted URL — detected).
///   2. Pick a photo/video from the library (uploaded to the file-service).
/// Opening with ?pick=1 launches the picker immediately.
class ComposeScreen extends StatefulWidget {
  const ComposeScreen({super.key, this.autoPick = false});
  final bool autoPick;

  @override
  State<ComposeScreen> createState() => _ComposeScreenState();
}

class _ComposeScreenState extends State<ComposeScreen> {
  final _controller = TextEditingController();
  final _picker = ImagePicker();
  XFile? _picked;
  Uint8List? _previewBytes; // web-safe image preview
  bool _launched = false;
  bool _busy = false;

  @override
  void initState() {
    super.initState();
    if (widget.autoPick) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!_launched) {
          _launched = true;
          _pickMedia();
        }
      });
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _pickMedia() async {
    final file = await _picker.pickMedia();
    if (file != null) {
      final bytes = await file.readAsBytes();
      if (mounted) setState(() {
        _picked = file;
        _previewBytes = bytes;
      });
    }
  }

  Future<void> _send() async {
    if (_busy) return;
    final state = AppScope.of(context);
    setState(() => _busy = true);
    try {
      if (_picked != null) {
        final bytes = await _picked!.readAsBytes();
        await state.sendImage(
          bytes,
          filename: _picked!.name,
          mime: _picked!.mimeType ?? _guessMime(_picked!.name),
        );
      } else {
        final text = _controller.text.trim();
        if (text.isEmpty) {
          setState(() => _busy = false);
          return;
        }
        await state.sendText(text);
      }
      if (mounted) context.go('/');
    } on ApiException catch (e) {
      _fail(e.message);
    } catch (_) {
      _fail('Couldn’t send. Check your connection and try again.');
    }
  }

  void _fail(String msg) {
    if (!mounted) return;
    setState(() => _busy = false);
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  String? _guessMime(String name) {
    final n = name.toLowerCase();
    if (n.endsWith('.png')) return 'image/png';
    if (n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image/jpeg';
    if (n.endsWith('.gif')) return 'image/gif';
    if (n.endsWith('.webp')) return 'image/webp';
    if (n.endsWith('.mp4')) return 'video/mp4';
    if (n.endsWith('.mov')) return 'video/quicktime';
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final canSend = _picked != null || _controller.text.trim().isNotEmpty;

    return ScreenScaffold(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: () => context.pop(),
                child: const AppText('Cancel', variant: AppTextVariant.body, color: AppColors.ink3),
              ),
              const AppText('New send', variant: AppTextVariant.overline),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 6),
          AppText('to ${state.macName}',
              variant: AppTextVariant.read, italic: true, fontSize: 12.5, color: AppColors.ink3),
          const SizedBox(height: 20),
          Expanded(
            child: _picked != null ? _preview() : _input(),
          ),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: AppColors.hair)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: _pickMedia,
                  child: Row(
                    children: [
                      const Icon(Icons.image_outlined, size: 18, color: AppColors.ink2),
                      const SizedBox(width: 7),
                      AppText(_picked != null ? 'Change photo' : 'Photo or video',
                          variant: AppTextVariant.body, fontSize: 12),
                    ],
                  ),
                ),
                AppButton(_busy ? 'Sending…' : 'Send to Mac',
                    variant: AppButtonVariant.box, onPressed: canSend && !_busy ? _send : null),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _input() {
    return TextField(
      controller: _controller,
      autofocus: !widget.autoPick,
      maxLines: null,
      expands: true,
      textAlignVertical: TextAlignVertical.top,
      onChanged: (_) => setState(() {}),
      style: AppFonts.serif(size: 16, height: 1.5),
      decoration: InputDecoration(
        border: InputBorder.none,
        hintText: 'Write something, or paste a link…',
        hintStyle: AppFonts.serif(size: 16, color: AppColors.ink4),
      ),
    );
  }

  Widget _preview() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(AppRadius.card),
          child: _previewBytes != null
              ? Image.memory(_previewBytes!, height: 280, width: double.infinity, fit: BoxFit.cover)
              : Container(height: 280, color: AppColors.paper3),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(child: AppText(_picked!.name, variant: AppTextVariant.read, maxLines: 1)),
            GestureDetector(
              onTap: () => setState(() {
                _picked = null;
                _previewBytes = null;
              }),
              child: const AppText('remove', variant: AppTextVariant.meta, color: AppColors.warn),
            ),
          ],
        ),
      ],
    );
  }
}
