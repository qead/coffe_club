import React, { useEffect, useState } from 'react';
import { Modal, message,Alert } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import CheckoutList from './CheckoutList';
// import DeliveryAddress from './DeliveryAddress';
import { useProductSelector,useCartSelector } from '../../../selectors';
import { cleanCart } from '../../../actions';
import  getJson from '../../../utils/getJson';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

interface CheckoutSummaryProps {
  visible: boolean;
  hideModal: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
	visible,
	hideModal
}) => {
	const router = useRouter();
	const dispatch = useDispatch();
	const [subPrice, setSubPrice] = useState(false);
	const { cartProducts } = useProductSelector();
	const { items } = useCartSelector();

	const paySub  = async() =>{
		const response = await getJson('/api/profile/userAccountPayment',{},message);
		if(response.status==200){
			setSubPrice(false);
		}
	};
	const onOk  = async() =>{
		const response = await getJson('/api/profile/createOrder',{items},message);
		if(response.status==200){
			// message.success('Ваш заказ успешно сформирован!');
			router.push('/shop/success_order');
			dispatch(cleanCart());
			hideModal();
		}else if(response.status==403){
			setSubPrice(response?.result?.price||0);
		}else{
			message.error('Ошибка при отправке заказа попробуйте позже или обратитесь к менеджеру.');
		}
	};
	return (
		<Modal
			title={subPrice?'Оплата ЛК':'Оформление заказа'}
			visible={visible}
			onOk={subPrice?paySub:onOk}
			okText={subPrice?'Оплатить подписку':'Оформить заказ'}
			onCancel={hideModal}
			closable={false}
			width={750}
		>
			{
				subPrice
					?<Alert showIcon description={`Оплатите ${subPrice} и получите полный доступ к нашей продукции, а также станьте частью нашей команды, чтобы зарабатывать вместе с нами!`} message={'Оплатите обслуживание личного кабинета и получите возможность наслаждаться нашей продукцией и зарабатываеть!'}icon={<StarOutlined/>}/>
					:<CheckoutList products={cartProducts} />
			}
			{/* <div className="cart-item">
				<DeliveryAddress layout="inline" fields={fields} onChange={values=>setFields(values)}/>
			</div>			 */}
		</Modal>
	);
};

export default CheckoutSummary;
