import { TodoInput, TodoItem } from '.'
import { html } from '../../../lib/one'

const TodoList = {
  name: 'todo-list',
  components: [TodoItem, TodoInput],
  state: {
    items: [
      { id: 1, text: 'Item #1', done: false },
      { id: 2, text: 'Item #2', done: false },
      { id: 3, text: 'Item #3', done: false },
    ]
  },
  template: html`
    <div>
      <todo-input></todo-input>
      <ul>
        <todo-item></todo-item>
      </ul>
    </div>
  `,
  events: {
    add(text, { state }) {
      const id = Math.random().toString(36).substring(2, 7)

      state.items.push({ id, text, done: false })
    },
    delete(id, { state }) {
      state.items = state.items.filter(item => item.id !== id)
    },
  },
  setup({ query, state }) {
    query('todo-item').for(['items', 'id'])
  }
}

export { TodoList }