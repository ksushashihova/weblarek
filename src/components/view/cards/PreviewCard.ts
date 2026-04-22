import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';
import { CDN_URL } from '../../../utils/constants';

export class PreviewCard extends Card {
  private button: HTMLButtonElement;
  private id: string;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.button = this.container.querySelector('.card__button')!;

    this.button.addEventListener('click', () => {


      if (this.button.textContent === 'Купить') {
        this.events.emit('product:add', { id: this.id });
        this.button.textContent = 'Удалить из корзины';
      } else {
        this.events.emit('product:remove', { id: this.id });
        this.button.textContent = 'Купить';
      }
    });
  }

  setData(data: IProduct, inBasket: boolean) {
    this.id = data.id;

    this.title.textContent = data.title;
    this.price.textContent = data.price
      ? `${data.price} синапсов`
      : 'Бесценно';
    this.category.textContent = data.category;


    const imageName = data.image.split('/').pop();              
    const src = `${CDN_URL}/${imageName}`;                       

    this.image.src = src;
    this.image.alt = data.title;

    const text = this.container.querySelector('.card__text');
    if (text) text.textContent = data.description;

    this.button.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
  }
}