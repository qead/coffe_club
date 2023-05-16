import {
	Cart,
	RemoveFromCart,
	AddToCart,
	CartTypes,
	UpdateCartItemCount
} from '../actions';
import {
	getTotalItemsCookie,
	getCartCookieArr,
	getItemIndex,
	updateCartItemCount,
	saveToCartCookie,
	removeItem
} from '../helpers';

type Actions = AddToCart | RemoveFromCart | UpdateCartItemCount | CartTypes.cleanCart;

export interface CartState {
  totalItems: number;
  items: Cart[];
}

export const initialState: CartState = {
	totalItems: getTotalItemsCookie(),
	items: getCartCookieArr()
};

export default function(state = initialState, action: Actions) {
	switch (action.type) {
	case CartTypes.addToCart:
		const cartItem2 = action.payload;
		const index2 = getItemIndex(state.items, cartItem2.url);
		const currentItems2 = state.items;
		let cartItems2: Cart[] = [];
		// if item already exists increase count
		if (index2 > -1) {
			cartItems2 = updateCartItemCount(
				[...currentItems2],
				index2,
				cartItem2.count
			);
		} else {
			cartItems2 = [...currentItems2, action.payload];
		}
		saveToCartCookie(cartItems2);

		return { ...state, items: cartItems2, totalItems: cartItems2.length };

	case CartTypes.updateCartItemCount:
		const cartItem = action.payload;
		const index = getItemIndex(state.items, cartItem.url);
		const currentItems = state.items;

		let cartItems: Cart[] = [];

		// if item already exists increase count
		if (index > -1) {
			cartItems = updateCartItemCount(
				[...currentItems],
				index,
				cartItem.count
			);
		} else {
			cartItems = [...currentItems, action.payload];
		}

		saveToCartCookie(cartItems);

		return { ...state, items: cartItems, totalItems: cartItems.length };

	case CartTypes.removeFromCart:
		const item = action.payload;
		const items = [...state.items];
		const filteredItems = removeItem(items, item);
		saveToCartCookie(filteredItems);

		return {
			...state,
			items: filteredItems,
			totalItems: filteredItems.length
		};
		
	case CartTypes.cleanCart:
		saveToCartCookie([]);
		return {
			...state,
			items: [],
			totalItems: 0
		};

	default:
		return state;
	}
}
