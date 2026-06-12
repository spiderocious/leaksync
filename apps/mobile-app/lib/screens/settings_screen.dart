import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../state/app_scope.dart';
import '../theme/tokens.dart';
import '../ui/app_button.dart';
import '../ui/app_text.dart';
import '../ui/screen_scaffold.dart';

/// Settings — the one real setting (unpair), the API-server override (so you can
/// point at a LAN IP / tunnel for a physical device), and the About link.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  Future<void> _editServer() async {
    final state = AppScope.of(context);
    final controller = TextEditingController(text: state.apiBase);
    final next = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.sheet,
        title: const AppText('Backend URL', variant: AppTextVariant.read, fontSize: 16),
        content: TextField(
          controller: controller,
          autofocus: true,
          keyboardType: TextInputType.url,
          decoration: const InputDecoration(hintText: 'http://localhost:9090/api/v1'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, controller.text.trim()),
            child: const Text('Save'),
          ),
        ],
      ),
    );
    if (next != null && next.isNotEmpty) {
      await state.setApiBase(next);
      if (mounted) setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = AppScope.of(context);

    return ScreenScaffold(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.only(top: 12, bottom: 18),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.hair))),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: () => context.pop(),
                  child: const AppText('‹ back', variant: AppTextVariant.body, color: AppColors.ink3),
                ),
                const AppText('Settings', variant: AppTextVariant.overline),
                const SizedBox(width: 40),
              ],
            ),
          ),
          _row('Paired with', state.macName.isEmpty ? '—' : state.macName),
          _row('Direction', 'Phone → Mac'),
          _row('Version', '0.1.0'),
          // Tappable server row — paste a LAN IP / tunnel URL for a real device.
          GestureDetector(
            onTap: _editServer,
            behavior: HitTestBehavior.opaque,
            child: _row('Server', state.apiBase, last: true, tappable: true),
          ),
          const SizedBox(height: 22),
          Container(
            width: double.infinity,
            alignment: Alignment.center,
            padding: const EdgeInsets.only(top: 18),
            decoration: const BoxDecoration(border: Border(top: BorderSide(color: AppColors.hair))),
            child: AppButton('About LeakSync',
                variant: AppButtonVariant.quiet, onPressed: () => context.push('/about')),
          ),
          const Spacer(),
          Center(
            child: AppButton('Unpair this device', variant: AppButtonVariant.danger, onPressed: () async {
              await state.unpair();
              if (context.mounted) context.go('/pair');
            }),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  Widget _row(String k, String v, {bool last = false, bool tappable = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: last ? Colors.transparent : AppColors.hair)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          AppText(k, variant: AppTextVariant.read, fontSize: 13.5),
          const SizedBox(width: 16),
          Expanded(
            child: AppText(
              v,
              variant: AppTextVariant.mono,
              fontSize: 11,
              color: tappable ? AppColors.moss : AppColors.ink3,
              maxLines: 1,
              textAlign: TextAlign.right,
            ),
          ),
          if (tappable) ...[
            const SizedBox(width: 6),
            const Icon(Icons.edit_outlined, size: 13, color: AppColors.moss),
          ],
        ],
      ),
    );
  }
}
