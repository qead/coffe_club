import { combineReducers } from 'redux';
import ProductReducer from './product_reducer';
import CategoryReducer from './category_reducer';
import CartReducer from './cart_reducer';
import AuthReducer from './auth_reducer';

export const rootReducer = combineReducers({
	auth: AuthReducer,
	product: ProductReducer,
	category: CategoryReducer,
	cart: CartReducer
});
export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
