import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/Events';

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errors: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.submitButton = this.container.querySelector('button[type=submit]')!;
    this.errors = this.container.querySelector('.form__errors')!;


    this.container.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target.name) return;

      this.events.emit('form:change', {
        field: target.name,
        value: target.value,
      });
    });


    this.events.on('form:valid', (isValid: boolean) => {
      this.setValid(isValid);
    });
  }

  setValid(state: boolean) {
    this.submitButton.disabled = !state;
  }

  setErrors(message: string) {
    this.errors.textContent = message;
  }

  // Form.ts (базовый)
  setFieldValue(name: string, value: string) {
    const input = this.container.querySelector<HTMLInputElement>(`[name="${name}"]`);
    if (input) input.value = value;
  }
}