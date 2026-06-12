import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../theme/tokens.dart';
import '../ui/app_status_dot.dart';
import '../ui/app_text.dart';

/// Share confirmation — the 95% case, and the whole point of the product. The
/// user tapped "LeakSync" in another app's share sheet; main.dart POSTs the
/// payload to the backend and calls markResult() with the outcome. This shows
/// "Sending… → Sent to your Mac ✓" (or a failure) and dismisses.
enum _Phase { sending, sent, failed }

class ShareScreen extends StatefulWidget {
  const ShareScreen({super.key});

  // main.dart sets this once the real POST resolves.
  static final ValueNotifier<bool?> result = ValueNotifier<bool?>(null);
  static void markResult(bool ok) => result.value = ok;
  static void reset() => result.value = null;

  @override
  State<ShareScreen> createState() => _ShareScreenState();
}

class _ShareScreenState extends State<ShareScreen> {
  @override
  void initState() {
    super.initState();
    ShareScreen.reset();
    ShareScreen.result.addListener(_onResult);
  }

  void _onResult() {
    // Once we have a definite result, linger a beat then return home.
    if (ShareScreen.result.value != null) {
      Future.delayed(const Duration(milliseconds: 1300), () {
        if (mounted) context.go('/');
      });
      setState(() {});
    }
  }

  @override
  void dispose() {
    ShareScreen.result.removeListener(_onResult);
    super.dispose();
  }

  _Phase get _phase {
    final r = ShareScreen.result.value;
    if (r == null) return _Phase.sending;
    return r ? _Phase.sent : _Phase.failed;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0x2E23211C),
      body: Center(
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 40),
          padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 22),
          decoration: BoxDecoration(
            color: AppColors.sheet,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: AppColors.hair),
            boxShadow: const [
              BoxShadow(color: Color(0x3823211C), blurRadius: 28, offset: Offset(0, 18)),
            ],
          ),
          child: Column(mainAxisSize: MainAxisSize.min, children: _body()),
        ),
      ),
    );
  }

  List<Widget> _body() {
    switch (_phase) {
      case _Phase.sent:
        return const [
          AppStatusDot(status: AppStatusKind.live, size: 11),
          SizedBox(height: 14),
          AppText('Sent to your Mac', variant: AppTextVariant.read, fontSize: 18),
          SizedBox(height: 2),
          AppText('it’s already there',
              variant: AppTextVariant.read, italic: true, fontSize: 12, color: AppColors.ink3),
        ];
      case _Phase.failed:
        return const [
          AppText('Couldn’t send',
              variant: AppTextVariant.read, fontSize: 16, color: AppColors.warn),
          SizedBox(height: 4),
          AppText('Open LeakSync and try again.',
              variant: AppTextVariant.read, italic: true, fontSize: 12, color: AppColors.ink3),
        ];
      case _Phase.sending:
        return const [
          AppText('Sending…',
              variant: AppTextVariant.read, italic: true, fontSize: 13, color: AppColors.ink3),
        ];
    }
  }
}
