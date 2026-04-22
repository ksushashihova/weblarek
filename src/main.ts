import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { ApiService } from './components/Services/ApiService';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';

import { CatalogCard } from './components/view/cards/CatalogCard';
import { PreviewCard } from './components/view/cards/PreviewCard';
import { BasketCard } from './components/view/cards/BasketCard';
import { BasketView } from './components/view/basket/BasketView';

import { OrderForm } from './components/view/forms/OrderForm';
import { ContactsForm } from './components/view/forms/ContactsForm';

import { API_URL } from './utils/constants';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('.modal')!, events);

events.on('catalog:changed', () => {
  const products = catalog.getProducts();

  const cards = products.map(product => {
    const template = document
      .querySelector<HTMLTemplateElement>('#card-catalog')!
      .content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const card = new CatalogCard(template, events);
    card.setData(product);

    return card.render();
  });

  gallery.setCatalog(cards);
});

events.on('preview:changed', () => {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  const template = document
    .querySelector<HTMLTemplateElement>('#card-preview')!
    .content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const card = new PreviewCard(template, events);
  card.setData(product, basket.hasItem(product.id));

  modal.open(card.render());
});

events.on('basket:changed', () => {
  const items = basket.getItems();

  const cards = items.map((product, index) => {
    const template = document
      .querySelector<HTMLTemplateElement>('#card-basket')!
      .content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const card = new BasketCard(template, events);
    card.setData(product, index + 1);

    return card.render();
  });

  const template = document
    .querySelector<HTMLTemplateElement>('#basket')!
    .content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const basketView = new BasketView(template, events);

  basketView.setItems(cards);
  basketView.setTotal(basket.getTotalPrice());
  basketView.toggleButton(items.length > 0);

  header.setCounter(basket.getTotalCount());

  modal.open(basketView.render());
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const product = catalog.getProductById(id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on<{ id: string }>('product:add', ({ id }) => {

  const product = catalog.getProductById(id);


  if (product && !basket.hasItem(id)) {
    basket.addItem(product);
    modal.close();
  }
});

events.on<{ id: string }>('product:remove', ({ id }) => {
  const product = catalog.getProducts().find(p => p.id === id);
  if (product) {
    basket.removeItem(product);
  }
});


events.on('basket:open', () => {
  events.emit('basket:changed');
});


events.on('order:start', () => {
  const template = document
    .querySelector<HTMLTemplateElement>('#order')!
    .content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const form = new OrderForm(template, events);

  modal.open(form.render());
});


events.on('order:next', () => {
  const template = document
    .querySelector<HTMLTemplateElement>('#contacts')!
    .content.firstElementChild!
    .cloneNode(true) as HTMLElement;

  const form = new ContactsForm(template, events);

  modal.open(form.render());
});


events.on('order:submit', () => {
  const data = buyer.getData();

  const total = basket.getTotalPrice();

  const order = {
    payment: data.payment,
    address: data.address,
    email: data.email,
    phone: data.phone,
    items: basket.getItems().map(item => item.id),
    total
  };



  apiService.createOrder(order)
    .then(() => {
  
      basket.clear();
      buyer.clear();
      header.setCounter(basket.getTotalCount());


      const template = document
        .querySelector<HTMLTemplateElement>('#success')!
        .content.firstElementChild!
        .cloneNode(true) as HTMLElement;

      const successElement = template as HTMLElement;


      const description = successElement.querySelector(
        '.order-success__description'
      ) as HTMLElement;
      if (description) {
        description.textContent = `Списано ${total} синапсов`;
      }


      const closeButton = successElement.querySelector(
        '.order-success__close'
      ) as HTMLButtonElement;
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          modal.close();
        });
      }


      modal.open(successElement);
    })
    .catch((error) => {
      console.error('CREATE ORDER ERROR', error);
    });
});


events.on('form:change', ({ field, value }) => {
  buyer.setData({ [field]: value });


  const allErrors = buyer.validate();


  const formElement = document.querySelector('.modal form') as HTMLFormElement | null;
  if (!formElement) {
    return;
  }


  const formName = formElement.getAttribute('name');


  const errors: Record<string, string> = {};

  if (formName === 'order') {

    if (allErrors.payment) {
      errors.payment = allErrors.payment;
    }
    if (allErrors.address) {
      errors.address = allErrors.address;
    }
  }

  if (formName === 'contacts') {

    if (allErrors.email) {
      errors.email = allErrors.email;
    }
    if (allErrors.phone) {
      errors.phone = allErrors.phone;
    }
  }


  const isValid = Object.keys(errors).length === 0;
  events.emit('form:valid', isValid);


  let message = '';
  if (errors.payment) {
    message = errors.payment;
  } else if (errors.address) {
    message = errors.address;
  } else if (errors.email) {
    message = errors.email;
  } else if (errors.phone) {
    message = errors.phone;
  }

  events.emit('form:error', message);
});

events.on('form:error', (message: string) => {

  const formElement = document.querySelector('.modal .form') as HTMLElement | null;
  if (!formElement) return;

  const errorsElement = formElement.querySelector('.form__errors') as HTMLElement | null;
  if (!errorsElement) return;

  errorsElement.textContent = message;
});


apiService.getProducts()
  .then(data => {


    catalog.setProducts(data.items);
  });