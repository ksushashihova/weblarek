import { EventEmitter } from '../base/Events';

export class Modal {
  private content: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(private container: HTMLElement, private events: EventEmitter) {
    this.content = this.container.querySelector('.modal__content')!;
    this.closeButton = this.container.querySelector('.modal__close')!;

    this.closeButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  open(content: HTMLElement) {
    this.content.replaceChildren(content);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }
}