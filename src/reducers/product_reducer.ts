import {
	ProductTypes,
	Product,
	FetchSaleProducts,
	FetchCategoryProducts,
	FetchProductById,
	FetchProductsByIds,
	fetchProduct,
	fetchProducts
} from '../actions';

type Actions =
  | FetchSaleProducts
  | FetchCategoryProducts
  | FetchProductById
  | FetchProductsByIds
  | FetchProduct
  | FetchProducts

export interface ProductState {
  saleProducts: Product[];
  categoryProducts: Product[];
  currentProduct?: Product;
  cartProducts: Product[];
}

export const initialState: ProductState = {
	saleProducts: [],
	categoryProducts: [],
	cartProducts: [],
	currentProduct: undefined
};

export default function(state = initialState, action: Actions) {
	switch (action.type) {
	case ProductTypes.fetchSaleProduts:
		return {
			...state,
			saleProducts: action.payload
		};
	case ProductTypes.fetchCategoryProducts:
		return { ...state, categoryProducts: action.payload };
	case ProductTypes.fetchProductById:
		return { ...state, currentProduct: action.payload };
	case ProductTypes.fetchProductsByIds:
		return { ...state, cartProducts: action.payload };
	case ProductTypes.fetchProduct:
		return { ...state, currentProduct: action.payload };
	case ProductTypes.fetchProducts:
		return { ...state, cartProducts: action.payload };
	default:
		return state;
	}
}
