export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  radius: string;
  // Enhanced solid background variables
  dropdownBackground: string;
  dropdownBorder: string;
  buttonHover: string;
  buttonActive: string;
}

export const themeConfig: ThemeConfig = {
  light: {
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    popover: '#ffffff',
    popoverForeground: '#0f172a',
    primary: '#f59e0b',
    primaryForeground: '#ffffff',
    secondary: '#f8fafc',
    secondaryForeground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#fef3c7',
    accentForeground: '#0f172a',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#f1f5f9',
    ring: '#f59e0b',
    radius: '0.5rem',
    dropdownBackground: '#ffffff',
    dropdownBorder: '#e2e8f0',
    buttonHover: '#f8fafc',
    buttonActive: '#f1f5f9'
  },
  dark: {
    background: '#0d1117',
    foreground: '#f0f6fc',
    card: '#161b22',
    cardForeground: '#f0f6fc',
    popover: '#161b22',
    popoverForeground: '#f0f6fc',
    primary: '#1f6feb',
    primaryForeground: '#f0f6fc',
    secondary: '#21262d',
    secondaryForeground: '#f0f6fc',
    muted: '#21262d',
    mutedForeground: '#7d8590',
    accent: '#388bfd',
    accentForeground: '#f0f6fc',
    destructive: '#f85149',
    destructiveForeground: '#f0f6fc',
    border: '#30363d',
    input: '#21262d',
    ring: '#1f6feb',
    radius: '0.5rem',
    dropdownBackground: '#161b22',
    dropdownBorder: '#30363d',
    buttonHover: '#30363d',
    buttonActive: '#21262d'
  }
};

export const getThemeColors = (mode: 'light' | 'dark'): ThemeColors => {
  return themeConfig[mode];
};

export const generateThemeCSS = (mode: 'light' | 'dark'): string => {
  const colors = getThemeColors(mode);
  const prefix = mode === 'dark' ? '.dark' : '';
  
  return `
    ${prefix} {
      --background: ${colors.background};
      --foreground: ${colors.foreground};
      --card: ${colors.card};
      --card-foreground: ${colors.cardForeground};
      --popover: ${colors.popover};
      --popover-foreground: ${colors.popoverForeground};
      --primary: ${colors.primary};
      --primary-foreground: ${colors.primaryForeground};
      --secondary: ${colors.secondary};
      --secondary-foreground: ${colors.secondaryForeground};
      --muted: ${colors.muted};
      --muted-foreground: ${colors.mutedForeground};
      --accent: ${colors.accent};
      --accent-foreground: ${colors.accentForeground};
      --destructive: ${colors.destructive};
      --destructive-foreground: ${colors.destructiveForeground};
      --border: ${colors.border};
      --input: ${colors.input};
      --ring: ${colors.ring};
      --radius: ${colors.radius};
      --dropdown-background: ${colors.dropdownBackground};
      --dropdown-border: ${colors.dropdownBorder};
      --button-hover: ${colors.buttonHover};
      --button-active: ${colors.buttonActive};
    }
  `;
};