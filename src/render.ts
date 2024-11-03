import { walker } from './walker';
import type {
  Component,
  Nullable,
  Props,
  StatelessComponent,
  TentElement,
} from './types';

async function render<S extends {}, P extends Props>(
  element: Nullable<Element>,
  component: Component<S, P> | StatelessComponent<P>,
  properties = {} as P,
  nested = false,
) {
  if (element == null) return;

  const { init, view, mounted } = component;

  if (init != null) {
    init().then((state) => {
      delete component.init;
      render(
        element,
        { ...component, state } as Component<S, P>,
        properties,
        nested,
      );
    });

    return;
  }

  let node: TentElement;
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
  node.$tent = { props, component, initState: { ...state } };

  el.append(node);

  if (mounted) {
    mounted(context);
    delete component.mounted;
  }
}

export { render };
