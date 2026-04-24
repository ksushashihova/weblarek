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
import { SuccessView } from './components/view/SuccessView';

import { API_URL } from './utils/constants';
import type { IBuyer } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalog = new ProductCatalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('.modal')!, events);


const basketTemplate = document
  .querySelector<HTMLTemplateElement>('#basket')!
  .content.firstElementChild!
  .cloneNode(true) as HTMLElement;
const basketView = new BasketView(basketTemplate, events);

const orderTemplate = document
  .querySelector<HTMLTemplateElement>('#order')!
  .content.firstElementChild!
  .cloneNode(true) as HTMLElement;
const orderForm = new OrderForm(orderTemplate, events);

const contactsTemplate = document
  .querySelector<HTMLTemplateElement>('#contacts')!
  .content.firstElementChild!
  .cloneNode(true) as HTMLElement;
const contactsForm = new ContactsForm(contactsTemplate, events);

const successTemplate = document
  .querySelector<HTMLTemplateElement>('#success')!
  .content.firstElementChild!
  .cloneNode(true) as HTMLElement;
const successView = new SuccessView(successTemplate, events);

// Закрытие модалки по событию
events.on('modal:close', () => {
  modal.close();
});


events.on('catalog:changed', () => {
  const products = catalog.getProducts();

  const cards = products.map(product => {
    const template = document
      .querySelector<HTMLTemplateElement>('#card-catalog')!
      .content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const card = new CatalogCard(template, (id) => {
      const p = catalog.getProductById(id);
      if (p) {
        catalog.setSelectedProduct(p);
      }
    });

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

  const card = new PreviewCard(template, () => {
    const p = catalog.getSelectedProduct();
    if (!p) return;

    if (basket.hasItem(p.id)) {
      basket.removeItem(p);
    } else {
      basket.addItem(p);
    }

    modal.close();
  });

  card.setData(product, basket.hasItem(product.id));
  modal.open(card.render());
});


const renderBasket = () => {
  const items = basket.getItems();

  const cards = items.map((product, index) => {
    const template = document
      .querySelector<HTMLTemplateElement>('#card-basket')!
      .content.firstElementChild!
      .cloneNode(true) as HTMLElement;

    const card = new BasketCard(template, () => {
      basket.removeItem(product);
    });

    card.setData(product, index + 1);
    return card.render();
  });

  basketView.setItems(cards);
  basketView.setTotal(basket.getTotalPrice());
  basketView.toggleButton(items.length > 0);

  header.setCounter(basket.getTotalCount());
};

events.on('basket:changed', renderBasket);

events.on('basket:open', () => {
  modal.open(basketView.render());
});


events.on('order:start', () => {
  modal.open(orderForm.render());
});

events.on('order:next', () => {
  modal.open(contactsForm.render());
});

events.on<IBuyer>('order:changed', (data) => {
  orderForm.setPayment(data.payment);
  orderForm.setFieldValue('address', data.address);

  contactsForm.setFieldValue('email', data.email);
  contactsForm.setFieldValue('phone', data.phone);

  const allErrors = buyer.validate();

  const orderErrors: string[] = [];
  const contactsErrors: string[] = [];

  if (allErrors.payment) orderErrors.push(allErrors.payment);
  if (allErrors.address) orderErrors.push(allErrors.address);
  if (allErrors.email) contactsErrors.push(allErrors.email);
  if (allErrors.phone) contactsErrors.push(allErrors.phone);

  const isOrderValid = orderErrors.length === 0;
  const isContactsValid = contactsErrors.length === 0;

  orderForm.setValid(isOrderValid);
  contactsForm.setValid(isContactsValid);

  const orderMessage = orderErrors[0] ?? '';
  const contactsMessage = contactsErrors[0] ?? '';

  orderForm.setErrors(orderMessage);
  contactsForm.setErrors(contactsMessage);
});

events.on('form:change', ({ field, value }) => {
  buyer.setData({ [field]: value });
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

      successView.setTotal(total);
      modal.open(successView.render());
    })
    .catch((error) => {
      console.error('CREATE ORDER ERROR', error);
    });
});


apiService.getProducts()
  .then(data => {
    catalog.setProducts(data.items);
  });