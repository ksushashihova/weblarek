// PreviewCard.ts
import { Card } from './Card';
import { IProduct } from '../../../types';
import { CDN_URL, categoryMap } from '../../../utils/constants';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private textElement: HTMLElement | null;

  constructor(
    container: HTMLElement,
    private onToggle: () => void
  ) {
    super(container);

    this.button = this.container.querySelector('.card__button')!;
    this.imageElement = this.container.querySelector('.card__image')!;
    this.categoryElement = this.container.querySelector('.card__category')!;
    this.textElement = this.container.querySelector('.card__text');

    this.button.addEventListener('click', () => {
      this.onToggle();
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

    const isPriceless = data.price === null;

    this.button.disabled = isPriceless;
    this.button.textContent = isPriceless
      ? 'Недоступно'
      : inBasket
        ? 'Удалить из корзины'
        : 'Купить';
  }
}