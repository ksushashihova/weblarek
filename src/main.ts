import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiService } from './components/Services/ApiService';


const catalog = new ProductCatalog();

catalog.setProducts(apiProducts.items);
console.log('Каталог:', catalog.getProducts());
const found = catalog.getProductById(apiProducts.items[0].id);
console.log('Найден товар:', found);
catalog.setSelectedProduct(apiProducts.items[1]);
console.log('Выбранный товар:', catalog.getSelectedProduct());


const basket = new Basket();

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('После добавления:', basket.getItems());
console.log('Есть товар 0:', basket.hasItem(apiProducts.items[0].id));
console.log('Количество:', basket.getTotalCount());
console.log('Сумма:', basket.getTotalPrice());
basket.removeItem(apiProducts.items[0]);
console.log('После удаления:', basket.getItems());
basket.clear();
console.log('После очистки:', basket.getItems());

const buyer = new Buyer();

buyer.setData({ email: 'test@test.com' });
console.log('Частичные данные:', buyer.getData());
buyer.setData({ phone: '123456789' });
console.log('После добавления телефона:', buyer.getData());
console.log('Ошибки:', buyer.validate());
buyer.setData({
  payment: 'card',
  address: 'Москва'
});
console.log('Полные данные:', buyer.getData());
console.log('Ошибки после заполнения:', buyer.validate());
buyer.clear();
console.log('После очистки:', buyer.getData());


const api = new Api(import.meta.env.VITE_API_ORIGIN);
const apiService = new ApiService(api);


apiService.getProducts()
  .then((data) => {
    console.log('С сервера:', data);

    catalog.setProducts(data.items);

    console.log('Каталог из сервера:', catalog.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });