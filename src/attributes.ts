import { TentElement } from './types';

function updateAttribute(el: TentElement, key: string, value: any) {
  if (key === 'keep') {
    return;
  }

  if (value == null) {
    el.removeAttribute(key);

    return;
  }

  if (typeof value === 'object' && value !== null) {
    const objString = Object.entries(value)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

    el.setAttribute(key, objString);

    return;
  }

  if (typeof value === 'boolean' && !(key in el)) {
    if (value) {
      el.setAttribute(key, '');
    } else {
      el.removeAttribute(key);
    }

    return;
  }

  // Either set the attribute or the property of the element.
  // i.e., `el.value` is a property, and `el['data-foo']` is an attribute.
  if (el[key] === undefined) {
    el.setAttribute(key, String(value));
  } else {
    el[key] = value;
  }
}

export { updateAttribute };
