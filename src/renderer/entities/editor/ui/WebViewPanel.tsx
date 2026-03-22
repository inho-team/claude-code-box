import { useState, useRef, useCallback } from 'react';

const DEFAULT_URL = 'https://www.google.com';

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  background: 'none',
  border: '1px solid #3e3e42',
  borderRadius: 4,
  color: '#cccccc',
  fontSize: 14,
  cursor: 'pointer',
  flexShrink: 0,
};

export function WebViewPanel(): React.JSX.Element {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [inputValue, setInputValue] = useState(DEFAULT_URL);
  const webviewRef = useRef<Electron.WebviewTag | null>(null);

  const navigate = useCallback(
    (targetUrl?: string) => {
      const finalUrl = targetUrl ?? inputValue;
      let normalized = finalUrl.trim();
      if (normalized && !normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = 'https://' + normalized;
      }
      setUrl(normalized);
      setInputValue(normalized);
    },
    [inputValue],
  );

  const goBack = useCallback(() => {
    webviewRef.current?.goBack();
  }, []);

  const goForward = useCallback(() => {
    webviewRef.current?.goForward();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        navigate();
      }
    },
    [navigate],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      {/* Navigation bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          height: 36,
          flexShrink: 0,
          padding: '0 6px',
          backgroundColor: '#252526',
          borderBottom: '1px solid #3e3e42',
        }}
      >
        <button
          onClick={goBack}
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#3e3e42';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
          title="Go Back"
        >
          &#8592;
        </button>
        <button
          onClick={goForward}
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#3e3e42';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
          title="Go Forward"
        >
          &#8594;
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            height: 26,
            padding: '0 8px',
            backgroundColor: '#3c3c3c',
            border: '1px solid #3e3e42',
            borderRadius: 4,
            color: '#cccccc',
            fontSize: 12,
            outline: 'none',
          }}
          placeholder="Enter URL..."
        />
        <button
          onClick={() => navigate()}
          style={buttonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#3e3e42';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          }}
          title="Go"
        >
          &#8594;
        </button>
      </div>

      {/* WebView */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <webview
          ref={webviewRef as React.Ref<Electron.WebviewTag>}
          src={url}
          style={{ width: '100%', height: '100%' }}
          allowpopups={'true' as unknown as boolean}
        />
      </div>
    </div>
  );
}
