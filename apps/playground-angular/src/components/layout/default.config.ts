import { LayoutConfiguration } from './layout.model';

export const defaultConfiguration = {
  logos: {
    mark: {
      url: '/logos/degreed-mark.png',
    },
    logo: {
      url: '/logos/degreed-logo.png',
    },
  },
  features: {
    search: false,
    add: false,
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
