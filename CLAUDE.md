# CLAUDE.md — claude-code-box

## 프로젝트 개요
**claude-code-box** — Claude Code CLI를 쉽게 사용할 수 있는 가벼운 크로스플랫폼 데스크톱 GUI 프로그램.

좌측에 코드 에디터(Monaco) 또는 크롬(WebView), 우측에 터미널을 배치하고, 터미널을 분할하여 Claude Code를 효율적으로 사용할 수 있는 환경을 제공한다.

## 기술 스택
- **Electron** + **React 19** + **TypeScript**
- **electron-vite**: 빌드 도구
- **Monaco Editor**: 코드 편집기
- **xterm.js** + **node-pty**: 터미널 에뮬레이터
- **Zustand**: 상태 관리
- **FSD (Feature-Sliced Design)** 아키텍처

## 프로젝트 구조
```
src/
  main/           # Electron main process
  preload/        # Preload scripts
  renderer/       # React renderer (FSD)
    app/          # App entry, providers, global styles
    config/       # Theme, constants
    entities/     # panel, terminal, editor 도메인 엔티티
    features/     # terminal-split, editor-switch, panel-resize
    widgets/      # left-panel, right-panel, toolbar
    shared/       # hooks, lib, ui, styles, types
```

## 핵심 기능
- 좌측 패널: Monaco Editor / WebView(크롬) 전환
- 우측 패널: xterm.js 터미널 (node-pty 바인딩)
- 터미널 분할: 수평/수직 분할, 탭, 포커스 전환
- 패널 리사이즈: 드래그로 좌우 비율 조절
- 다크 모드 기본 테마

## 대상 플랫폼
- Windows, Linux, macOS

## Task Log
`.qe/TASK_LOG.md` 참조

## QE 규칙
`QE_CONVENTIONS.md` 참조
