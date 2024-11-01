import { updateAttribute } from '../attributes';
import { createElement } from '../element';

describe('attributes.ts', () => {
  test('adds a simple attribute', () => {
    const el = createElement('div');

    updateAttribute(el, 'id', 'test');

    expect(el.getAttribute('id')).toBe('test');
  });

  test('adds a custom attribute', () => {
    const el = createElement('div');

    updateAttribute(el, 'data-test', 'test');

    expect(el.getAttribute('data-test')).toBe('test');
  });

  test('adds and removes a boolean attribute', () => {
    const el = createElement('input');

    updateAttribute(el, 'disabled', true);
    expect(el.hasAttribute('disabled')).toBe(true);

    updateAttribute(el, 'disabled', false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  test('adds an assignment', () => {
    const el = createElement<HTMLInputElement>('input');

    updateAttribute(el, 'value', 'test');

    expect(el.value).toBe('test');
  });

  test("doesn't add `keep` as an attribute", () => {
    const el = createElement('div');

    updateAttribute(el, 'keep', true);

    expect(el.hasAttribute('keep')).toBe(false);
  });
});
