import { LitElement, html } from 'lit-element';

export class TodoList extends LitElement {
  static get properties() {
    return { 
      todos: { type: Array },
    };
  }

  render() {
    return html`
      <ul>
        ${this.todos.map(todo => html`
          <li>
            <span>${todo.text}</span> 
            <button @click="${e => this.onEditTodo(e, todo.id)}">Edit</button> 
            | 
            <button @click="${e => this.onDeleteTodo(e, todo.id)}">Delete</button>
          </li>
        `)}
      </ul>
    `;
  }

  onEditTodo(e, id) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('editTodo', {
        detail: { 
          id,
        }
      })
    );
  }

  onDeleteTodo(e, id) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('deleteTodo', {
        detail: { 
          id,
        }
      })
    );
  }
}

customElements.define('todo-list', TodoList);