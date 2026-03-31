import { IApi, IProduct, IOrder } from '../../types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<{ items: IProduct[] }> {
    return this.api.get('/product/');
  }

  createOrder(order: IOrder): Promise<{ total: number }> {
    return this.api.post('/order/', order);
  }
}