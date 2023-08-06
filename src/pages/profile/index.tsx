import { useAuthSelector } from '../../selectors';
import { useState, useEffect } from 'react';
import {
	Form,
	Input,
	Row,
	Col,
	Tooltip,
	DatePicker,
	Button,
	message,
	Select
} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout';
import PhoneInput from '../../components/PhoneInput';
import getJson from '../../utils/getJson';
import countries from '../../lib/countries.json';
import copyText from '../../utils/copyText';
import moment from 'moment';
import GetRefs from '../../components/profile/GetRefs';

const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0
		},
		sm: {
			span: 24,
			offset: 8
		}
	}
};
moment.locale('ru');
const dateFromObjectId = function (objectId) {
	return moment(parseInt(objectId.substring(0, 8), 16) * 1000).format('lll');
};
export default function Profile(ctx) {
	const [form] = Form.useForm();
	const {isAuth} = useAuthSelector();
	const [state, setState] = useState ({}); 
	const [disabled, setDisabled] = useState (true); 
	const [loading, setLoading] = useState (false); 
	useEffect ( async() => {
		setLoading(true);
		const userInfo = await getJson('/api/profile/getUser');
		if(userInfo?.result){
		 	setState(userInfo.result);
		}
		setLoading(false);
	}, [] );
	useEffect(() => form.resetFields(), [state]);
	const updateUserData = async(data) =>{
		setLoading(true);
		await getJson('/api/profile/updateUser',data,message);
		setLoading(false);
	};
	if(isAuth){
		return (
			<MainLayout>
				<h1>Профиль</h1>
				<Button type='primary' onClick={()=>setDisabled(false)}>Хочу изменить свои данные</Button>
				<Form
					disabled={disabled}
					form={form}
					name="register"
					layout="vertical"
					onFinish={updateUserData}
					scrollToFirstError
					loading={loading}
					initialValues={state.name&&{
						'id': state.id,
						'register': dateFromObjectId(state._id),
						'name': state.name,
						'surname': state.surname,
						'tel':state.tel,
						'country': state.country,
						'city': state.city,
						'birthDate': moment(state.birthDate),
						'email': state.email
					}}
					style={{maxWidth:'500px', margin:'25px 0'}}
				>
					<Form.Item
						name="id"
						label="Ваш уникальный айди"
					>
						<Input disabled placeholder="0" />
					</Form.Item>
					<Form.Item
						name="register"
						label="Дата регистрации"
					>
						<Input disabled placeholder="0" />
					</Form.Item>
					<Form.Item
						label="Дата вашего рождения"
						name="birthDate"
						rules={[
							{
								required: true,
								message: 'Введите вашу дату рождения!'
							}
						]}
					>
						<DatePicker disabled placeholder='дд.мм.гггг' format='DD.MM.YYYY' style={{width:'100%'}}/>
					</Form.Item>
					<Form.Item
						label="Ваша электронная почта"
						name="email"
						rules={[
							{
								type: 'email',
								message: 'Введите корректный E-mail!'
							},
							{
								required: true,
								message: 'Введите ваш E-mail!'
							},
							{
								validator: (_, value) =>!value.includes(' ')? Promise.resolve(): Promise.reject(new Error('Уберите пустые пробелы из поля для ввода'))
							}
						]}
					>
						<Input disabled placeholder="E-mail" />
					</Form.Item>
					<Form.Item
						name="name"
						label="Ваше имя"
						rules={[
							{
								required: true,
								message: 'Введите ваше имя!'
							},
							{
								validator: (_, value) =>!value.includes(' ')? Promise.resolve(): Promise.reject(new Error('Уберите пустые пробелы из поля для ввода'))
							}
						]}
					>
						<Input placeholder="Иван" />
					</Form.Item>
					<Form.Item
						name="surname"
						label="Ваша фамилия"
						rules={[
							{
								required: true,
								message: 'Введите вашу фамилию!'
							},
							{
								validator: (_, value) =>!value.includes(' ')? Promise.resolve(): Promise.reject(new Error('Уберите пустые пробелы из поля для ввода'))
							}
						]}
					>
						<Input placeholder="Ваша Фамилия" />
					</Form.Item>
					<PhoneInput />
					<Form.Item
						label="Выберите вашу страну"
						name="country"
						rules={[
							{
								required: true,
								message: 'Введите вашу страну'
							}
						]}
					>
						<Select
							showSearch
							style={{width:'100%'}}
							options={countries}
						/>
						{/* <Input style={{width:'100%'}} placeholder="Росси"/> */}
					</Form.Item>
					<Form.Item
						name="city"
						rules={[
							{
								required: true,
								message: 'Введите ваш город'
							}
						]}
					>
						<Input style={{width:'100%'}}  placeholder="Ваш город"/>
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button type="primary" htmlType="submit">
							Обновить данные
						</Button>
					</Form.Item>
				</Form>
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