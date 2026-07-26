/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'rgb(var(--sidebar) / <alpha-value>)',
          hover: 'rgb(var(--sidebar-hover) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
      },
      fontSize: {
        'badge': '0.75rem',       // 12px
        'caption': '0.8125rem',   // 13px
        'button': '0.875rem',     // 14px
        'body': '0.9375rem',      // 15px (between 15-16)
        'card-title': '1.125rem', // 18px
        'section': '1.5rem',      // 24px
        'page': '2rem',           // 32px
        'display': '3rem',        // 48px
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'level-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionDuration: {
        'hover': '150ms',
        'button': '180ms',
        'card': '200ms',
        'dialog': '250ms',
        'page': '300ms',
        'dropdown': '180ms',
      }
    }
  },
  plugins: []
};
