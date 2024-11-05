import { render } from '../render';
import {
  getByText,
  getByTestId,
  fireEvent,
  getByRole,
  queryByText,
} from '@testing-library/dom';
import type { Component, StatelessComponent } from '../types';
import { tags } from '../tags';
import { createApp } from '../create-app';
import { c } from '../c';

const { div, p, button } = tags;

beforeEach(() => {
  document.body.innerHTML = `
    <div id="root"></div>
  `;
});

const Counter: Component<{ count: number }> = {
  state: { count: 0 },
  view({ state }) {
    return div(
      [
        p(`Count: ${state.count}`),
        button('Increment', {
          onclick: () => state.count++,
          className: `${state.count > 0 ? 'positive' : 'negative'}`,
          autofocus: state.count === 0,
          ['data-testid']: 'increment',
        }),
      ],
      { ['data-testid']: 'counter' },
    );
  },
};

describe('components', () => {
  test('counter', () => {
    const root = document.getElementById('root');
    createApp(root, {
      view() {
        return div(c(Counter));
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const el = getByTestId(root, 'counter');
    const btn = getByTestId(root, 'increment');

    expect(getByText(el, /Count: 0/));
    expect(btn.className).toBe('negative');
    expect(btn.hasAttribute('autofocus')).toBe(true);

    fireEvent.click(btn);

    expect(getByText(el, /Count: 1/));
    expect(btn.className).toBe('positive');
    expect(btn.hasAttribute('autofocus')).toBe(false);
  });

  test('mounted', () => {
    const root = document.getElementById('root');
    const mounted = jest.fn();

    if (!root) {
      throw new Error('Root is null');
    }

    render({
      element: root,
      component: { ...Counter, mounted },
    });

    expect(mounted).toHaveBeenCalledTimes(1);
  });

  test('with state', () => {
    const root = document.getElementById('root');
    const WithState: Component<{ count: number }> = {
      state: { count: 0 },
      view({ state }) {
        return div(p(`Count: ${state.count}`));
      },
    };

    render({ element: root, component: WithState });

    if (!root) {
      throw new Error('Root is null');
    }

    const el = getByText(root, /Count: 0/);

    expect(el).toBeDefined();
  });

  test('keep', () => {
    const root = document.getElementById('root');
    const KeepComponent: Component<{ count: number }> = {
      state: { count: 0 },
      view({ state }) {
        return div(
          div(
            [
              `Don't change me ${state.count}`,
              button('Increment', {
                onclick: () => state.count++,
              }),
            ],
            { keep: true },
          ),
        );
      },
    };

    createApp(root, {
      view() {
        return div(c(KeepComponent));
      },
    });

    if (!root) {
      throw new Error('Root is null');
    }

    const btn = getByRole(root, 'button');

    expect(btn).toBeDefined();

    fireEvent.click(btn);

    expect(queryByText(root, /Don't change me 0/)).toBeTruthy();
    expect(queryByText(root, /Don't change me 1/)).toBeNull();
  });
});
