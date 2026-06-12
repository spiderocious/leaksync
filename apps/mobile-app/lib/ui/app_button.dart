import 'package:flutter/material.dart';

import '../theme/tokens.dart';
import 'app_text.dart';

/// AppButton — ported from packages/ui app-button.tsx. E-ink has almost no
/// buttons. Almost every action is "tap the item"; what's left is quiet text
/// actions and exactly ONE bordered button for the single deliberate moment
/// (pairing). No fills, no colour, no shadow.
enum AppButtonVariant { text, quiet, box, danger }

class AppButton extends StatefulWidget {
  const AppButton(
    this.label, {
    super.key,
    this.variant = AppButtonVariant.text,
    this.onPressed,
    this.full = false,
  });

  final String label;
  final AppButtonVariant variant;
  final VoidCallback? onPressed;
  final bool full;

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final disabled = widget.onPressed == null;
    final isBox = widget.variant == AppButtonVariant.box;

    Color labelColor;
    switch (widget.variant) {
      case AppButtonVariant.quiet:
        labelColor = AppColors.ink3;
        break;
      case AppButtonVariant.box:
        labelColor = _pressed ? AppColors.paper : AppColors.ink;
        break;
      default:
        labelColor = AppColors.ink2;
    }

    Widget child = AppText(
      widget.label,
      variant: AppTextVariant.body,
      fontSize: 12,
      color: disabled ? AppColors.ink4 : labelColor,
      textAlign: TextAlign.center,
    );

    final content = Container(
      alignment: Alignment.center,
      padding: isBox
          ? const EdgeInsets.symmetric(horizontal: 18, vertical: 11)
          : const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
      decoration: isBox
          ? BoxDecoration(
              color: _pressed ? AppColors.ink : Colors.transparent,
              border: Border.all(color: AppColors.ink),
              borderRadius: BorderRadius.circular(AppRadius.card),
            )
          : (!isBox && _pressed
              ? const BoxDecoration(
                  border: Border(bottom: BorderSide(color: AppColors.ink)),
                )
              : null),
      child: child,
    );

    return Opacity(
      opacity: disabled ? 0.4 : 1,
      child: GestureDetector(
        onTapDown: disabled ? null : (_) => setState(() => _pressed = true),
        onTapUp: disabled ? null : (_) => setState(() => _pressed = false),
        onTapCancel: disabled ? null : () => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: widget.full ? SizedBox(width: double.infinity, child: content) : content,
      ),
    );
  }
}
