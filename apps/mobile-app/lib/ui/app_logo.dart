import 'package:flutter/widgets.dart';

import '../theme/tokens.dart';

/// AppLogo / AppIcon — ported from packages/ui app-logo.tsx. The brand mark is a
/// "stack" glyph: three stacked rounded bars. The Android app icon is
/// ink-on-paper, ringed in moss.
class _StackGlyph extends StatelessWidget {
  const _StackGlyph({required this.size, required this.barColor});
  final double size;
  final Color barColor;

  @override
  Widget build(BuildContext context) {
    final unit = size / 24; // web glyph drawn in a 24px viewBox
    Widget bar(double top, double left, double w, double h) => Positioned(
          top: top * unit,
          left: left * unit,
          child: Container(
            width: w * unit,
            height: h * unit,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(1.2 * unit),
              border: Border.all(color: barColor, width: 1.6 * unit),
            ),
          ),
        );
    return SizedBox(
      width: size,
      height: size,
      child: Stack(children: [bar(5, 4, 16, 4), bar(11, 4, 16, 4), bar(17, 6, 12, 3)]),
    );
  }
}

class AppLogo extends StatelessWidget {
  const AppLogo({super.key, this.size = 24});
  final double size;

  @override
  Widget build(BuildContext context) => _StackGlyph(size: size, barColor: AppColors.ink);
}

class AppIcon extends StatelessWidget {
  const AppIcon({super.key, this.size = 52});
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.ink,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.moss, width: 2),
      ),
      child: _StackGlyph(size: (size / 2).roundToDouble(), barColor: AppColors.paper),
    );
  }
}
