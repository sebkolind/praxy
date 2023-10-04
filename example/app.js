import {Praxy} from '../dist/praxy';

const App = new Praxy();

const MyComponent = {
  name: 'myComponent',
  template: html`
    <div>
      <div>Hello <span>test</span> {{entity}}</div>
      <p>My name is <span>{{name}}</span></p>
      <div>Testing something simple {{easy}}</div>
      <input type="text" />
      <button>Click me</button>
    </div>
  `,
  data: {
    entity: 'World!',
    easy: 'simplicity',
    name: 'Sebastian',
    nested: {
      key: 'value',
    },
  },
};

App.component(MyComponent, function(data) {
  this.on('click', 'button', () => {
    data.entity = 'Universe!';
    data.easy = 'complexity';
  });
  this.on('input', 'input', ({target}) => {
    data.name = target.value;
  });
});

function html(...values) {
  return values.join('');
}
