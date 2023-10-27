import {e, Link, createRouter} from '../dist/else'
import {getItems} from './services/getItems'

const Layout = e(
  'div',
  [
    e(
      'header',
      [
        e(
          'nav',
          [
            Link({href: '/', text: 'home'}),
            Link({href: '/about-us', text: 'about us'}),
          ],
          {
            styles: {
              a: {
                margin: '0 10px 0 0',
                'text-decoration': 'none',
              },
              'a:hover': {
                'text-decoration': 'underline',
              },
            },
          }
        ),
      ],
      {
        styles: {
          padding: '60px 0',
        },
      }
    ),
    e('main', [], {view: true, styles: {width: '350px'}}),
    e('footer', '💛 else.js', {
      styles: {
        position: 'fixed',
        bottom: 0,
        padding: '24px 0',
        'font-size': '0.9em',
      },
    }),
  ],
  {
    styles: {
      display: 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      h1: {
        'margin-top': 0,
      },
    },
  }
)

const TestProps = e(
  'div',
  ({context}) => [
    e(
      'div',
      context.props.someProp ? `Test ${context.props.someProp}` : 'Test'
    ),
  ],
  {
    props: ['someProp'],
  }
)

function List(context) {
  if (context.isLoading) {
    return e('p', 'Loading...')
  }
  if (!context.items.length && !context.isLoading) {
    return e('p', 'Yay! You rock 🎉')
  }
  return e(
    'ul',
    context.items.map((item) => ListItem(item, context)),
    {
      styles: {
        margin: '0 auto',
        padding: 0,
        'list-style': 'none',
        display: 'flex',
        'flex-direction': 'column',
        gap: '6px',
        li: {
          padding: '8px',
          color: '#eee',
          background: '#444',
          'border-radius': '4px',
          opacity: 1,
        },
        'li.done': {
          opacity: 0.5,
          background: 'seagreen',
        },
      },
    }
  )
}

function ListItem(item, context) {
  const Buttons = e(
    'div',
    [
      e('button', '✅', {
        onclick() {
          item.done = !item.done
          context.items = context.items
        },
      }),
      e('button', '🗑️', {
        onclick() {
          context.items = context.items.filter((x) => x.id !== item.id)
        },
      }),
    ],
    {
      styles: {
        display: 'flex',
        gap: '6px',
        margin: '12px 0 0 0',
        button: {
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
        },
      },
    }
  )

  return e(
    'li',
    [
      e('div', `#${item.id}`, {
        styles: {'font-size': '0.8em', margin: '0 0 4px 0'},
      }),
      e('strong', item.name, {
        styles: {'font-size': '1.2em', margin: '0 0 4px 0', display: 'block'},
      }),
      !item.done
        ? e(
            'div',
            [
              item.subtitle && e('p', item.subtitle),
              e('p', item.description),
              Buttons,
            ],
            {styles: {p: {'font-size': '0.85em'}}}
          )
        : Buttons,
    ],
    {
      key: item.id,
      class: `${item.done ? 'done' : ''}`,
      styles: {
        p: {margin: 0},
      },
    }
  )
}

const Home = e(
  'div',
  ({context}) => [
    e(
      'label',
      [
        e('input', [], {
          type: 'text',
          'aria-label': 'What is up next?',
          placeholder: 'What is up next?',
          disabled: context.isLoading,
          onkeyup(event) {
            if (event.keyCode === 13) {
              const id = context.items.length
                ? context.items[context.items.length - 1].id + 1
                : 1
              context.items = [
                ...context.items,
                {
                  id,
                  name: event.target.value,
                  description: `${event.target.value} description`,
                },
              ]
              event.target.value = ''
            }
          },
          styles: {
            'box-sizing': 'border-box',
            padding: '16px',
            width: '100%',
            'border-radius': '4px',
            'font-size': '1em',
            border: 'none',
          },
        }),
      ],
      {
        styles: {
          padding: '8px 0',
          display: 'block',
          'margin-bottom': '1em',
          width: '350px',
          span: {
            display: 'block',
            margin: '0 0 2px 0',
            'font-size': '12px',
            'text-transform': 'uppercase',
          },
        },
      }
    ),
    List(context),
  ],
  {
    async onmount({context}) {
      context.items = await getItems()
      context.isLoading = false
    },
    data() {
      return {
        amount: 0,
        items: [],
        isLoading: true,
      }
    },
  }
)

const About = e(
  'div',
  ({context}) => [
    e('h1', 'About'),
    e('p', `Hello ${context.name} ${context.route.params?.id}`, {
      styles: {
        color: 'purple',
        background: 'yellow',
        padding: '8px',
        'border-radius': '4px',
      },
    }),
    context.name === 'Seb'
      ? e('div', 'test 1', {styles: {background: 'purple'}})
      : e('div', 'test 2', {styles: {background: 'green'}}),
    e('button', 'Swap name', {
      onclick() {
        context.name = context.name === 'Seb' ? 'Sebastian' : 'Seb'
        TestProps.props.someProp = 'yoyo'
      },
    }),
    TestProps,
  ],
  {
    data() {
      return {
        show: true,
        name: 'Seb',
      }
    },
  }
)

createRouter(
  [
    {path: '/', component: Home},
    {path: '/about-us', component: About},
    {path: '/about-us/:id', component: About},
    {path: '/some/:id', component: About},
    {path: '/test/:id', component: About},
    {path: '/some/:param/:id', component: About},
  ],
  {
    fallback: '/',
    layout: Layout,
    root: document.querySelector('#app'),
  }
)
