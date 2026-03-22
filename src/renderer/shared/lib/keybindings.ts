/**
 * IntelliJ IDEA 스타일 키바인딩 맵
 * macOS: Cmd 기반, Windows/Linux: Ctrl 기반
 */

export interface Keybinding {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: string;
  label: string;
}

const isMac = navigator.platform.toUpperCase().includes('MAC');

// IntelliJ 키맵 정의
export const KEYBINDINGS: Keybinding[] = [
  // 파일 관련
  { key: 'o', ctrl: !isMac, meta: isMac, action: 'file.open', label: 'Open File' },
  { key: 's', ctrl: !isMac, meta: isMac, action: 'file.save', label: 'Save File' },
  { key: 'w', ctrl: !isMac, meta: isMac, action: 'tab.close', label: 'Close Tab' },

  // 탭 이동 (IntelliJ: Alt+Left/Right)
  { key: 'ArrowLeft', alt: true, action: 'tab.prev', label: 'Previous Tab' },
  { key: 'ArrowRight', alt: true, action: 'tab.next', label: 'Next Tab' },

  // 터미널 (IntelliJ: Alt+F12)
  { key: 'F12', alt: true, action: 'terminal.toggle', label: 'Toggle Terminal' },

  // 새 터미널 (IntelliJ: Ctrl+Shift+T, 맥에서는 Cmd+Shift+T가 탭 복원이므로 그대로 사용)
  // 실제 IntelliJ에서는 로컬 터미널 탭 추가
  { key: 't', ctrl: true, shift: true, action: 'terminal.new', label: 'New Terminal' },

  // 터미널 분할
  // IntelliJ 스타일: 에디터 분할과 유사
  { key: 'Enter', ctrl: !isMac, meta: isMac, shift: true, action: 'terminal.splitHorizontal', label: 'Split Terminal Horizontally' },
  { key: '\\', ctrl: !isMac, meta: isMac, shift: true, action: 'terminal.splitVertical', label: 'Split Terminal Vertically' },

  // 터미널 닫기
  { key: 'F4', ctrl: true, action: 'terminal.close', label: 'Close Terminal' },

  // 패널 전환 (IntelliJ: Alt+1 ~ Alt+9 도구창)
  { key: '1', alt: true, action: 'panel.editor', label: 'Show Editor' },
  { key: '2', alt: true, action: 'panel.browser', label: 'Show Browser' },

  // 에디터 탭 전환 (IntelliJ: Ctrl+Tab)
  { key: 'Tab', ctrl: true, action: 'tab.switcher', label: 'Tab Switcher' },

  // 에디터 네비게이션 (IntelliJ: Ctrl+Shift+F — 전체 검색, 여기서는 포커스 전환 용도)
  { key: 'Escape', action: 'focus.editor', label: 'Focus Editor' },

  // 전체화면 토글 (IntelliJ: Ctrl+Shift+F12)
  { key: 'F12', ctrl: !isMac, meta: isMac, shift: true, action: 'panel.maximizeTerminal', label: 'Maximize Terminal' },

  // 파일 탭 전환 (IntelliJ: Ctrl+Shift+[ / ])
  { key: '[', ctrl: !isMac, meta: isMac, shift: true, action: 'tab.prev', label: 'Previous Tab' },
  { key: ']', ctrl: !isMac, meta: isMac, shift: true, action: 'tab.next', label: 'Next Tab' },

  // 설정 (IntelliJ: Ctrl+Alt+S)
  { key: 's', ctrl: !isMac, meta: isMac, alt: true, action: 'settings.open', label: 'Open Settings' },

  // Run (IntelliJ: Shift+F10)
  { key: 'F10', shift: true, action: 'terminal.run', label: 'Run' },

  // Debug (IntelliJ: Shift+F9)
  { key: 'F9', shift: true, action: 'terminal.debug', label: 'Debug' },
];

/** Special keys that can work without any modifier */
const SPECIAL_KEYS = new Set([
  'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Enter', 'Tab', 'Backspace', 'Delete', 'Insert', 'Home', 'End', 'PageUp', 'PageDown',
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
]);

export function matchKeybinding(e: KeyboardEvent): Keybinding | null {
  for (const kb of KEYBINDINGS) {
    const keyMatch = e.key === kb.key || e.key.toLowerCase() === kb.key.toLowerCase();
    if (!keyMatch) continue;

    const wantCtrl = kb.ctrl ?? false;
    const wantMeta = kb.meta ?? false;
    const wantShift = kb.shift ?? false;
    const wantAlt = kb.alt ?? false;

    // Check: if the keybinding requires ctrl or meta, the user must press it
    // Conversely, if the user pressed ctrl/meta but the binding doesn't want it, skip
    if (isMac) {
      if (wantMeta !== e.metaKey) continue;
      // On Mac, ctrl key should not be pressed unless binding explicitly wants ctrl
      if (e.ctrlKey && !wantCtrl) continue;
    } else {
      if (wantCtrl !== e.ctrlKey) continue;
      // On non-Mac, meta key should not be pressed unless binding explicitly wants meta
      if (e.metaKey && !wantMeta) continue;
    }

    if (wantShift !== e.shiftKey) continue;
    if (wantAlt !== e.altKey) continue;

    // Skip single-character key bindings that require modifiers but none are pressed
    // This allows normal typing to work
    const hasModifier = wantCtrl || wantMeta || wantShift || wantAlt;
    const isSpecialKey = SPECIAL_KEYS.has(kb.key);
    if (!hasModifier && !isSpecialKey) {
      // A binding for a regular key with no modifiers would block typing — skip it
      continue;
    }

    return kb;
  }
  return null;
}
