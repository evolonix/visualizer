import { LayoutConfiguration, LayoutConfigurationToken } from '../components';
import configurationJson from '../data/layout.config.json?raw';
import { DependencyInjector, makeInjector } from './di';
import { EventBus } from './event-bus';

const configuration: LayoutConfiguration = JSON.parse(configurationJson);

/**
 * Dependency injector with registered Degreed Skills Data Access services
 */
export const buildInjector = (): DependencyInjector => {
  return makeInjector([
    {
      provide: EventBus,
      useFactory: () => new EventBus({ delayNotify: 10, enableLogs: true }),
    },
    {
      provide: LayoutConfigurationToken,
      useValue: configuration,
    },
  ]);
};
