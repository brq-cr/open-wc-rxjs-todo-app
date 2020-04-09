import { LitElement, html } from 'lit-element';

export class TodoInput extends LitElement {

  static get properties() {
    return { 
      currentTodo: { 
        type: Object,
      },
    };
  }

  render() {
    return html`
      <form @submit="${this.onFormSubmit.bind(this)}">
        <input
          id="todo-input"
          value="${this.currentTodo ? this.currentTodo.text : ''}"
          type="text"
        />
        <button>
          ${this.currentTodo ? 'Edit' : 'Add'}
        </button>
      </form>
    `;
  }

  onFormSubmit(e) {
    e.preventDefault();
    const todoInput = this.shadowRoot.getElementById('todo-input');
    this.dispatchEvent(
      new CustomEvent('saveTodo', {
        detail: { 
          value: todoInput.value 
        }
      })
    );
    todoInput.value = '';
  }

}

customElements.define('todo-input', TodoInput);