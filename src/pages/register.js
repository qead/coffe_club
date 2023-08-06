import { useState, useEffect } from 'react';

import getJson from '../utils/getJson';
import MainLayout from '../components/Layout';
import PhoneInput from '../components/PhoneInput';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	Form,
	Input,
	Row,
	Col,
	Checkbox,
	DatePicker,
	Button,
	message,
	Alert,
	InputNumber,
	Select
} from 'antd';
import countries from '../lib/countries.json';
// import locale from 'antd/es/date-picker/locale/ru_RU';
// import CountryPhoneInput, { ConfigProvider } from 'antd-country-phone-input';
// import en from 'world_countries_lists/data/countries/en/world.json';

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
export default function RegistrationForm(){
	const router = useRouter();
	const {referrer} = router.query;
	const [loading, setLoading] = useState(false);
	const [referral, setReferral] = useState(null);
	const [form] = Form.useForm();
	const onFinish = async values => {
		console.log('onFinish', values);
		setLoading(true);
		// delete values.agreement;
		try {
			const res = await getJson('/api/auth/register', values, message);
			if(res.status==200){
				form.resetFields();
				message.info('Перейдите на вашу почту, для получения данных входа',7);
				setTimeout(()=>router.push('/login'),4000);
			}else{
				message.error('Ошибка при регистрации');
				// throw new Error(res.result.message||'Неизвестная ошибка');
			}
		} catch (err) {
			console.error('Ошибка при регистрации пользователя:', err);
			message.error(err);
		}
		setLoading(false);
	};
	const changeRef = (e) =>{
		setReferral(e.target.value);
	};
 	return <MainLayout>
		<h1>Страница регистрации</h1>
		<Form
			form={form}
			name="register"
			layout="vertical"
			onFinish={onFinish}
			scrollToFirstError
			loading={loading+''}
			initialValues={{
				'country': 'Russian Federation',
				'id': referrer || null
			}}
			style={{maxWidth:'500px', margin:'25px 0'}}
		>
			<Alert
				message={referrer?'Успешно':'Внимание'}
				description={referrer?'Поздравляем, кажется вы перешли по реферальной ссылке':'Отсутствуют данные реферала для регистрации необходимоо перейти по реф. ссылке действующего партнера'}
				type={referrer?'success':'warning'}
				showIcon
				style={{marginBottom:'25px'}}
			/>
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
			{/* <Form.Item
				name="tel"
				label="Ваш номер телефона"
				rules={[
					{
						required: true,
						message: 'Введите ваш телефонный номер'
					},
					{
						len: 10,
						message: 'Номер телефона БЕЗ +7 (кода страны)'
					}
				]}
			>
				 <ConfigProvider locale={en}>
					<CountryPhoneInput />
				</ConfigProvider> 
			</Form.Item> */}
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
			{/* <Form.Item
				name="city"
				rules={[
					{
						required: true,
						message: 'Введите ваш город'
					}
				]}
			>
				<Input style={{width:'100%'}}  placeholder="Ваш город"/>
			</Form.Item> */}
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
				<DatePicker
					showToday={false}
					showTime={true}
					placeholder='дд.мм.гггг' format='DD.MM.YYYY' style={{width:'100%'}}/>
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
				<Input placeholder="E-mail" />
			</Form.Item>

			{/* <Form.Item
				name="password"
				rules={[
					{
						required: true,
						message: 'Пожалуйста введите пароль!'
					}
				]}
				hasFeedback
			>
				<Input.Password placeholder="Пароль" />
			</Form.Item>
			<Form.Item
				name="confirm"
				dependencies={['password']}
				hasFeedback
				rules={[
					{
						required: true,
						message: 'Пожалуйста повторите пароль!'
					},
					({ getFieldValue }) => ({
						validator(rule, value) {
							if (!value || getFieldValue('password') === value) {
								return Promise.resolve();
							}
							return Promise.reject('Пароли не совпадают!');
						}
					})
				]}
			>
				<Input.Password placeholder="Подтвердите пароль" />
			</Form.Item> */}

			{/* <Form.Item extra="Мы должны убедиться что Вы человек">
					<Row gutter={8}>
						<Col sm={16} xs={10}>
							<Form.Item
								noStyle
								rules={[{ required: true, message: 'Пожалуйста введите капчу!' }]}
							>
								<Input placeholder="Капча" />
							</Form.Item>
						</Col>
						<Col sm={8} xs={14}>
							<Button style={{ width: '100%' }} type="primary">Получить капчу</Button>
						</Col>
					</Row>
				</Form.Item> */}
			
			<Form.Item style={{visibility:'hidden'}} extra="Согласно нашей политике, регистрация только с помощью рефералов, если вы перешли по реферальной ссылке не меняйте даннное значение">
				<Form.Item
					label={referrer?'Реферальный код уже успешно введен!':'Реферальный код'}
					name="id"
					rules={[
						{ required: true, message: 'Пожалуйста укажите реферала!' }
						// ({ getFieldValue }) => ({
						// 	validator(rule, value) {
						// 		if (!value || 24 === value.length) {
						// 			return Promise.resolve();
						// 		}
						// 		return Promise.reject('Введите корректный id');
						// 	}
						// })
					]}
				>
					<Input disabled={referrer} value={referral} onChange={changeRef}  style={{width:'100%'}}/>
				</Form.Item>
				{/* {(referralInfo?.length)&&<span>имя и фамилия реф-ла: {referralInfo}</span>} */}
				{/* <Col sm={8} xs={14}>
							<Button style={{ width: '100%' }} type="primary" onClick={checkRefferal} loading={loading}>Проверить</Button>
						</Col> */}
			</Form.Item>
			<Form.Item
				name="agreement"
				valuePropName="checked"
				rules={[
					{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Примите условия соглашения') }
				]}
				{...tailFormItemLayout}
			>
				<Checkbox>
						Я согласен с условиями <Link href="/terms">соглашения</Link>
				</Checkbox>
			</Form.Item>
			<Form.Item {...tailFormItemLayout}>
				<Button type="primary" htmlType="submit">
						Зарегистрироваться
				</Button>
			</Form.Item>
		</Form>
	</MainLayout>;
}

export const getServerSideProps = async function ({ req, res }){
	// Get the user's session based on the request
	const isAuth = !!req?.cookies?.token;
	if (isAuth) {
	  return {
			redirect: {
				destination: '/profile',
				permanent: false
			}
	  };
	}
	return {
	  props: {isAuth}
	};
};