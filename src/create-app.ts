import { render } from './render';
import type { AnyComponent, Nullable } from './types';

function createApp(el: Nullable<Element>, app: NonNullable<AnyComponent>) {
  if (!el) {
    throw new Error("The root element wasn't found.");
  }

  render(el, app);
}

export { createApp };
