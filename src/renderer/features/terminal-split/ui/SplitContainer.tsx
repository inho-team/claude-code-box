import { useCallback } from 'react';
import type { SplitNode, BranchNode } from '@entities/terminal/model/split-tree';
import { TerminalView } from '@entities/terminal/ui/TerminalView';
import { useTerminalStore } from '@entities/terminal/model/terminal-store';
import { SplitDivider } from './SplitDivider';

interface SplitContainerProps {
  node: SplitNode;
}

export function SplitContainer({ node }: SplitContainerProps): React.JSX.Element {
  if (node.type === 'leaf') {
    return (
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <TerminalView terminalId={node.terminalId} />
      </div>
    );
  }

  return <BranchContainer node={node} />;
}

function BranchContainer({ node }: { node: BranchNode }): React.JSX.Element {
  const setSplitRoot = useTerminalStore((s) => s.setSplitRoot);
  const splitRoot = useTerminalStore((s) => s.splitRoot);

  const handleRatioChange = useCallback(
    (newRatio: number) => {
      const updateNode = (current: SplitNode): SplitNode => {
        if (current === node) {
          return { ...current, ratio: newRatio } as BranchNode;
        }
        if (current.type === 'branch') {
          return {
            ...current,
            first: updateNode(current.first),
            second: updateNode(current.second),
          };
        }
        return current;
      };
      setSplitRoot(updateNode(splitRoot));
    },
    [node, splitRoot, setSplitRoot],
  );

  const isVertical = node.direction === 'vertical';
  const firstSize = `${node.ratio * 100}%`;
  const secondSize = `${(1 - node.ratio) * 100}%`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: isVertical ? firstSize : '100%', height: isVertical ? '100%' : firstSize, overflow: 'hidden' }}>
        <SplitContainer node={node.first} />
      </div>
      <SplitDivider direction={node.direction} onRatioChange={handleRatioChange} />
      <div style={{ width: isVertical ? secondSize : '100%', height: isVertical ? '100%' : secondSize, overflow: 'hidden' }}>
        <SplitContainer node={node.second} />
      </div>
    </div>
  );
}
