// BasketCard.ts
import { Card } from './Card';
import { IProduct } from '../../../types';

export class BasketCard extends Card {
  private indexElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private onRemove: () => void
  ) {
    super(container);

    this.indexElement = this.container.querySelector('.basket__item-index')!;
    const deleteButton = this.container.querySelector<HTMLButtonElement>('.basket__item-delete');

    deleteButton?.addEventListener('click', () => {
      this.onRemove();
    });
  }

  setData(product: IProduct, index: number) {
    this.indexElement.textContent = String(index);
    this.title.textContent = product.title;
    this.price.textContent = product.price
      ? `${product.price} синапсов`
      : 'Бесценно';
  }
}