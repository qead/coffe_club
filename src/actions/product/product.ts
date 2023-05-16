//@ts-nocheck
// import { wooApi } from '../../config';
import getJson from '../../utils/getJson';
import { Dispatch } from 'redux';
import { ProductTypes } from '../types';
import {
	FetchSaleProducts,
	FetchCategoryProducts,
	FetchProductById,
	FetchProductsByIds,
	FetchProduct,
	FetchProducts
} from './product_interfaces';

export const fetchSaleProducts = (itemCount = 4) => {
	return async (dispatch: Dispatch) => {
		try {
			// const response = await wooApi.get(
			// 	`products?per_page=${itemCount}&purchasable=true&on_sale=true`
			// );

			dispatch<FetchSaleProducts>({
				type: ProductTypes.fetchSaleProduts,
				payload: response.data
			});
		} catch (error) {
			console.log(error);
		}
	};
};

export const fetchCategoryProducts = (
	categoryId: string,
	callback?: () => void
) => {
	return async (dispatch: Dispatch) => {
		try {
			// const response = await wooApi.get(`products?category=${categoryId}`);

			dispatch<FetchCategoryProducts>({
				type: ProductTypes.fetchCategoryProducts,
				payload: response.data
			});
			callback();
		} catch (error) {
			console.log(error);
		}
	};
};

export const fetchProductById = (id: string, callback?: () => void) => {
	return async (dispatch: Dispatch) => {
		try {
			// const response = await wooApi.get(`products/${id}`);

			dispatch<FetchProductById>({
				type: ProductTypes.fetchProductById,
				payload: response.data
			});
			callback();
		} catch (error) {
			console.log(error);
		}
	};
};

export const fetchProductsByIds = (ids: string) => {
	return async (dispatch: Dispatch) => {
		try {
			// const response = await wooApi.get(`products?include=${ids}`);

			dispatch<FetchProductsByIds>({
				type: ProductTypes.fetchProductsByIds,
				payload: response.data
			});
		} catch (error) {
			console.log(error);
		}
	};
};

export const fetchProducts = (urls) => {
	console.log('fetchProducts  urls', urls);
	return async (dispatch: Dispatch) => {
		try {
			const response = await getJson('/api/products/getProducts',{urls});
			console.log('fetchProducts response', response);
			if(response.status!==200){
				throw new Error('Ошибка при получении продуктов',url);
			}
			dispatch<FetchProducts>({
				type: ProductTypes.fetchProducts,
				payload: response.result
			});
		} catch (error) {
			console.log(error);
		}
	};
};

export const fetchProduct = (url: string) => {
	console.log('fetchProduct!~@!@#!@ url', url);
	return async (dispatch: Dispatch) => {
		try {
			const response = await getJson('/api/products/getProduct',{url});
			if(response.status!==200){
				throw new Error('Ошибка при получении продукта',url);
			}
			dispatch<FetchProduct>({
				type: ProductTypes.fetchProduct,
				payload: response.result
			});
		} catch (error) {
			console.log(error);
		}
	};
};
