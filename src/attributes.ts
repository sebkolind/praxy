import { TentElement } from './types';

function updateAttribute(el: TentElement, key: string, value: any) {
  if (key === 'mounted' || key === 'keep') {
    return;
  }

  if (typeof value === 'object' && value !== null) {
    const styleString = Object.entries(value)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

    el.setAttribute('style', styleString);

    return;
  }

  if (typeof value === 'boolean') {
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
