import { IApi, IProductsResponse, IOrder, IOrderResponse } from '../../types';

export class ApiService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
  return this.api.get<IProductsResponse>('/api/weblarek/product/');
}

    createOrder(order: IOrder): Promise<IOrderResponse> {
  return this.api.post<IOrderResponse>('/api/weblarek/order/', order);
}
}