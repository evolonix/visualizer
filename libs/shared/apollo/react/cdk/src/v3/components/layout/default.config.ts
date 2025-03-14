import { LayoutAspect } from './layout.model';

export const defaultConfiguration = {
  features: {
    search: { enabled: false, visible: true },
    addContent: { enabled: false, visible: true },
  },
  navigation: {
    top: [],
    bottom: [],
  },
} satisfies LayoutAspect;
