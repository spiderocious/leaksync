import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/tokens.dart';
import 'app_text.dart';

/// AppPairingCodeEntry — ported from packages/ui app-pairing-code.tsx (Entry).
/// The one number the product hinges on; the phone ENTERS it once. A hidden
/// numeric field captures keystrokes; the six cells are the rendered
/// presentation. Tapping anywhere focuses the field and raises the keypad.
class AppPairingCodeEntry extends StatefulWidget {
  const AppPairingCodeEntry({
    super.key,
    this.length = 6,
    this.onChanged,
    this.onCompleted,
    this.autofocus = false,
  });

  final int length;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onCompleted;
  final bool autofocus;

  @override
  State<AppPairingCodeEntry> createState() => _AppPairingCodeEntryState();
}

class _AppPairingCodeEntryState extends State<AppPairingCodeEntry> {
  final _controller = TextEditingController();
  final _focus = FocusNode();
  String _value = '';

  @override
  void initState() {
    super.initState();
    _controller.addListener(() {
      final next = _controller.text.replaceAll(RegExp(r'\D'), '');
      if (next.length > widget.length) {
        _controller.text = next.substring(0, widget.length);
        return;
      }
      if (next != _value) {
        setState(() => _value = next);
        widget.onChanged?.call(next);
        if (next.length == widget.length) widget.onCompleted?.call(next);
      }
    });
    _focus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _controller.dispose();
    _focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final activeIndex = _value.length.clamp(0, widget.length - 1);

    return Stack(
      children: [
        // The hidden, focusable numeric field.
        Positioned(
          width: 1,
          height: 1,
          child: TextField(
            controller: _controller,
            focusNode: _focus,
            autofocus: widget.autofocus,
            keyboardType: TextInputType.number,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(widget.length),
            ],
            showCursor: false,
            style: const TextStyle(color: Colors.transparent, height: 0.01),
            decoration: const InputDecoration(border: InputBorder.none, counterText: ''),
          ),
        ),
        GestureDetector(
          onTap: () => _focus.requestFocus(),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(widget.length, (i) {
              final filled = i < _value.length;
              final isActive = _focus.hasFocus && i == activeIndex && _value.length < widget.length;
              return Container(
                width: 44,
                height: 58,
                margin: EdgeInsets.only(right: i == widget.length - 1 ? 0 : 10),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.sheet,
                  borderRadius: BorderRadius.circular(AppRadius.card),
                  border: Border(
                    top: const BorderSide(color: AppColors.hair),
                    left: const BorderSide(color: AppColors.hair),
                    right: const BorderSide(color: AppColors.hair),
                    bottom: BorderSide(
                      color: isActive
                          ? AppColors.moss
                          : (filled ? AppColors.ink : AppColors.ink3),
                      width: isActive ? 2 : 1.5,
                    ),
                  ),
                ),
                child: AppText(
                  filled ? _value[i] : '—',
                  variant: AppTextVariant.display,
                  fontSize: 30,
                  color: filled ? AppColors.ink : AppColors.ink4,
                ),
              );
            }),
          ),
        ),
      ],
    );
  }
}
