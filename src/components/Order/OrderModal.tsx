import React, { useState } from 'react';
import { Modal, message,Button } from 'antd';
import CheckoutList from '../Cart/Checkout/CheckoutList';
import DeliveryAddress from '../Cart/Checkout/DeliveryAddress';
import  getJson from '../../../utils/getJson';
import { Product } from '../../actions';

interface OrderModalProps {
  visible: boolean;
  hideModal: () => void;
  products: [Product];
  price: number;
}

const OrderModal: React.FC<OrderModalProps> = ({
	visible,
	hideModal,
	products,
	price
}) => {
	console.log('OrderModal products', products);
	return (
		<Modal
			title="Информация о заказе"
			visible={visible}
			closable={false}
			width={750}
			footer={<Button onClick={hideModal}>Закрыть</Button>}
		>
			<CheckoutList products={products} price={price}/>
			{/*<div className="cart-item">
				<DeliveryAddress layout="inline" />
			</div>			 */}
		</Modal>
	);
};

export default OrderModal;
