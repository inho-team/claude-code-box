import { ErrorBoundary } from '@shared/ui/ErrorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Toolbar } from '@widgets/toolbar/ui/Toolbar';
import { SideNavBar } from '@widgets/sidebar/ui/SideNavBar';
import { LeftPanel } from '@widgets/left-panel/ui/LeftPanel';
import { RightPanel } from '@widgets/right-panel/ui/RightPanel';
import { PanelResizer } from '@features/panel-resize/ui/PanelResizer';
import { StatusBar } from '@widgets/status-bar/ui/StatusBar';
import { usePanelStore } from '@entities/panel/model/panel-store';
import { useKeybindings } from '@shared/hooks/use-keybindings';
import '@shared/styles/reset.css';
import '@shared/styles/global.css';

function AmbientGlow(): React.JSX.Element {
  return (
    <>
      {/* Top-right ambient glow */}
      <div
        style={{
          position: 'fixed',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(0, 153, 255, 0.1)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.2,
        }}
      />
      {/* Bottom-left ambient glow */}
      <div
        style={{
          position: 'fixed',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(37, 99, 235, 0.05)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.2,
        }}
      />
    </>
  );
}

function MainLayout(): React.JSX.Element {
  const leftPanelRatio = usePanelStore((s) => s.leftPanelRatio);
  useKeybindings();

  return (
    <div className="app-layout">
      <AmbientGlow />
      <Toolbar />
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <SideNavBar />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <div style={{ width: `${leftPanelRatio * 100}%`, overflow: 'hidden' }}>
            <LeftPanel />
          </div>
          <PanelResizer />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <RightPanel />
          </div>
        </div>
      </div>
      <StatusBar />
    </div>
  );
}

export function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <MainLayout />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
