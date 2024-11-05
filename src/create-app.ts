import { render } from './render';
import type { AnyComponent, Nullable, Plugin } from './types';

function createApp(
  element: Nullable<Element>,
  app: NonNullable<AnyComponent>,
  plugins: Plugin[] = [],
) {
  if (!element) {
    throw new Error("The root element wasn't found.");
  }

  render({
    element,
    component: app,
    pluginConfigs: plugins,
  });
}

export { createApp };
