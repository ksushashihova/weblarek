import { Component } from '../../base/Component';
import { IProduct } from '../../../types';
import { CDN_URL } from '../../../utils/constants';

export abstract class Card extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = this.container.querySelector('.card__title')!;
    this.price = this.container.querySelector('.card__price')!;
    this.image = this.container.querySelector('.card__image')!;
    this.category = this.container.querySelector('.card__category')!;
  }

  setData(data: IProduct) {
  this.title.textContent = data.title;
  this.price.textContent = data.price ? `${data.price} ₽` : 'Недоступно';

  const imageName = data.image.split('/').pop();
  const src = `${CDN_URL}/${imageName}`;


  this.setImage(this.image, src, data.title);

  this.category.textContent = data.category;
}
}