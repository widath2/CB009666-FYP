"use client";

import { useEffect } from 'react';

interface KeyboardShortcuts {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSettings?: () => void;
  onUpload?: () => void;
  onSimplify?: () => void;
  onRestart?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check for Ctrl/Cmd + key combinations
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      switch (event.key.toLowerCase()) {
        case ' ': // Spacebar
          event.preventDefault();
          if (shortcuts.onPlay) {
            shortcuts.onPlay();
          }
          break;

        case 'p':
          if (isCtrlOrCmd) {
            event.preventDefault();
            if (shortcuts.onPause) {
              shortcuts.onPause();
            }
          }
          break;

        case 's':
          if (isCtrlOrCmd) {
            event.preventDefault();
            if (event.shiftKey && shortcuts.onStop) {
              shortcuts.onStop();
            } else if (shortcuts.onSettings) {
              shortcuts.onSettings();
            }
          }
          break;

        case 'u':
          if (isCtrlOrCmd) {
            event.preventDefault();
            if (shortcuts.onUpload) {
              shortcuts.onUpload();
            }
          }
          break;

        case 't':
          if (isCtrlOrCmd) {
            event.preventDefault();
            if (shortcuts.onSimplify) {
              shortcuts.onSimplify();
            }
          }
          break;

        case 'r':
          if (isCtrlOrCmd) {
            event.preventDefault();
            if (shortcuts.onRestart) {
              shortcuts.onRestart();
            }
          }
          break;

        case 'escape':
          if (shortcuts.onSettings) {
            shortcuts.onSettings(); // Close settings if open
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};

// Helper component to display keyboard shortcuts help
export const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: 'Space', description: 'Play/Pause reading' },
    { key: 'Ctrl + P', description: 'Pause reading' },
    { key: 'Ctrl + Shift + S', description: 'Stop reading' },
    { key: 'Ctrl + S', description: 'Open settings' },
    { key: 'Ctrl + U', description: 'Upload new file' },
    { key: 'Ctrl + T', description: 'Simplify text' },
    { key: 'Ctrl + R', description: 'Restart process' },
    { key: 'Esc', description: 'Close dialogs' },
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4 mt-4">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        ⌨️ Keyboard Shortcuts
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-600">{shortcut.description}</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono text-gray-700">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};