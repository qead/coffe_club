import React from 'react';
import { notification, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import Link from 'next/link';
import router from 'next/router';

const cartNotification = () => {
	const key = `open${Date.now()}`;
	const btn = (
		<Button
			type="primary"
			size="small"
			onClick={() => {router.push('/shop/cart');notification.close(key);}}
		>
			Перейти в корзину
		</Button>
	);
	notification.open({
		message: 'Товар добавлен в корзину',
		description:'Вы успешно товар в корзину. Для покупки товара перейдите в корзину.',
		icon: <SmileOutlined style={{ color: '#108ee9' }} />,
		top: 50,
		duration: 5,
		btn,
		key
	});
};

export default cartNotification;
