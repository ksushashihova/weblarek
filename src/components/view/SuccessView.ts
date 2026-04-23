import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class SuccessView extends Component<{ total: number }> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.description = this.container.querySelector(
      '.order-success__description'
    ) as HTMLElement;

    this.closeButton = this.container.querySelector(
      '.order-success__close'
    ) as HTMLButtonElement;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  setTotal(total: number) {
    this.description.textContent = `Списано ${total} синапсов`;
  }
}