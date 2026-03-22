import { useCallback, useRef, useState } from 'react';

interface SplitDividerProps {
  direction: 'horizontal' | 'vertical';
  onRatioChange: (ratio: number) => void;
}

export function SplitDivider({ direction, onRatioChange }: SplitDividerProps): React.JSX.Element {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const divider = dividerRef.current;
      if (!divider) return;

      const parent = divider.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();

      const onMouseMove = (moveEvent: MouseEvent) => {
        let ratio: number;
        if (direction === 'vertical') {
          ratio = (moveEvent.clientX - parentRect.left) / parentRect.width;
        } else {
          ratio = (moveEvent.clientY - parentRect.top) / parentRect.height;
        }
        ratio = Math.max(0.1, Math.min(0.9, ratio));
        onRatioChange(ratio);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = direction === 'vertical' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [direction, onRatioChange],
  );

  const isVertical = direction === 'vertical';

  return (
    <div
      ref={dividerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: isVertical ? 1 : '100%',
        height: isVertical ? '100%' : 1,
        backgroundColor: hovered ? 'rgba(0, 153, 255, 0.4)' : '#27272a',
        cursor: isVertical ? 'col-resize' : 'row-resize',
        transition: 'background-color 0.15s',
      }}
    />
  );
}
