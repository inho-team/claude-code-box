import type { ThemeTokens } from './types';

export const darkTheme: ThemeTokens = {
  colors: {
    // Surface hierarchy (v2 Hyper-Terminal)
    surface: '#131313',
    surfaceContainer: '#201f1f',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainerLowest: '#0e0e0e',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerHighest: '#353534',
    surfaceBright: '#393939',
    surfaceVariant: '#353534',

    // Brand
    primaryContainer: '#0099ff',
    primary: '#9fcaff',
    primaryFixedDim: '#9fcaff',
    primaryFixed: '#d2e4ff',

    // Text
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#bfc7d5',
    onPrimaryContainer: '#002f54',

    // Functional
    outlineVariant: '#3f4753',
    outline: '#89919e',
    error: '#ffb4ab',
    errorContainer: '#93000a',
    secondary: '#d3c878',
    tertiary: '#b3c8e7',

    // Syntax highlighting
    syntaxKeyword: '#9fcaff',
    syntaxString: '#d3c878',
    syntaxComment: '#6F839F',
    syntaxFunction: '#b3c8e7',
    syntaxType: '#0099ff',
  },
};
