import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../data/api_client.dart';
import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_logo.dart';
import '../ui/app_pairing_code.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Pairing — the single deliberate moment in the whole product. Enter the
/// 6-digit code shown on the Mac, which is redeemed against the backend.
class PairScreen extends StatefulWidget {
  const PairScreen({super.key});

  @override
  State<PairScreen> createState() => _PairScreenState();
}

class _PairScreenState extends State<PairScreen> {
  String _code = '';
  bool _busy = false;
  String? _error;

  Future<void> _pair() async {
    if (_code.length != 6 || _busy) return;
    FocusScope.of(context).unfocus();
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await AppScope.of(context).pair(_code);
      if (mounted) context.go('/');
    } on ApiException catch (e) {
      if (mounted) {
        setState(() {
          _busy = false;
          _error = e.code == 'not_found'
              ? 'That code didn’t work. Check the six digits on your Mac.'
              : e.code == 'conflict'
                  ? 'That Mac is already paired to a phone.'
                  : e.message;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _busy = false;
          _error = 'Couldn’t reach your Mac. Is the backend running?';
        });
      }
    }
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
            if (_error != null) ...[
              const SizedBox(height: 16),
              AppText(_error!,
                  variant: AppTextVariant.body,
                  color: AppColors.warn,
                  textAlign: TextAlign.center),
            ],
            const SizedBox(height: 34),
            AppButton(_busy ? 'Pairing…' : 'Pair this phone',
                variant: AppButtonVariant.box, onPressed: complete && !_busy ? _pair : null),
          ],
        ),
      ),
    );
  }
}
