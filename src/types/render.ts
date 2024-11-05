import type { Plugin } from './plugins';
import type { Component, StatelessComponent } from './component';
import type { Nullable } from './utils';

type RenderArgs<S, P> = {
  element: Nullable<Element>;
  component: Component<S, P> | StatelessComponent<P>;
  properties?: P;
  nested?: boolean;
  pluginConfigs?: Plugin[];
};

export type { RenderArgs };
