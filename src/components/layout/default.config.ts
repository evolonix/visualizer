import { LayoutConfiguration } from './layout.model';

export const defaultConfiguration = {
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
