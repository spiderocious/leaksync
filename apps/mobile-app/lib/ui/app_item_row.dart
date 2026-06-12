import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/tokens.dart';
import 'app_text.dart';

/// AppItemRow — ported from packages/ui app-item-row.tsx. The one component the
/// whole product is built from: every shared thing is a row — a line of serif
/// text, a mono URL, or a thumbnail. Tapping copies the content back with the
/// same moss "copied" feedback.
enum RowKind { text, link, image }

class RowItem {
  RowItem({
    required this.id,
    required this.kind,
    required this.content,
    required this.when,
    this.thumbPath,
    this.fresh = false,
  });

  final String id;
  final RowKind kind;
  final String content;
  final String when;
  final String? thumbPath;
  final bool fresh;
}

class AppItemRow extends StatefulWidget {
  const AppItemRow({super.key, required this.item});
  final RowItem item;

  @override
  State<AppItemRow> createState() => _AppItemRowState();
}

class _AppItemRowState extends State<AppItemRow> {
  bool _copied = false;
  bool _pressed = false;

  Future<void> _handleTap() async {
    await Clipboard.setData(ClipboardData(text: widget.item.content));
    setState(() => _copied = true);
    Future.delayed(const Duration(milliseconds: 1600), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  static const _kindLabel = {RowKind.text: 'Text', RowKind.link: 'Link', RowKind.image: 'Image'};

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final active = _pressed || _copied;

    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: _handleTap,
      child: Container(
        padding: EdgeInsets.only(
          left: item.fresh ? 15 : 18,
          right: 18,
          top: 14,
          bottom: 14,
        ),
        decoration: BoxDecoration(
          color: active ? AppColors.paper2 : Colors.transparent,
          border: Border(
            bottom: const BorderSide(color: AppColors.hair),
            left: item.fresh
                ? const BorderSide(color: AppColors.moss, width: 3)
                : BorderSide.none,
          ),
        ),
        child: _buildBody(item),
      ),
    );
  }

  Widget _buildBody(RowItem item) {
    switch (item.kind) {
      case RowKind.image:
        return Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.paper3,
                borderRadius: BorderRadius.circular(AppRadius.sharp),
                border: Border.all(color: AppColors.hair),
                image: item.thumbPath != null
                    ? DecorationImage(image: FileImage(File(item.thumbPath!)), fit: BoxFit.cover)
                    : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _decorated(AppText(item.content, variant: AppTextVariant.read, fontSize: 12.5, maxLines: 1)),
                  _meta(item),
                ],
              ),
            ),
          ],
        );
      case RowKind.link:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.link, size: 13, color: AppColors.ink2),
                const SizedBox(width: 7),
                Expanded(
                  child: _decorated(AppText(item.content, variant: AppTextVariant.mono, maxLines: 1)),
                ),
              ],
            ),
            _meta(item),
          ],
        );
      case RowKind.text:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _decorated(AppText(item.content, variant: AppTextVariant.read, maxLines: 2)),
            _meta(item),
          ],
        );
    }
  }

  // The moss underline on a freshly-copied row.
  Widget _decorated(Widget child) {
    if (!_copied) return child;
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.moss, width: 2)),
      ),
      child: child,
    );
  }

  Widget _meta(RowItem item) {
    return Padding(
      padding: const EdgeInsets.only(top: 6),
      child: Row(
        children: [
          AppText('${_kindLabel[item.kind]} · ', variant: AppTextVariant.meta),
          if (_copied)
            AppText('copied', variant: AppTextVariant.meta, color: AppColors.mossDeep)
          else
            AppText(item.when, variant: AppTextVariant.meta),
        ],
      ),
    );
  }
}
