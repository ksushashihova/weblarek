import { Form } from './Form';
import { EventEmitter } from '../../base/Events';

export class OrderForm extends Form<any> {
  private paymentButtons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this.paymentButtons = this.container.querySelectorAll('.button_alt');


    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.paymentButtons.forEach(b =>
          b.classList.remove('button_alt-active')
        );

        button.classList.add('button_alt-active');

        this.events.emit('form:change', {
          field: 'payment',
          value: button.name
        });
      });
    });


    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:next');
    });
  }
}