import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';

export class BasketCard extends Card {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container, events);

    this.indexElement = this.container.querySelector('.basket__item-index')!;
    this.deleteButton = this.container.querySelector('.basket__item-delete');

    this.deleteButton?.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (!id) return;

      this.events.emit('product:remove', { id });
    });
  }

  setData(product: IProduct, index: number) {
    // вместо поля id записываем в data-атрибут
    this.container.dataset.id = product.id;

    this.indexElement.textContent = String(index);
    this.title.textContent = product.title;
    this.price.textContent = product.price
      ? `${product.price} синапсов`
      : 'Бесценно';
  }
}

