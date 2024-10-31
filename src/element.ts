import type { TentElement } from './types';

function createElement<T>(tagName: string): TentElement & T {
  const element = document.createElement(tagName) as TentElement & T;

  element.$tent = {
    props: null,
    view: null,
    initState: null,
    component: null,
  };

  return element;
}

export { createElement };
