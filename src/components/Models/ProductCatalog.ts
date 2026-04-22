import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setProducts(items: IProduct[]) {
    
  this.products = items.map(item => ({
    ...item,
    image: `https://larek-api.nomoreparties.co${item.image}`
  }));

  this.events.emit('catalog:changed');
}

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('preview:changed', this.selectedProduct);
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}