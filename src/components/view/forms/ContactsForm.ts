import { Form } from './Form';
import { EventEmitter } from '../../base/Events';

export class ContactsForm extends Form<any> {
  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });
  }
}