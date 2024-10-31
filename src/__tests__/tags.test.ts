import { tags, createTag } from '../tags';

describe('tags.ts', () => {
  test('creating a custom tag', () => {
    const el = createTag(['div', 'test', { id: 'test' }]);

    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('test');
    expect(el.getAttribute('id')).toBe('test');
  });

  test('creating a tag with children', () => {
    const { p, div } = tags;

    const el = createTag([
      'div',
      [p('foo'), p('bar'), div([p('baz')])],
      { id: 'foo' },
    ]);

    expect(el.tagName).toBe('DIV');
    expect(el.children.length).toBe(3);
    expect(el.getAttribute('id')).toBe('foo');
    expect(el.children[2].tagName).toBe('DIV');
    expect(el.children[2].children.length).toBe(1);
    expect(el.children[2].children[0].tagName).toBe('P');
    expect(el.children[2].children[0].textContent).toBe('baz');
  });

  test('creating a tag with a number as a child', () => {
    const el = createTag(['div', 42, {}]);

    expect(el.tagName).toBe('DIV');
    expect(el.textContent).toBe('42');
  });
});
