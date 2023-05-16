import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Row, Col } from 'antd';
import MainLayout from '../../components/Layout';

import CartListRenderer from '../../components/Cart/CartListRenderer';
import { useCartSelector, useProductSelector } from '../../selectors';
import OrderSummary from '../../components/Cart/OrderSummary';
import { CartContext, SkeletonListContext, Breakpoints } from '../../contexts';
import { fetchProducts } from '../../actions';
import { calculateTotalPrice, getCartUrls } from '../../helpers';
import './cart.less';
const Cart = () => {
	const test = useCartSelector();
	const { items, totalItems }  = test;
	const { cartProducts } = useProductSelector();
	console.log('useProductSelector cartProducts', cartProducts);
	const itemsLength = items.length;

	const [totalPrice, setTotalPrice] = useState(0);

	const dispatch = useDispatch();

	useEffect(() => {
		console.log('items', items,'itemsLength',itemsLength);
		if (itemsLength > 0) {
			const cartItemIds = getCartUrls(items);
			console.log('getCartUrls', getCartUrls);
			dispatch(fetchProducts(cartItemIds));
		}
	}, [itemsLength]);

	useEffect(() => {
		setTotalPrice(calculateTotalPrice(items));
	});
	return (
		<CartContext.Provider
			value={{
				totalPrice
			}}
		>
			<SkeletonListContext.Provider
				value={{ xl: 14, lg: 24, md: 24, sm: 24, xs: 24 }}
			>
				<MainLayout title={'Корзина'} balance>
					<Row className="cart-wrapper boxed-width">
						<Col xl={14} lg={24} md={24} sm={24} xs={24}>
							<CartListRenderer
								cartProducts={cartProducts}
								totalItems={totalItems}
							/>
						</Col>
						<Col xl={10} lg={24} md={24} sm={24} xs={24}>
							<OrderSummary
								cartProducts={cartProducts}
								totalItems={totalItems}
							/>
						</Col>
					</Row>
				</MainLayout>
			</SkeletonListContext.Provider>
		</CartContext.Provider>
	);
};

export default Cart;
