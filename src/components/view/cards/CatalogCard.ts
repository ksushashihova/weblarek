import { Card } from './Card';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { CDN_URL, categoryMap } from '../../../utils/constants';

export class CatalogCard extends Card {
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.imageElement = this.container.querySelector('.card__image')!;
    this.categoryElement = this.container.querySelector('.card__category')!;

    this.container.addEventListener('click', () => {
      const id = this.container.dataset.id;
      if (!id) return;
      this.events.emit('card:select', { id });
    });
  }

  setData(product: IProduct) {
    this.container.dataset.id = product.id;


    this.title.textContent = product.title;
    this.price.textContent = product.price
      ? `${product.price} синапсов`
      : 'Бесценно';

    const imageName = product.image.split('/').pop();
    const src = `${CDN_URL}/${imageName}`;
    this.imageElement.src = src;
    this.imageElement.alt = product.title;


    this.categoryElement.textContent = product.category;


    this.categoryElement.className = 'card__category';

    const categoryClass = categoryMap[product.category];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }
}