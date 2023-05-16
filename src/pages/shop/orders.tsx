import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { Row, Col,Card, message, Alert, Tag, Button } from 'antd';
import getJson from '../../utils/getJson';
import MainLayout from '../../components/Layout';
import moment from 'moment';
import OrderModal from '../../components/Order/OrderModal';
const { Meta } = Card;
const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [monthSpend, setMonthSpend] = useState({activityPrice:0,amount:0});
	const [currentOrder, setCurrentOrder] = useState(null);
	const changeAddress = () =>{
		console.log('changeAddress');
	};
	const  getMonthSpend = async()=>{
		const {result, status} = await getJson('/api/profile/getMonthSpend');
		console.log('result', result);
		if(status!==200){
			return message.error('Не удалось получить потраченную сумму за месяц');
		}else{
			setMonthSpend(result);
		}
	};
	const  getOrders = async()=>{
		const {result, status} = await getJson('/api/profile/getOrders');
		if(status!==200){
			return message.error('Не удалось получить список заказов');
		}
		setOrders(result);
	};
	useEffect(async() => {
		getOrders();
		getMonthSpend();
	}, []);
	let alertInfo={};
	if(monthSpend.amount<monthSpend.activityPrice){
		alertInfo={
			message:'В этом месяце вы не сделали покупок',
			description:`В этом месяце потрачено: ${monthSpend.amount}, минимальная сумма для поддержания активности: ${monthSpend.activityPrice}`,
			type:'warning'
		};
	}else if(monthSpend.amount>=monthSpend.activityPrice){
		alertInfo={
			message:'Вы набрали минимум покупок в этом месяце, продолжайте в том же духе!',
			description:`В этом месяце потрачено: ${monthSpend.amount}, минимальная сумма для поддержания активности: ${monthSpend.activityPrice}`,
			type:'success'
		};
	}
	
	return (<MainLayout title='Мои заказы'>
		<Alert
			{...alertInfo}
			showIcon
			closable
			style={{marginBottom:20}}
		/>
		<Row gutter={[16,16]}>
			{orders.map((order,i)=>
				<Col key={i} xxl={6} xl={8} lg={12} xs={24}>
					<Card title={'Заказ от '+moment(order.createdAt).format('LLL')} bordered={false} >
						<p>Статус: <Tag color={order.status=='доставлен'?'success':'processing'}>{order.status}</Tag></p>
						<Meta
							title={'Сумма заказа: '+order.price}
							description={'Количество товаров: '+order.products.length}
						/>
						<Button onClick={()=>setCurrentOrder(i)} style={{margin:'25px auto 0 auto'}}>Просмотреть</Button>
					</Card>
				</Col>)
			}
			<OrderModal  
				visible={!isNaN(parseFloat(currentOrder))}
				hideModal={() => setCurrentOrder(null)}
				products={orders[currentOrder]?.products}
				price={orders[currentOrder]?.price}
			/>
		</Row>
	</MainLayout>
	);
};

export default Orders;
