import 'package:flutter/widgets.dart';

import '../theme/tokens.dart';

/// AppText — the e-ink type scale, ported 1:1 from packages/ui app-text.tsx.
/// Three families, three jobs: Literata serif for things you READ (item bodies,
/// the wordmark, the pairing code), Inter for CHROME (labels, meta, buttons),
/// JetBrains Mono for the RECORD (URLs, codes, timestamps).
enum AppTextVariant { wordmark, display, read, body, meta, overline, mono }

class AppText extends StatelessWidget {
  const AppText(
    this.text, {
    super.key,
    this.variant = AppTextVariant.body,
    this.color,
    this.maxLines,
    this.textAlign,
    this.italic = false,
    this.fontSize,
  });

  final String text;
  final AppTextVariant variant;
  final Color? color;
  final int? maxLines;
  final TextAlign? textAlign;
  final bool italic;
  final double? fontSize;

  TextStyle _style() {
    switch (variant) {
      case AppTextVariant.wordmark:
        return AppFonts.serif(
          size: fontSize ?? 15,
          weight: FontWeight.w500,
          color: color ?? AppColors.ink,
          height: 1.1,
          letterSpacing: -0.15,
        );
      case AppTextVariant.display:
        return AppFonts.serif(
          size: fontSize ?? 34,
          weight: FontWeight.w500,
          color: color ?? AppColors.ink,
          height: 1.05,
          letterSpacing: 4.8,
        );
      case AppTextVariant.read:
        return AppFonts.serif(
          size: fontSize ?? 13.5,
          color: color ?? AppColors.ink,
          height: 1.55,
          style: italic ? FontStyle.italic : FontStyle.normal,
        );
      case AppTextVariant.body:
        return AppFonts.sans(
          size: fontSize ?? 13,
          color: color ?? AppColors.ink2,
          height: 1.5,
        );
      case AppTextVariant.meta:
        return AppFonts.sans(
          size: fontSize ?? 10,
          color: color ?? AppColors.ink3,
          height: 1.1,
          letterSpacing: 0.5,
        );
      case AppTextVariant.overline:
        return AppFonts.sans(
          size: fontSize ?? 10,
          weight: FontWeight.w600,
          color: color ?? AppColors.ink3,
          height: 1.1,
          letterSpacing: 2,
        );
      case AppTextVariant.mono:
        return AppFonts.mono(
          size: fontSize ?? 11.5,
          color: color ?? AppColors.ink2,
          height: 1.5,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final display = variant == AppTextVariant.overline ? text.toUpperCase() : text;
    return Text(
      display,
      style: _style(),
      maxLines: maxLines,
      textAlign: textAlign,
      overflow: maxLines != null ? TextOverflow.ellipsis : null,
    );
  }
}
