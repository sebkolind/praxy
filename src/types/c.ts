import type { Component, StatelessComponent } from '.';

type C<S = any, P = any> = {
  component: Component<S, P> | StatelessComponent<P>;
  props?: P;
};

export type { C };
