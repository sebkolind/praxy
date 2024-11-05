import {
  fireEvent,
  getAllByRole,
  getByRole,
  getByText,
} from '@testing-library/dom';
import { render } from '../render';
import { Component, StatelessComponent } from '../types';
import { c } from '../c';
import { tags } from '../tags';
import { createApp } from '../create-app';

const { div, button, p, ul, li } = tags;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="root"></div>
  `;
});

describe('walker', () => {
  test('that it replaces when tagName differs', () => {
    const root = document.getElementById('root');
    render({
      element: root,
      component: {
        state: { count: 0 },
        view({ state }) {
          return div([
            state.count === 0 ? p('Hello, world!') : div('Adios, world!'),
            button('Click me', {
              onclick: () => state.count++,
            }),
          ]);
        },
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const btn = getByRole(root, 'button');

    expect(getByText(root, /Hello, world!/).tagName).toBe('P');

    fireEvent.click(btn);

    expect(getByText(root, /Adios, world!/).tagName).toBe('DIV');
  });

  test('when node type is a text node', () => {
    const root = document.getElementById('root');
    render({
      element: root,
      component: {
        state: { count: 0 },
        view({ state }) {
          return div([
            state.count === 0 ? 'Hello, world!' : 'Adios, world!',
            button('Click me', {
              onclick: () => state.count++,
            }),
          ]);
        },
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const btn = getByRole(root, 'button');

    expect(getByText(root, /Hello, world!/)).toBeDefined();

    fireEvent.click(btn);

    expect(getByText(root, /Adios, world!/)).toBeDefined();
  });

  test('attributes are removed', () => {
    const root = document.getElementById('root');
    render({
      element: root,
      component: {
        state: { count: 0 },
        view({ state }) {
          return button('Click me', {
            onclick: () => state.count++,
            ['data-test']: state.count === 0,
          });
        },
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const btn = getByRole(root, 'button');

    expect(btn.hasAttribute('data-test')).toBe(true);

    fireEvent.click(btn);

    expect(btn.hasAttribute('data-test')).toBe(false);
  });

  test('appending/removing children', () => {
    const Component = {
      state: { items: ['one', 'two', 'three'] },
      view({ state }) {
        return div([
          ul(state.items.map((item) => li(item))),
          button('Add item', {
            onclick: () => {
              if (state.items.length === 4) {
                state.items = ['one'];
              } else {
                state.items = [...state.items, 'four'];
              }
            },
          }),
        ]);
      },
    };

    const root = document.getElementById('root');
    createApp(root, {
      view() {
        return div(c(Component));
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const btn = getByRole(root, 'button');

    expect(getByText(root, /one/)).toBeDefined();

    fireEvent.click(btn);

    expect(getByText(root, /four/)).toBeDefined();
    expect(getAllByRole(root, 'listitem').length).toBe(4);

    fireEvent.click(btn);

    expect(getByText(root, /one/)).toBeDefined();
    expect(getAllByRole(root, 'listitem').length).toBe(1);
  });

  test('nested components', () => {
    type State = { count: number };
    type Props = { text: string };

    const InnerComponent: Component<State, Props> = {
      state: { count: 0 },
      view({ state, props }) {
        return button(`${props.text} inner ${state.count}`, {
          onclick: () => state.count++,
        });
      },
    };

    const InnerComponent2: Component<State> = {
      state: { count: 0 },
      view({ state }) {
        return button(`Click me inner #2 ${state.count}`, {
          onclick: () => state.count++,
        });
      },
    };

    const OuterComponent: Component<State> = {
      state: { count: 0 },
      view({ state }) {
        return div([
          c(InnerComponent, { text: 'Click me' }),
          c(InnerComponent2),
          button(`Click me outer ${state.count}`, {
            onclick: () => state.count++,
          }),
        ]);
      },
    };

    const root = document.getElementById('root');
    createApp(root, {
      view() {
        return div(c(OuterComponent));
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const outerBtn = getByText(root, /Click me outer 0/);

    expect(outerBtn).toBeDefined();

    fireEvent.click(outerBtn);
    fireEvent.click(outerBtn);
    fireEvent.click(outerBtn);

    const innerBtn = getByText(root, /Click me inner 0/);
    const inner2Btn = getByText(root, /Click me inner #2 0/);

    expect(innerBtn).toBeDefined();
    expect(inner2Btn).toBeDefined();

    fireEvent.click(innerBtn);
    fireEvent.click(innerBtn);

    fireEvent.click(inner2Btn);
    fireEvent.click(inner2Btn);

    expect(getByText(root, /Click me inner 2/)).toBeDefined();
    expect(getByText(root, /Click me outer 3/)).toBeDefined();
    expect(getByText(root, /Click me inner #2 2/)).toBeDefined();
  });

  test('nested components without state should not be skipped', () => {
    const InnerComponent: StatelessComponent = {
      view() {
        return p('Hello, world!');
      },
    };

    const OuterComponent: StatelessComponent = {
      view() {
        return div(c(InnerComponent));
      },
    };

    const WrapperComponent: Component<{ test: boolean }> = {
      state: { test: false },
      view() {
        return div(c(OuterComponent));
      },
      mounted({ state }) {
        state.test = true;
      },
    };

    const root = document.getElementById('root');
    render({ element: root, component: WrapperComponent });

    if (!root) {
      throw new Error('Root is null');
    }

    expect(getByText(root, /Hello, world!/)).toBeDefined();
  });
});
