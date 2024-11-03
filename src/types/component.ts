import type { Props, State } from '.';

type App = { view: () => TentElement };

type Component<S = State, P = Props> = {
  view: ViewFn<S, P>;
  state: S;
  init?: () => Promise<S>;
  mounted?: MountedFn<S, P>;
  unmounted?: () => void;
};

type StatelessComponent<P = Props> = Omit<Component<{}, P>, 'state'>;

type AnyComponent = Component<any, any> | StatelessComponent<any> | null;

type Context<S, P> = { state: S; el: TentElement; props: P };

type MountedFn<S, P> = (context: Context<S, P>) => void;

type ViewFn<S, P> = (context: Context<S, P>) => TentElement;

type TentCustomProperties = {
  $tent?: TentObject;
  childNodes: NodeListOf<TentElement>;
};
type TentElement = (Element | HTMLElement) & TentCustomProperties;
type TentObject = {
  attributes?: string[];
  props: Props | null;
  initState: State | null;
  component: AnyComponent;
  keep?: boolean | null;
};

export type { App, Component, StatelessComponent, AnyComponent, TentElement };
