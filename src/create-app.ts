import { render } from './render';
import type { Nullable, Plugin, StatelessComponent } from './types';

function createApp(
  element: Nullable<Element>,
  app: StatelessComponent,
  plugins: Plugin[] = [],
) {
  if (!element) {
    throw new Error("The root element wasn't found.");
  }

  if ('state' in app) {
    throw new Error(
      'The app component can not have state. Use the `StatelessComponent` type instead.',
    );
  }

  render({
    element,
    component: app,
    pluginConfigs: plugins,
    createApp: true,
  });
}

export { createApp };
