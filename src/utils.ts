import { Component, TentElement } from './types';

function cleanupComponent(node: TentElement) {
  if (!node.$tent) return;

  const { component, initState } = node.$tent;
  if (component && isStatefulComponent(component) && initState) {
    component.state = { ...initState };
  }
  component?.unmounted?.();
  node.childNodes.forEach((child) => cleanupComponent(child as TentElement));
}

function isStatefulComponent(component: any): component is Component {
  return 'state' in component;
}

export { cleanupComponent };
