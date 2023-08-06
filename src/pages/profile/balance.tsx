import { useAuthSelector } from '../../selectors';
import { useState, useEffect } from 'react';
import {
	Form,
	Button,
	message,
	InputNumber,
	Popconfirm
} from 'antd';
import MainLayout from '../../components/Layout';
import getJson from '../../utils/getJson';
import moment from 'moment';
import ModalProp from '../../utils/ModalProp';
moment.locale('ru');
export default function Balance(ctx) {
	const {isAuth} = useAuthSelector();
	// const [state, setState] = useState ({}); 
	const [transferModal, setTransferModal] = useState(false); 
	const [recipientInfo, setRecipientInfo] = useState (null); 
	const [recipientId, setRecipientId] = useState (0); 
	const [amount, setAmount] = useState (0); 
	const [balance, setBalance] = useState ({cash:0,gift:0}); 
	const [loading, setLoading] = useState (false); 
	const getBalance = async()=>{
		const res = await getJson('/api/profile/getBalance');
		if(res?.result){
			setBalance(res.result);
		}
	};
	useEffect (async() => {
		getBalance();
	}, [] );
	const transferCash = async()=>{
		setLoading(true);
		const res = await getJson('/api/profile/transfer-funds', {recipientId, amount}, message);
		if(res.status==200){
			getBalance();
			setAmount(0);
			setRecipientId(0);
		}
		setLoading(false);
	};
	const getInfoFromRecepient = async()=>{
		setLoading(true);
		const res = await getJson('/api/profile/getInfoFromUser', {recipientId});
		setRecipientInfo(res.status==200?('Вы действительно желаете перевести средства на аккаунт с фамилией: '+res.result+'?'):'Не найден');
		setLoading(false);
	};
	const transferCashContent = <Form layout="vertical" disabled={loading}>
		<Form.Item
			label="Id получателя (логин для входа)"
		>
			<InputNumber min={0} placeholder="0" value={recipientId} onChange={value=>setRecipientId(value)}/>
		</Form.Item>
		<Form.Item
			label="Сумма перевода"
		>
			<InputNumber min={1} placeholder="1" value={amount} onChange={value=>setAmount(value)}/>
		</Form.Item>
	</Form>;
	// useEffect(() => form.resetFields(), [state]);
	if(isAuth){
		return (
			<MainLayout>
				<h1>Ваш баланс</h1>
				<p>Основной счет: {balance.cash}</p>
				<p>Подарочный счет: {balance.gift}</p>
				<p>Бизнес-инструменты счет: {balance.businessTools}</p>
				<p>Преображение счет: {balance.transfiguration}</p>
				<Button onClick={getBalance} style={{margin:5}}>Обновить</Button> 
				<Button onClick={()=>setTransferModal(true)} type="primary">Отправить средства</Button> 
				{transferModal&& ModalProp({content:transferCashContent, modalProps: {
					title: 'Перевод средств по id *(логину получателя)',
					footer: [
						<Button key="0" onClick={()=>setTransferModal(false)}>Отмена</Button>,
						<Popconfirm key="1" 
							onOpenChange={getInfoFromRecepient}
							onConfirm={transferCash}
							title={recipientInfo}>
							<Button type="primary">Отправить средства</Button>
						</Popconfirm>
					],
					onCancel: ()=>setTransferModal(false),
					bodyStyle: { paddingBottom: 0 } }
				})}
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