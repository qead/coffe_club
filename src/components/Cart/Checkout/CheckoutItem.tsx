import React from 'react';
import Link from 'next/link';
import { Product } from '../../../actions';
import { useCartSelector } from '../../../selectors';
import { getCartItemCount } from '../../../helpers';
import ProductInfo from '../ProductInfo';

interface CheckoutItemProps {
  product: Product;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ product }) => {
	const { items } = useCartSelector();
	const { url, price, count } = product;

	const product_id = `${url}`;
	const totalItemCount = !isNaN(count)?count:getCartItemCount(items, product_id);
	const subtotal = parseFloat(price) * totalItemCount;

	return (
		<div className="cart-item">
			<ProductInfo product={product} />
			<div className="quantity">{totalItemCount}</div>
			<div className="subtotal">₱{subtotal}</div>
		</div>
	);
};

export default CheckoutItem;
