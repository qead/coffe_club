// import getJson from '../../utils/getJson';
// import { Dispatch } from 'redux';
// import { OrderTypes } from '../types';
// import {
// 	FetchProducts
// } from './order_interfaces';

// export const sendOrder = (cartItems) => {
// 	console.log('cartItems', cartItems);
// 	return async (dispatch: Dispatch) => {
// 		try {
// 			const response = await getJson('/api/order/neworder',{cartItems});
// 			console.log('fetchneworder response', response);
// 			if(response.status!==200){
// 				throw new Error('Ошибка при получении продуктов',cartItems);
// 			}
// 			dispatch<FetchProducts>({
// 				type: OrderTypes.addOrder,
// 				payload: response.result
// 			});
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	};
// };
