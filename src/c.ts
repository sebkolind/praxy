import type {
  AnyComponent,
  Component,
  StatelessComponent,
  C,
  TentElement,
} from './types';

function c<S>(component: Component<S>): C<S>;
function c<S, P>(component: Component<S, P>, props: P): C<S, P>;
function c<P>(component: StatelessComponent<P>, props: P): C<undefined, P>;
function c<P>(component: StatelessComponent<P>): C<undefined, P>;
function c<S, P>(component: AnyComponent, props?: P): C<S, P> {
  if (component == null) {
    return createEmptyComponent();
  }

  if (!('view' in component)) {
    throw new Error('The component must have a view function.');
  }

  return { component, props };
}

function createEmptyComponent(): C {
  const view = document.createTextNode('') as unknown as TentElement;

  return {
    component: { view: () => view },
    props: {},
  };
}

export { c, createEmptyComponent };
