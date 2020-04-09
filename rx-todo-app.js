import { LitElement, html, css } from 'lit-element';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class RxTodoApp extends LitElement {
  elementDisconnect$ = new Subject();
  todos$ = new BehaviorSubject([]);
  currentTodoIndex$ = new BehaviorSubject(null);

  get todos() {
    return this.todos$.getValue();
  }

  get currentTodoIndex() {
    return this.currentTodoIndex$.getValue();
  }

  connectedCallback() {
    combineLatest(
      this.todos$,
      this.currentTodoIndex$,
    ).pipe(
      takeUntil(this.elementDisconnect$),
    ).subscribe(() => this.requestUpdate());
    super.connectedCallback();
  }

  disconnectedCallback() {
    this.elementDisconnect$.next();
    this.elementDisconnect$.unsubscribe();
    super.disconnectedCallback();
  }

  render() {
    return html`
    <div>
      <ul>
        ${this.todos.map(todo => html`
          <li>${todo}</li>
        `)}
      </ul>
      <button 
        type="button" 
        @click="${e => this.addTodo(e) }">
          Add Todo
      </button>
    </div>`;
  }

  addTodo(e) {
    e.preventDefault();
    this.todos$.next(this.todos.concat([1]));
  }
}

customElements.define('rx-todo-app', RxTodoApp);