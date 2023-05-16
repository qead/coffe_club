import { useState,useEffect } from 'react';
import getJson from '../../utils/getJson';
import {Button, message, Col, Form, Space,Input,InputNumber} from 'antd';
import {MinusCircleOutlined,PlusOutlined} from '@ant-design/icons';
import MainLayout from '../../components/Layout';
import AdminLayout from '../../components/AdminLayout';
export  function getServerSideProps ({ req, res }){
	const isAuth = !!req?.cookies?.token;
	const isAdmin = !!req?.cookies?.isAdmin;
	if (!isAuth||!isAdmin) {
	  return {
			redirect: {
				destination: '/404',
				permanent: false
			}
	  };
	}
	return {
	  props: {isAuth, isAdmin}
	};
}
export default function AdminPanel(ctx:any){
	const [giftAccount, setGiftAccount] = useState (0); 
	const [unProcOrders, setUnProcOrders] = useState (0); 
	const [cashForm] = Form.useForm();
	const setValue = (value) => {
		cashForm.setFieldsValue(value);
	};
	useEffect (async() => { 
		const marketing =await getJson('/api/admin/getMarketing');
		if(marketing.status !==  200 ){
			return message.warning('Не удалось получить данные маркетинга');
		}
		setValue(marketing.result);
		const orders =await getJson('/api/admin/getUnProcessedOrders');
		if(orders.status !==  200 ){
			return message.warning('Не удалось получить количество необработанных ордеров');
		}
		setUnProcOrders(orders.result);
		console.log('orders result', orders);
		
	}, [] );
	const processReferralPayments = async ()=>{
		const {status} = await getJson('/api/admin/processReferralPayments');
		status == 200?message.success('Данные успешно обновленны!'):message.error('Ошибка при обновлении данных');
	};
	const updateMarketing= async marketing =>{
		const {status} = await getJson('/api/admin/editMarketing',marketing,false);
		status == 200?message.success('Данные успешно обновленны!'):message.error('Ошибка при обновлении данных');
	};
	const parser = (value) => value!.replace('%', '');
	const formatter = (value) => `${value}%`;
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout>
			<h1>Маркетинг</h1>
			<Button onClick={processReferralPayments} type='primary'>Обработать заказы {unProcOrders}</Button>
			<Form
				form={cashForm}
				name="dynamic_form_complex"
				onFinish={updateMarketing}
				style={{ maxWidth: 500 }}
				autoComplete="off"
			>
				<Form.Item
					name="activityPrice"
					label="Минимальная сумма активности"
				>
					<InputNumber min={0} defaultValue={0} />
				</Form.Item>
				<Form.Item
					name="subscriptionPrice"
					label="Обслуживание личного кабинета"
				>
					<InputNumber min={0} defaultValue={0} />
				</Form.Item>
				<Form.Item
					name="giftAccount"
					label="Процент на подарочный счет"
				>
					<InputNumber min={0} max={100} parser={parser} formatter={formatter} defaultValue={0} />
				</Form.Item>
				<Form.List name="masterAccount">
					{(fields, { add, remove }) => (
						<>
							{fields.map((field,i) => (
								<Space key={field.key} align="baseline">
									{console.log('field', field)}
									<Form.Item
										label="Глубина"
										name={[field.name, 'depth']}
									>
										<InputNumber defaultValue={i+1} disabled/>
									</Form.Item>
									<Form.Item
										{...field}
										label="Процент"
										name={[field.name, 'percent']}
										rules={[{ required: true, message: 'Введите процент' }]}
									>
										<InputNumber min={0} max={100} parser={parser} formatter={formatter} defaultValue={0} />
									</Form.Item>
									{field.key+1==fields.length?<MinusCircleOutlined onClick={() => remove(field.name)} />:''}
								</Space>
							))}

							<Form.Item>
								<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
									Добавить уровень
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
				<Form.Item>
					<Button type="primary" htmlType="submit">
								Сохранить
					</Button>
				</Form.Item>
			</Form>
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
