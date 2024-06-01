import { LayoutConfiguration } from './layout.model';

export const defaultConfiguration = {
  theme: {
    colors: {
      background: 'white',
      highlight: 'var(--tw-color-cyan-800)',
    },
    text: 'dark',
  },
  features: {
    search: true,
  },
  navigation: {
    top: [
      {
        label: 'Home',
        path: '/',
        icon: 'home',
      },
    ],
  },
} satisfies LayoutConfiguration;
