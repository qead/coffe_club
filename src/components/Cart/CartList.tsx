import React from 'react';
import CartItem from './CartItem';
import { Product } from '../../actions';

interface CartListProps {
  products: Product[];
}

const CartList: React.FC<CartListProps> = ({ products }) => {
	return (
		<div className="cart-list">
			{products.map((product) => {
				return <CartItem product={product} key={product.url} />;
			})}
		</div>
	);
};

export default CartList;
