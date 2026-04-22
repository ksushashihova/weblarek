import { Component } from '../base/Component';

export class Gallery extends Component<null> {
  setCatalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}