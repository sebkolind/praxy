export type {
  Component,
  StatelessComponent,
  TagContext,
  TagChildren,
  TentElement,
} from './types';

// TODO Why can this not be in a globals.d.ts file?
declare global {
  namespace Tent {
    interface Plugins {}
  }
}

export { c } from './c';
export { tags, createTag } from './tags';
export { createApp } from './create-app';
