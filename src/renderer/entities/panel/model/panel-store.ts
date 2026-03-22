import { create } from 'zustand';

export type PanelType = 'editor' | 'webview';

interface PanelState {
  leftPanelRatio: number;
  rightPanelRatio: number;
  leftPanelType: PanelType;
  setLeftPanelRatio: (ratio: number) => void;
  setLeftPanelType: (type: PanelType) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  leftPanelRatio: 0.5,
  rightPanelRatio: 0.5,
  leftPanelType: 'editor',
  setLeftPanelRatio: (ratio: number) =>
    set({ leftPanelRatio: ratio, rightPanelRatio: 1 - ratio }),
  setLeftPanelType: (type: PanelType) => set({ leftPanelType: type }),
}));
