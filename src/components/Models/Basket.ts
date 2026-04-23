import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed', this.items);
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(p => p.id !== product.id);
    this.events.emit('basket:changed', this.items);
  }


  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', this.items);
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(p => p.id === id);
  }
}