import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

type TValidationErrors = Record<string, string>;

export class Buyer {
  private data: Partial<IBuyer> = {};

  constructor(private events: EventEmitter) {}

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit('order:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.data.payment ?? '',
      address: this.data.address ?? '',
      email: this.data.email ?? '',
      phone: this.data.phone ?? '',
    };
  }

  clear(): void {
    this.data = {};
    this.events.emit('order:changed', this.getData());
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.data.address || !this.data.address.toString().trim()) {
      errors.address = 'Укажите адрес';
    }

    const email = this.data.email?.toString().trim() || '';
    if (!email) {
      errors.email = 'Укажите email';
    } else if (!email.includes('@') || !email.includes('.')) {
      errors.email = 'Введите корректный email';
    }

    const phone = this.data.phone?.toString().trim() || '';
    if (!phone) {
      errors.phone = 'Укажите телефон';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Введите корректный телефон';
    }

    return errors;
  }
}