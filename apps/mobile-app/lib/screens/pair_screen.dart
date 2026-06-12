import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_logo.dart';
import '../ui/app_pairing_code.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Pairing — the single deliberate moment in the whole product. Enter the
/// 6-digit code shown on the Mac. No accounts, no passwords. (No API yet — any
/// complete 6-digit code "pairs" locally.)
class PairScreen extends StatefulWidget {
  const PairScreen({super.key});

  @override
  State<PairScreen> createState() => _PairScreenState();
}

class _PairScreenState extends State<PairScreen> {
  String _code = '';

  void _pair() {
    if (_code.length != 6) return;
    FocusScope.of(context).unfocus();
    AppScope.of(context).pair(_code);
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);
    final complete = _code.length == 6;

    return ScreenScaffold(
      center: true,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 360),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AppIcon(size: 56),
            const SizedBox(height: 22),
            const AppText('LeakSync', variant: AppTextVariant.display, fontSize: 28),
            const SizedBox(height: 12),
            AppText(
              'Welcome${state.userName.isNotEmpty ? ', ${state.userName}' : ''}. Open LeakSync on your Mac and enter the six digits it shows you.',
              variant: AppTextVariant.read,
              color: AppColors.ink2,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 34),
            const AppText('Pairing code', variant: AppTextVariant.overline),
            const SizedBox(height: 14),
            AppPairingCodeEntry(
              autofocus: true,
              onChanged: (v) => setState(() => _code = v),
              onCompleted: (_) => _pair(),
            ),
            const SizedBox(height: 34),
            AppButton('Pair this phone',
                variant: AppButtonVariant.box, onPressed: complete ? _pair : null),
          ],
        ),
      ),
    );
  }
}
