export interface LeafNode {
  type: 'leaf';
  terminalId: string;
}

export interface BranchNode {
  type: 'branch';
  direction: 'horizontal' | 'vertical';
  ratio: number;
  first: SplitNode;
  second: SplitNode;
}

export type SplitNode = LeafNode | BranchNode;

export function createLeaf(terminalId: string): LeafNode {
  return { type: 'leaf', terminalId };
}

export function splitLeaf(
  root: SplitNode,
  targetId: string,
  newTerminalId: string,
  direction: 'horizontal' | 'vertical',
): SplitNode {
  if (root.type === 'leaf') {
    if (root.terminalId === targetId) {
      return {
        type: 'branch',
        direction,
        ratio: 0.5,
        first: { type: 'leaf', terminalId: targetId },
        second: { type: 'leaf', terminalId: newTerminalId },
      };
    }
    return root;
  }

  return {
    ...root,
    first: splitLeaf(root.first, targetId, newTerminalId, direction),
    second: splitLeaf(root.second, targetId, newTerminalId, direction),
  };
}

export function removeLeaf(root: SplitNode, targetId: string): SplitNode | null {
  if (root.type === 'leaf') {
    return root.terminalId === targetId ? null : root;
  }

  const firstResult = removeLeaf(root.first, targetId);
  const secondResult = removeLeaf(root.second, targetId);

  if (firstResult === null && secondResult === null) {
    return null;
  }
  if (firstResult === null) {
    return secondResult;
  }
  if (secondResult === null) {
    return firstResult;
  }

  return { ...root, first: firstResult, second: secondResult };
}

export function updateRatio(
  root: SplitNode,
  targetFirst: SplitNode,
  newRatio: number,
): SplitNode {
  if (root.type === 'leaf') {
    return root;
  }

  if (root.first === targetFirst) {
    return { ...root, ratio: newRatio };
  }

  return {
    ...root,
    first: updateRatio(root.first, targetFirst, newRatio),
    second: updateRatio(root.second, targetFirst, newRatio),
  };
}

export function collectLeafIds(node: SplitNode): string[] {
  if (node.type === 'leaf') {
    return [node.terminalId];
  }
  return [...collectLeafIds(node.first), ...collectLeafIds(node.second)];
}
