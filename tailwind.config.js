/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      // Cosmic Legends Color Palette
      colors: {
        // Primary cosmic colors
        cosmic: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // MultiversX inspired colors
        mvx: {
          primary: '#1B46C2',
          secondary: '#23D0FF',
          accent: '#F7931E',
          dark: '#0F0F23',
        },
        // AI/Tech colors
        ai: {
          primary: '#00ff88',
          secondary: '#ff0080',
          glow: '#00ffff',
          dark: '#0a0a0a',
        },
        // Game status colors
        game: {
          legendary: '#FFD700',
          epic: '#9D4EDD',
          rare: '#3B82F6',
          common: '#6B7280',
          damage: '#EF4444',
          heal: '#10B981',
          mana: '#3B82F6',
        },
        // Custom semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      
      // Custom fonts
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        cosmic: ['Orbitron', 'monospace'],
        gaming: ['Rajdhani', 'sans-serif'],
      },
      
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff' },
          '100%': { boxShadow: '0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'cosmic': '1rem',
      },
      
      // Backdrop filters for glassmorphism
      backdropBlur: {
        xs: '2px',
      },
      
      // Custom box shadows
      boxShadow: {
        'cosmic': '0 0 20px rgba(99, 102, 241, 0.3)',
        'ai-glow': '0 0 30px rgba(0, 255, 136, 0.4)',
        'mvx': '0 0 25px rgba(27, 70, 194, 0.3)',
        'nft': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      
      // Custom gradients
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'ai-gradient': 'linear-gradient(135deg, #00ff88 0%, #ff0080 100%)',
        'mvx-gradient': 'linear-gradient(135deg, #1B46C2 0%, #23D0FF 100%)',
        'game-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}