import { render } from './render';
import type { App, Nullable } from './types';

function createApp(el: Nullable<Element>, app: App) {
  if (!el) {
    throw new Error("The root element wasn't found.");
  }

  render(el, app);
}

export { createApp };
