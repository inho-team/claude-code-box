import { create } from 'zustand';
import {
  type SplitNode,
  createLeaf,
  splitLeaf,
  removeLeaf,
  collectLeafIds,
} from './split-tree';

interface TerminalState {
  terminalIds: string[];
  activeTerminalId: string | null;
  splitRoot: SplitNode;
  nextIdCounter: number;

  addTerminal: () => string;
  removeTerminal: (id: string) => void;
  setActiveTerminal: (id: string) => void;
  splitTerminal: (targetId: string, direction: 'horizontal' | 'vertical') => string;
  setSplitRoot: (root: SplitNode) => void;
}

function generateId(counter: number): string {
  return `term-${counter}`;
}

export const useTerminalStore = create<TerminalState>((set, get) => {
  const initialId = generateId(1);

  return {
    terminalIds: [initialId],
    activeTerminalId: initialId,
    splitRoot: createLeaf(initialId),
    nextIdCounter: 2,

    addTerminal: () => {
      const state = get();
      const newId = generateId(state.nextIdCounter);
      const activeId = state.activeTerminalId ?? state.terminalIds[state.terminalIds.length - 1];

      const newRoot = activeId
        ? splitLeaf(state.splitRoot, activeId, newId, 'horizontal')
        : createLeaf(newId);

      set({
        terminalIds: [...state.terminalIds, newId],
        activeTerminalId: newId,
        splitRoot: newRoot,
        nextIdCounter: state.nextIdCounter + 1,
      });

      return newId;
    },

    removeTerminal: (id: string) => {
      const state = get();
      const newRoot = removeLeaf(state.splitRoot, id);

      if (newRoot === null) {
        // Last terminal removed, create a fresh one
        const freshId = generateId(state.nextIdCounter);
        set({
          terminalIds: [freshId],
          activeTerminalId: freshId,
          splitRoot: createLeaf(freshId),
          nextIdCounter: state.nextIdCounter + 1,
        });
        return;
      }

      const remainingIds = collectLeafIds(newRoot);
      const newActive =
        state.activeTerminalId === id
          ? remainingIds[remainingIds.length - 1]
          : state.activeTerminalId;

      set({
        terminalIds: remainingIds,
        activeTerminalId: newActive,
        splitRoot: newRoot,
      });
    },

    setActiveTerminal: (id: string) => {
      set({ activeTerminalId: id });
    },

    splitTerminal: (targetId: string, direction: 'horizontal' | 'vertical') => {
      const state = get();
      const newId = generateId(state.nextIdCounter);
      const newRoot = splitLeaf(state.splitRoot, targetId, newId, direction);

      set({
        terminalIds: [...state.terminalIds, newId],
        activeTerminalId: newId,
        splitRoot: newRoot,
        nextIdCounter: state.nextIdCounter + 1,
      });

      return newId;
    },

    setSplitRoot: (root: SplitNode) => {
      set({ splitRoot: root });
    },
  };
});
