import { LitElement, html, css } from 'lit-element';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

class RxTodoApp extends LitElement {
  elementDisconnect$ = new Subject();
  todos$ = new BehaviorSubject([]);
  currentTodoId$ = new BehaviorSubject(null);

  get todos() {
    return this.todos$.getValue();
  }

  get currentTodoId() {
    return this.currentTodoId$.getValue();
  }

  get currentTodo() {
    return this.todos.filter(todo => todo.id === this.currentTodoId)[0] || null;
  }

  connectedCallback() {
    combineLatest(
      this.todos$,
      this.currentTodoId$,
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
      <todo-input
        .currentTodo="${this.currentTodo}"
        @saveTodo="${e => this.onSaveTodo(e)}"
      ></todo-input>
      <todo-list 
        .todos="${this.todos}"
        @editTodo="${e => this.onEditTodo(e)}"
        @deleteTodo="${e => this.onDeleteTodo(e)}"
      ></todo-list>
    </div>`;
  }

  onSaveTodo(e) {
    const text = e.detail.value;
    if(this.currentTodoId) {
      this._updateTodo(this.currentTodoId, text);
    } else {
      this._createTodo(text);
    }
  }

  _createTodo(text) {
    this.todos$.next(
      [...this.todos, ...[{
        id: +new Date(),
        text,
      }]],
    );
  }

  _updateTodo(id, text) {
    this.todos$.next(
      this.todos.map(todo => todo.id === id ? {
        id: todo.id,
        text,
      } : todo)
    )
    this.currentTodoId$.next(null);
  }

  onEditTodo(e) {
    const id = e.detail.id;
    this.currentTodoId$.next(
      id
    );
  }

  onDeleteTodo(e) {
    const id = e.detail.id;
    this.todos$.next(
      this.todos.filter(todo => todo.id !== id)
    );
  }
}

customElements.define('rx-todo-app', RxTodoApp);