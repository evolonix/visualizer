import { LayoutConfiguration, LayoutConfigurationToken } from '../components';
import configurationJson from '../data/layout.config.json?raw';
import { DependencyInjector, makeInjector } from './di';

const configuration: LayoutConfiguration = JSON.parse(configurationJson);

/**
 * Dependency injector with registered Degreed Skills Data Access services
 */
export const buildInjector = (): DependencyInjector => {
  return makeInjector([
    {
      provide: LayoutConfigurationToken,
      useValue: configuration,
    },
  ]);
};
