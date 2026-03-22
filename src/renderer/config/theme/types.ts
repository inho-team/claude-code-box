export interface ThemeTokens {
  colors: {
    // Surface hierarchy
    surface: string;
    surfaceContainer: string;
    surfaceContainerLow: string;
    surfaceContainerLowest: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceBright: string;
    surfaceVariant: string;

    // Brand
    primaryContainer: string;
    primary: string;
    primaryFixedDim: string;
    primaryFixed: string;

    // Text
    onSurface: string;
    onSurfaceVariant: string;
    onPrimaryContainer: string;

    // Functional
    outlineVariant: string;
    outline: string;
    error: string;
    errorContainer: string;
    secondary: string;
    tertiary: string;

    // Syntax highlighting
    syntaxKeyword: string;
    syntaxString: string;
    syntaxComment: string;
    syntaxFunction: string;
    syntaxType: string;
  };
}
