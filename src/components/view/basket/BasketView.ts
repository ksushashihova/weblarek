import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/Events';

export class BasketView extends Component<null> {
  private list: HTMLElement;
  private total: HTMLElement;
  private button: HTMLButtonElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
  super(container);

  this.list = this.container.querySelector('.basket__list')!;
  this.total = this.container.querySelector('.basket__price')!;
  this.button = this.container.querySelector('.basket__button')!;

  this.button.addEventListener('click', () => {
    this.events.emit('order:start');
  });
}

  setItems(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
    } else {
      this.list.textContent = 'Корзина пуста';
    }
  }

  setTotal(value: number) {
    this.total.textContent = `${value} синапсов`;
  }

  toggleButton(state: boolean) {
    this.button.disabled = !state;
  }
}