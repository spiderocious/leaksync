import 'dart:io';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../models/item.dart';
import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Compose — the two in-app ways to send without a share sheet:
///   1. Type text (a note or a pasted URL — detected).
///   2. Pick a photo/video from the library.
/// No API yet: "Send" records the item locally and returns home. Opening with
/// ?pick=1 launches the picker immediately.
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
  bool _launched = false;

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
    if (file != null) setState(() => _picked = file);
  }

  bool _isUrl(String s) =>
      RegExp(r'^https?://\S+$', caseSensitive: false).hasMatch(s) ||
      RegExp(r'^www\.\S+$', caseSensitive: false).hasMatch(s);

  void _send() {
    final state = AppScope.of(context);
    if (_picked != null) {
      state.addSent(kind: ItemKind.image, content: _picked!.name, uri: _picked!.path);
    } else {
      final text = _controller.text.trim();
      if (text.isEmpty) return;
      state.addSent(kind: _isUrl(text) ? ItemKind.url : ItemKind.text, content: text);
    }
    context.go('/');
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
                AppButton('Send to Mac',
                    variant: AppButtonVariant.box, onPressed: canSend ? _send : null),
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
          child: Image.file(File(_picked!.path), height: 280, width: double.infinity, fit: BoxFit.cover),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(child: AppText(_picked!.name, variant: AppTextVariant.read, maxLines: 1)),
            GestureDetector(
              onTap: () => setState(() => _picked = null),
              child: const AppText('remove', variant: AppTextVariant.meta, color: AppColors.warn),
            ),
          ],
        ),
      ],
    );
  }
}
