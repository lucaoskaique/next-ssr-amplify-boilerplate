/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-surface':
          'linear-gradient(180deg, #F2F5FB 35.9%, #D3DAF1 107.05%)',
        panel:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 100%)',
        panelHeader:
          'linear-gradient(180deg, #FAFCFD 89.5%, rgba(249, 252, 253, 0) 100%)',
        login: "url('/kid.jpg')",
        error: "url('/error-bg.jpg')",
      },
      spacing: {
        conversation: '105px',
        response: '65px',
        conversationAndResponse: '170px',
        mobilePanelCorners: '137px',
        desktopPanelCorners: '97px',
        mobilePanelHeader: '161px',
        desktopPanelHeader: '121px',
        popover: '220px',
      },
      width: {
        preview: '163px',
      },
      height: {
        preview: '106px',
      },
      keyframes: {
        slideUp: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideDown: {
          '0%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '90%': {
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
      },
      animation: {
        slideUp: 'slideUp 0.2s ease-in-out forwards',
        slideDown: 'slideDown 0.2s ease-in-out forwards',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          '25': '#E8F8FF',
          '50': '#DBF4FF',
          '100': '#ADDEFF',
          '300': '#7CC6FF',
          '400': '#1A98FF',
          '500': '#008CFF',
          '600': '#0062B4',
          button: {
            DEFAULT: '#0062B4',
            hover: '#007BE3',
            active: '#0056A0',
            text: {
              DEFAULT: '#1D1D1D',
              hover: '#1D1D1D',
            },
          },
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          button: {
            DEFAULT: '#212739',
            hover: '#E8F8FF',
            active: '#1D1D1D',
            text: {
              DEFAULT: '#FFFFFF',
              hover: '#FFFFFF',
            },
          },
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        active: '#5A23A0',
        dashboard: {
          background: '#F0F7F9',
          secondary: '#1D1D1DBF',
          primary: '#1D1D1D',
          panelHeader: '#FAFCFD',
        },
        text: {
          primary: '#34405F',
          secondary: '#5A698D',
          accent: '#93A6D3',
          disabled: '#00000059',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        white: '#FFFFFF',
        modal: 'rgba(0, 0, 0, 0.35)',
        icon: '#1F89EB',
        blur: '#E8F8FFF0',
        conversation: {
          bot: '#212739',
        },
        message: {
          error: {
            icon: '#DA4545',
            text: '#DA4545',
            background: '#FBECEC',
          },
          success: {
            icon: '#08883B',
            text: '#08883B',
          },
          info: {
            icon: '#1F89EB',
            text: '#1F89EB',
          },
        },
        lighten: {
          '50': '#FFFFFF05',
          '100': '#FFFFFF0A',
          '200': '#FFFFFF11',
          '300': '#FFFFFF3F',
          '400': '#FFFFFFB7',
          '500': '#FFFFFFD',
        },
        green: {
          '50': '#E7F9EE',
          '100': '#9BE6B9',
          '200': '#72DC9C',
          '300': '#35CC72',
          '400': '#0CC255',
          '500': '#08883B',
          '600': '#077634',
        },
        violet: {
          '50': '#EFE9F6',
          '100': '#B89DE4',
          '200': '#8A67D4',
          '300': '#704CBD',
          '400': '#5A23A0',
          '500': '#3F1970',
          '600': '#371562',
        },
        rose: {
          '50': '#F6EAED',
          '100': '#E89AC0',
          '200': '#D46795',
          '300': '#BD4C75',
          '400': '#A72A4F',
          '500': '#751D37',
          '600': '#661A30',
        },
        aqua: {
          '50': '#E4F3FB',
          '100': '#A4D7F3',
          '200': '#65BEE4',
          '300': '#3B83B8',
          '400': '#094277',
          '500': '#062E53',
          '600': '#052849',
        },
        blue: {
          '50': '#BFE0FF',
          '100': '#92CAFF',
          '200': '#59AFFF',
          '300': '#1F89EB',
          '400': '#005EB5',
          '500': '#00427F',
          '600': '#00396E',
        },
        neutral: {
          '50': '#FFFFFF',
          '100': '#EBEFF9',
          '200': '#93A6D3',
          '300': '#5A698D',
          '400': '#34405F',
          '500': '#262D41',
          '600': '#212739',
        },
        darken: {
          '50': '#00000005',
          '100': '#0000000A',
          '200': '#00000011',
          '300': '#00000059',
          '400': '#000000B7',
          '500': '#000000D1',
        },
        red: {
          '50': '#FBECEC',
          '100': '#F0B3B3',
          '200': '#EA9393',
          '300': '#E06565',
          '400': '#DA4545',
          '500': '#993030',
          '600': '#852A2A',
        },
        purple: {
          '50': '#F2F5FB',
          '100': '#E7ECF8',
          '200': '#CFD8F1',
          '300': '#B8C3E9',
          '400': '#9BA5DE',
          '500': '#8288D2',
          '600': '#6869C3',
        },
        yellow: {
          '50': '#FEFCE8',
          '100': '#FEF9C3',
          '400': '#FACC15',
          '600': '#CA8A04',
        },
      },
    },
    icon: {
      size: {
        lg: 32,
      },
      color: {
        high_emphasis: '#00396E',
        low_emphasis: '#5A698D',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar')],
};
export default config;
