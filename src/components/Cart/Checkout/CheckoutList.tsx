import React from 'react';
import CheckoutItem from './CheckoutItem';
import { Product } from '../../../actions';
import { CartContext } from '../../../contexts';
import './CheckoutList.less';

interface CheckoutListProps {
  products: Product[];
}

const CheckoutList: React.FC<CheckoutListProps> = ({ products, price}) => {
	const { totalPrice } = React.useContext(CartContext);

	return (
		<div className="checkout-list">
			<div className="table-heading">
				<div>Всего в заказе</div>
				<div>Количество</div>
				<div>Подытог</div>
			</div>
			{products.map((product) => {
				return <CheckoutItem product={product} key={product.url} />;
			})}
			<div className="overall-total-price">
				<div>
          			Общий счет: <span>{price||totalPrice}</span>
				</div>
			</div>
		</div>
	);
};

export default CheckoutList;
