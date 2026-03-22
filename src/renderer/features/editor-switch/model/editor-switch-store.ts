// Re-export panel store for editor/webview switching.
// The panelStore already manages leftPanelType: 'editor' | 'webview',
// so we reuse it rather than duplicating state.
export { usePanelStore, type PanelType } from '@entities/panel';
