import { useAuthSelector } from '../../selectors';
import { useState, useEffect } from 'react';
import {
	Select,
	Table,
	Row,
	Col,
	Tooltip,
	DatePicker,
	Button,
	message,
	Pagination,
	Tag,
	Modal,
	Alert
} from 'antd';
import { TransactionOutlined, UsergroupAddOutlined,GiftOutlined,ShoppingOutlined,StarOutlined} from '@ant-design/icons';
import MainLayout from '../../components/Layout';
import getJson from '../../utils/getJson';
import copyText from '../../utils/copyText';
import moment from 'moment';
import GetRefs from '../../components/profile/GetRefs';
import OrderModal from '../../components/Order/OrderModal';
const getTagTransaction = type =>{
	if(type=='transfer'){
		return <Tag color="purple" icon={<TransactionOutlined />}>Перевод</Tag>;
	} else if(type=='cashErned'){
		return <Tag color="gold" icon={<UsergroupAddOutlined />}>Начисления с реф.</Tag>;
	} else if(type=='giftErned'){
		return <Tag color="green" icon={<GiftOutlined />}>Подарочный счет</Tag>;
	}else if(type=='purchase'){
		return <Tag color="blue" icon={<ShoppingOutlined />}>Покупка</Tag>;
	}else if(type=='gift_purchase'){
		return <Tag color="yellow" icon={<ShoppingOutlined />}>Покупка с подарочного</Tag>;
	}else if(type=='subscription'){
		return <Tag color="geekblue" icon={<StarOutlined />}>Оплата лк</Tag>;
	}else {
		return type;
	}
};
const getModalBoody = (transactionModal)=>{
	let senderDesctiption,recipientDesctiption;
	if(transactionModal.sender.name){
		senderDesctiption=<ul style={{listStyle:'none',padding: 0}}>
			<li>id: {transactionModal.sender.id}</li>
			<li>Имя: {transactionModal.sender.name}</li>
			<li>Фамилия: {transactionModal.sender.surname}</li>
		</ul>;
	}
	if(transactionModal.recipient.name){
		recipientDesctiption=<ul style={{listStyle:'none',padding: 0}}>
			<li>id: {transactionModal.recipient.id}</li>
			<li>Имя: {transactionModal.recipient.name}</li>
			<li>Фамилия: {transactionModal.recipient.surname}</li>
		</ul>;
	}
	return (<>
		{getTagTransaction(transactionModal.type)}
		<div style={{width:'100%', display:'flex', flexWrap:'wrap', marginTop:20}}>
			<Alert
				style={{width:'50%', minWidth:160}}
				message="От кого"
				description={senderDesctiption||transactionModal.sender}
				type="info"
			/>
			<Alert
				style={{width:'50%', minWidth:160}}
				message="Кому"							
				description={recipientDesctiption||transactionModal.recipient}
				type="success"
			/>
		</div>
	</>);
};
const { RangePicker } = DatePicker;
export default function Profile(ctx) {
	const {isAuth} = useAuthSelector();
	const [data, setData] = useState ([]); 
	const [count, setCount] = useState (0); 
	const [page, setPage] = useState (1); 
	const [range, setRange] = useState ([]); 
	const [transaction, setTransaction] = useState (null); 
	const [currentOrder, setCurrentOrder] = useState ({}); 
	const [transactionModal, setTransactionModal] = useState ({}); 
	const PAGE_SIZE=10;
	const filterOptions = [
		{label:'Все транзакции', value:''},
		{label:'Покупки', value:'purchase'},
		{label:'Покупки с подарочного', value:'gift_purchase'},
		{label:'Переводы', value:'transfer'},
		{label:'Рефералы', value:'cashErned'},
		{label:'Оплата лк', value:'subscription'},
		{label:'Подарочный', value:'giftErned'}
	];
	const getDataFromTransaction =(transaction) =>{
		const {type} = transaction;
		switch (type) {
		case 'purchase':
			getOrderData(transaction.order);
			break;
		case 'gift_purchase':
			getOrderData(transaction.order);
			break;
		default:
			getTransactionInfo(transaction._id);
			break;
		}
	};
	const columns: ColumnsType<DataType> = [
		{
			title: 'Дата',
			dataIndex: 'date',
			render:date=>moment(date).format('llll')
		},
		{
			title: 'Тип транзакции',
			dataIndex: 'type',
			render:getTagTransaction
		},
		{
			title: 'Сумма',
			dataIndex: 'amount'
		},
		{
			title: 'Действие',
			key: 'operation',
			fixed: 'right',
			width: 120,
			render: (transaction) => <Button type='primary' size='small' onClick={()=>getDataFromTransaction(transaction)}>Подробнее</Button>
		}
	];
	useEffect (async() => {
		getData();
	}, [page,transaction,range] );
	const getOrderData = async(order)=>{
		if(!order){
			return message.error('Нет данных по данному заказу');
		}
		const res = await getJson('/api/profile/getOrders',{order});
		if(res.status!=200){
			message.error('Ошибка при получении данных по заказу');
		}else{
			if(!res.result.length){
				message.error('Данные по покупке не найденны');
			}else{
				const [data] = res.result;
				setCurrentOrder(data);
			}
			// const {transactions, count} = res.result;
			// setData(transactions);
			// setCount(count);
		}
	};
	// const getSubscriptionData = async(order)=>{
	// 	if(!order){
	// 		return message.error('Нет данных по данному заказу');
	// 	}
	// 	const res = await getJson('/api/profile/getOrders',{order});
	// 	if(res.status!=200){
	// 		message.error('Ошибка при получении данных по заказу');
	// 	}else{
	// 		if(!res.result.length){
	// 			message.error('Данные по покупке не найденны');
	// 		}else{
	// 			const [data] = res.result;
	// 			setCurrentOrder(data);
	// 		}
	// 		// const {transactions, count} = res.result;
	// 		// setData(transactions);
	// 		// setCount(count);
	// 	}
	// };
	const getData = async ()=>{
		const skip = PAGE_SIZE*page-PAGE_SIZE;
		const res = await getJson('/api/profile/getTransactions',{skip,transactionType:transaction,dateRange:range});
		if(res.status!=200){
			message.error('Ошибка при получении данных');
		}else{
			const {transactions, count} = res.result;
			setData(transactions);
			setCount(count);
		}
	};
	const getTransactionInfo = async (_id)=>{
		const res = await getJson('/api/profile/getTransactionInfo',{_id});
		console.log('res', res);
		if(res.status!=200){
			message.error('Ошибка при получении иформации по транзакции');
		}else{
			setTransactionModal(res.result);
		}
	};
	const changePagination = (page) =>{
		setPage(page);
	};
	const selectFilter = (value)=>{
		setPage(1);
		setTransaction(value);
	};
	const selectRange = (value, arrString)=>{
		if(!value){
			arrString='';
		}
		setTransaction(value);
		setRange(arrString);
	};
	if(isAuth){
		return (
			<MainLayout>
				<h1>История транзакций</h1>
				<RangePicker onChange={selectRange} showTime/>
				<Select placeholder="Выбрать фильтр" value={transaction} options={filterOptions} onChange={selectFilter}/>
				<Table
					style={{margin:'20px 0'}} 
					scroll={{x:600}}
					pagination={false}
					columns={columns}
					dataSource={data}
					bordered
				/>
				<Pagination current={page} total={count} pageSize={PAGE_SIZE} onChange={changePagination}/>
				<OrderModal  
					visible={Object.keys(currentOrder).length}
					hideModal={() => setCurrentOrder({})}
					products={currentOrder?.products}
					price={currentOrder?.price}
				/>
				{Object.keys(transactionModal).length?<Modal
					title="Информация о транзакции"
					visible={true}
					closable={false}
					width={750}
					footer={<Button onClick={()=>setTransactionModal({})}>Закрыть</Button>}
				>
					{getModalBoody(transactionModal)}
				</Modal>:null}
			</MainLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
export const getServerSideProps = async function ({ req, res }){
	// Get the user's session based on the request
	const isAuth = !!req?.cookies?.token;
	if (!isAuth) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
	return {
		props: {isAuth}
	};
};