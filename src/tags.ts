import type { C, TagChild, TagContext, Tags, TentElement } from './types';
import { updateAttribute } from './attributes';
import { render } from './render';

function createTag(context: TagContext) {
  const [tag, children, attrs] = context;

  const el = document.createElement(tag) as TentElement;
  const attributes = Object.keys(attrs ?? {});

  el.$tent = {
    attributes,
    props: null,
    component: null,
    keep: attributes.includes('keep') ?? null,
    initState: null,
  };

  for (const key in attrs) {
    updateAttribute(el, key, attrs[key]);
  }

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      renderChildren(el, children[i]);
    }
  } else {
    renderChildren(el, children);
  }

  return el;
}

function renderChildren(el: TentElement, child: TagChild) {
  if (child == null) {
    createFragment(el);
    return;
  }

  if (isComponent(child)) {
    const { component, props } = child;
    render(el, component, props, true);
  } else {
    el.append(typeof child === 'number' ? child.toString() : child);
  }
}

function isComponent(child: NonNullable<TagChild>): child is C<any, any> {
  return typeof child === 'object' && 'component' in child;
}

function createFragment(el: TentElement) {
  const fragment = document.createTextNode('');

  el.append(fragment);
}

const tags: Tags = {};
const tagsArray = [
  'div',
  'p',
  'ul',
  'li',
  'button',
  'input',
  'label',
  'form',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
  'img',
  'video',
  'audio',
  'canvas',
  'table',
  'tr',
  'td',
  'th',
  'thead',
  'tbody',
  'tfoot',
  'select',
  'option',
  'textarea',
  'pre',
  'code',
  'blockquote',
  'hr',
  'br',
  'iframe',
  'nav',
  'header',
  'footer',
  'main',
  'section',
  'article',
  'aside',
  'small',
  'b',
];

for (let i = 0; i < tagsArray.length; i++) {
  const tag = tagsArray[i];

  tags[tag] = (children, attributes) => createTag([tag, children, attributes]);
}

export { tags, createTag };
