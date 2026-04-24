// Card.ts
import { Component } from '../../base/Component';
import { IProduct } from '../../../types';

export abstract class Card extends Component<IProduct> {
  protected title: HTMLElement;
  protected price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.title = this.container.querySelector('.card__title')!;
    this.price = this.container.querySelector('.card__price')!;
  }

  setData(data: IProduct) {
    this.title.textContent = data.title;
    this.price.textContent = data.price
      ? `${data.price} синапсов`
      : 'Бесценно';
  }
}