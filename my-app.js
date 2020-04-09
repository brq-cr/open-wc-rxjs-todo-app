import { LitElement, html, css } from 'lit-element';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { openWc } from './open-wc';


class MyApp extends LitElement {
  elementDisconnect$ = new Subject();
  text$ = new BehaviorSubject('holis');

  get text() {
    return this.text$.getValue();
  }

  connectedCallback() {
    combineLatest(
      this.text$
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
      ${this.text}
      <button 
        type="button" 
        @click="${e => this.updateMessage(e) }">
          Cambiar texto
      </button>
    </div>`;
  }

  updateMessage(e) {
    e.preventDefault();
    console.log(e);
    this.text$.next('algo mas');
  }
}

customElements.define('my-app', MyApp);