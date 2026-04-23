import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';
import { CDN_URL, categoryMap } from '../../../utils/constants';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private textElement: HTMLElement | null;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.button = this.container.querySelector('.card__button')!;
    this.imageElement = this.container.querySelector('.card__image')!;
    this.categoryElement = this.container.querySelector('.card__category')!;
    this.textElement = this.container.querySelector('.card__text'); // один раз здесь

    this.button.addEventListener('click', () => {
      this.events.emit('product:toggle');
    });
  }

  setData(data: IProduct, inBasket: boolean) {
    this.title.textContent = data.title;
    this.price.textContent = data.price
      ? `${data.price} синапсов`
      : 'Бесценно';

    const imageName = data.image.split('/').pop();
    const src = `${CDN_URL}/${imageName}`;
    this.imageElement.src = src;
    this.imageElement.alt = data.title;

    this.categoryElement.textContent = data.category;
    this.categoryElement.className = 'card__category';
    const categoryClass = categoryMap[data.category];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }


    if (this.textElement) {
      this.textElement.textContent = data.description;
    }

    this.button.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
  }
}