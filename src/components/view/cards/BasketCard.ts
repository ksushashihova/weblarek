import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';

export class BasketCard extends Component<IProduct> {
  private title: HTMLElement;
  private price: HTMLElement;
  private deleteButton: HTMLButtonElement;

  private id: string = '';

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.title = this.container.querySelector('.card__title')!;
    this.price = this.container.querySelector('.card__price')!;
    this.deleteButton = this.container.querySelector('.basket__item-delete')!;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('product:remove', { id: this.id });
    });
  }

  setData(product: IProduct, index: number) {
    this.id = product.id;
    this.title.textContent = product.title;
    this.price.textContent = product.price
      ? `${product.price} синапсов`
      : 'Бесценно';

    const indexEl = this.container.querySelector('.basket__item-index');
    if (indexEl) indexEl.textContent = String(index);
  }
}