export { useTerminalStore } from './model/terminal-store';
export {
  type SplitNode,
  type LeafNode,
  type BranchNode,
  createLeaf,
  splitLeaf,
  removeLeaf,
  updateRatio,
  collectLeafIds,
} from './model/split-tree';
export { TerminalView } from './ui/TerminalView';
