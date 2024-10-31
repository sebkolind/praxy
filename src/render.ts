import { walker } from './walker';
import type {
  Component,
  Nullable,
  Props,
  State,
  StatelessComponent,
  TentElement,
} from './types';

function render<S extends {}, P extends Props>(
  element: Nullable<Element>,
  component: Component<S, P> | StatelessComponent<P>,
  properties = {} as P,
  nested = false,
) {
  if (element == null) return;

  let node: TentElement;
  const { view, mounted } = component;
  const stateful = 'state' in component;
  const state = stateful ? component.state : ({} as S);
  const el = element as TentElement;
  const props = { ...properties };

  const handler: ProxyHandler<S> = {
    get(obj, key) {
      if (typeof obj[key] === 'object' && obj[key] != null) {
        return new Proxy<S>(obj[key], handler);
      } else {
        return obj[key];
      }
    },
    set(obj, key, value) {
      if (!obj.hasOwnProperty(key)) {
        throw new Error(
          `The property "${String(key)}" does not exist on the state object.`,
        );
      }
      if (obj[key] === value) return true;

      const s = Reflect.set(obj, key, value);

      walker(node, view({ state: proxy, el, props }), nested);

      return s;
    },
  };

  const proxy = new Proxy<S>(state, handler);
  const context = { state: proxy, el, props };

  node = view(context);
  node.$tent = {
    props,
    component,
    initState: { ...state },
    view,
  };

  el.append(node);

  mounted?.(context);
}

export { render };
