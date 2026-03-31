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

const basket = new Basket();
basket.addItem(apiProducts.items[0]);
console.log('Корзина:', basket.getItems());

const buyer = new Buyer();
buyer.setData({ email: 'test@test.com' });
console.log('Покупатель:', buyer.getData());
console.log('Ошибки:', buyer.validate());

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');
const apiService = new ApiService(api);


apiService.getProducts().then((data) => {
  console.log('С сервера:', data);
  catalog.setProducts(data.items);
  console.log('Каталог из сервера:', catalog.getProducts());
});