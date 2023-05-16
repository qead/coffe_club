import Cookies from 'js-cookie';
import { Dispatch } from 'redux';
import { CartTypes } from '../types';
import {
	AddToCart,
	RemoveFromCart,
	UpdateCartItemCount,
	CleanCart
} from './cart_interfaces';

export const addToCart = (url: string, price: string, count = 1) => {
	return (dispatch: Dispatch) => {
		dispatch<AddToCart>({
			type: CartTypes.addToCart,
			payload: { url, price, count }
		});
	};
};

export const removeFromCart = (url: string) => {
	return (dispatch: Dispatch) => {
		dispatch<RemoveFromCart>({
			type: CartTypes.removeFromCart,
			payload: url
		});
	};
};

export const updateCartItemCount = (
	url: string,
	price: string,
	count: number
) => {
	return (dispatch: Dispatch) => {
		dispatch<UpdateCartItemCount>({
			type: CartTypes.updateCartItemCount,
			payload: { url, price, count }
		});
	};
};

export const cleanCart = () => {
	return (dispatch: Dispatch) => {
		dispatch<CleanCart>({
			type: CartTypes.cleanCart
		});
	};
};
