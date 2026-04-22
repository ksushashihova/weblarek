import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Header extends Component<null> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;


  constructor(container: HTMLElement, private events: EventEmitter) {
    super(container);


    this.basketButton = this.container.querySelector('.header__basket')!;
    this.counterElement = this.container.querySelector('.header__basket-counter')!;


    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }


  setCounter(value: number) {
    this.counterElement.textContent = String(value);
  }
}