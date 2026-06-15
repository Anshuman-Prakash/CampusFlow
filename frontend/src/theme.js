import { createTheme } from '@mui/material/styles';

// Cabanana Atelier Design Tokens
const tokens = {
  // Typography
  font: {
    family: {
      primary: 'Montserrat',
      stack: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    size: {
      xs: '14px',
      sm: '20px',
      md: '24px',
      lg: '28px',
      xl: '40px',
    },
    weight: {
      base: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      base: '20px',
      relaxed: 1.5,
    },
  },
  // Colors
  color: {
    text: {
      primary: '#333333',
      secondary: '#0000ee',
    },
    surface: {
      muted: '#ffffff',
      base: '#000000',
      raised: '#f4f4f4',
    },
    border: {
      muted: '#333333',
    },
  },
  // Spacing (scaled appropriately)
  space: {
    1: '4px',   // ~2.8px
    2: '8px',   // ~7px
    3: '12px',  // ~8-9px
    4: '16px',  // ~10px
    5: '20px',  // ~12-15px
    6: '24px',
    7: '28px',
    8: '32px',
  },
  // Radius
  radius: {
    xs: '8px',
    sm: '12px',
    md: '20px',
  },
  // Motion
  motion: {
    duration: {
      instant: '100ms',
    },
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8b9aff',
      dark: '#5a67d8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#9b6cc9',
      dark: '#5f3a82',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f4f4f4',
    },
    text: {
      primary: tokens.color.text.primary,
      secondary: tokens.color.text.secondary,
    },
    divider: 'rgba(51, 51, 51, 0.12)',
  },
  typography: {
    fontFamily: tokens.font.family.stack,
    fontSize: 14,
    fontWeightRegular: tokens.font.weight.base,
    fontWeightMedium: tokens.font.weight.medium,
    fontWeightBold: tokens.font.weight.bold,
    h1: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.xl,
      fontWeight: tokens.font.weight.bold,
      lineHeight: 1.2,
      color: tokens.color.text.primary,
    },
    h2: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.lg,
      fontWeight: tokens.font.weight.bold,
      lineHeight: 1.3,
      color: tokens.color.text.primary,
    },
    h3: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.md,
      fontWeight: tokens.font.weight.semibold,
      lineHeight: 1.4,
      color: tokens.color.text.primary,
    },
    h4: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.sm,
      fontWeight: tokens.font.weight.semibold,
      lineHeight: 1.4,
      color: tokens.color.text.primary,
    },
    h5: {
      fontFamily: tokens.font.family.stack,
      fontSize: '16px',
      fontWeight: tokens.font.weight.semibold,
      lineHeight: 1.5,
      color: tokens.color.text.primary,
    },
    h6: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.xs,
      fontWeight: tokens.font.weight.semibold,
      lineHeight: 1.5,
      color: tokens.color.text.primary,
    },
    body1: {
      fontFamily: tokens.font.family.stack,
      fontSize: tokens.font.size.xs,
      fontWeight: tokens.font.weight.base,
      lineHeight: tokens.font.lineHeight.base,
      color: tokens.color.text.primary,
    },
    body2: {
      fontFamily: tokens.font.family.stack,
      fontSize: '12px',
      fontWeight: tokens.font.weight.base,
      lineHeight: tokens.font.lineHeight.relaxed,
      color: tokens.color.text.primary,
    },
    caption: {
      fontFamily: tokens.font.family.stack,
      fontSize: '12px',
      fontWeight: tokens.font.weight.base,
      lineHeight: tokens.font.lineHeight.relaxed,
      color: '#666666',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 4,
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 10px 20px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 10px 20px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
    '0px 6px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 16px rgba(0, 0, 0, 0.08)',
    '0px 10px 20px rgba(0, 0, 0, 0.08)',
    '0px 12px 24px rgba(0, 0, 0, 0.08)',
    '0px 1px 2px rgba(0, 0, 0, 0.08)',
    '0px 2px 4px rgba(0, 0, 0, 0.08)',
    '0px 4px 8px rgba(0, 0, 0, 0.08)',
  ],
  transitions: {
    duration: {
      shortest: 100,
      shorter: 150,
      short: 200,
      standard: 250,
      complex: 300,
      enteringScreen: 200,
      leavingScreen: 150,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          color: tokens.color.text.primary,
        },
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f4f4f4',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cccccc',
            borderRadius: '4px',
            '&:hover': {
              background: '#999999',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: tokens.font.weight.semibold,
          borderRadius: tokens.radius.xs,
          padding: '10px 20px',
          fontSize: tokens.font.size.xs,
          transition: `all ${tokens.motion.duration.instant} ease`,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-1px)',
          },
          '&:focus-visible': {
            outline: '2px solid #0000ee',
            outlineOffset: '2px',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b3f94 100%)',
          },
        },
        outlined: {
          borderColor: '#333333',
          color: '#333333',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        text: {
          color: '#0000ee',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 238, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
          backgroundColor: '#ffffff',
          border: '1px solid rgba(51, 51, 51, 0.12)',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
          transition: `all ${tokens.motion.duration.instant} ease`,
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.xs,
          backgroundColor: '#ffffff',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#333333',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(51, 51, 51, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.xs,
          fontWeight: tokens.font.weight.medium,
          fontSize: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.radius.xs,
            backgroundColor: '#f4f4f4',
            '& fieldset': {
              borderColor: 'rgba(51, 51, 51, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#333333',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0000ee',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #0000ee',
            outlineOffset: '-2px',
          },
        },
      },
    },
  },
});

export default theme;
