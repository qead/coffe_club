import { ProductTypes } from '../types';

export interface Product {
  url: string;
  title: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  image: string
}

export interface FetchSaleProducts {
  type: ProductTypes.fetchSaleProduts;
  payload: Product[];
}

export interface FetchCategoryProducts {
  type: ProductTypes.fetchCategoryProducts;
  payload: Product[];
}

export interface FetchProductById {
  type: ProductTypes.fetchProductById;
  payload: Product;
}

export interface FetchProductsByIds {
  type: ProductTypes.fetchProductsByIds;
  payload: Product[];
}


export interface FetchProduct {
  type: ProductTypes.fetchProduct;
  payload: Product;
}

export interface FetchProducts {
  type: ProductTypes.fetchProducts;
  payload: Product[];
}
