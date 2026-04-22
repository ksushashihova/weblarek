import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { EventEmitter } from '../../base/Events';
import { CDN_URL } from '../../../utils/constants';

export class CatalogCard extends Component<IProduct> {
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private id!: string;

  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);

    this.titleElement = this.container.querySelector('.card__title')!;
    this.priceElement = this.container.querySelector('.card__price')!;
    this.imageElement = this.container.querySelector('.card__image')!;
    this.categoryElement = this.container.querySelector('.card__category')!;

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });
  }

  setData(product: IProduct) {
    this.id = product.id;

    this.titleElement.textContent = product.title;

    this.priceElement.textContent = product.price
      ? `${product.price} синапсов`
      : 'Бесценно';


    const imageName = product.image.split('/').pop(); 
    const src = `${CDN_URL}/${imageName}`;            


    this.imageElement.src = src;
    this.imageElement.alt = product.title;

    this.categoryElement.textContent = product.category;
  }
}