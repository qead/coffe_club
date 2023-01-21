import { useState, useEffect } from 'react';
import getJson from '../utils/getJson';
import MainLayout from '../components/Layout';
import { useRouter } from 'next/router';
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
	InputNumber
} from 'antd';
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
	const [referralInfo, setReferralInfo] = useState(null);
	let onFinish = async values => {
		setLoading(true);
		delete values.agreement;
		delete values.confirm;
		try {
			let res = await getJson('/api/auth/register', values, message);
			if(res.status==200){
				message.success('Пользователь успешно зарегистрирован');
				setTimeout(()=>router.push('/login'),1500);
			}else{
				throw new Error(res.message||'Неизвестная ошибка');
			}
		} catch (err) {
			console.error('Ошибка при регистрации пользователя:', err);
			message.error(err);
		}
		setLoading(false);
	};
	let checkRefferal = async () =>{
		if(!referral){
			return;
		}
		setLoading(true);
		setReferralInfo(null);
		try {
			let {result} = await getJson('/api/user/getReferral', {id: referral}, message);
			if(!result?.name || !result?.surname){
				throw new Error('Отсутсвуют обязательные поля реферала');
			}
			setReferralInfo(result.name+' '+result.surname);
		} catch (err) {
			console.error('Ошибка при получении информации о реферале:', err);
		}
		setLoading(false);

	};
	let changeRef = (e) =>{
		setReferral(e.target.value);
	};
	return <MainLayout>
		<h1>Страница регистрации</h1>
		<Form
			name="register"
			onFinish={onFinish}
			scrollToFirstError
			loading={loading+''}
			initialValues={referrer&&{
				'referralLink': referrer
			}}
		>
			<Form.Item
				name="name"
				rules={[
					{
						required: true,
						message: 'Введите ваше имя!'
					}
				]}
			>
				<Input placeholder="Ваше Имя" />
			</Form.Item>
			<Form.Item
				name="surname"
				rules={[
					{
						required: true,
						message: 'Введите вашу фамилию!'
					}
				]}
			>
				<Input placeholder="Ваша Фамилия" />
			</Form.Item>
			<Form.Item
				name="tel"
				rules={[
					{
						required: true,
						message: 'Введите ваш телефонныый номер'
					}
				]}
			>
				<InputNumber placeholder="+7  999 999 99 99" controls={false} style={{width:'100%'}}/>
			</Form.Item>
			<Form.Item
				name="country"
				rules={[
					{
						required: true,
						message: 'Введите вашу страну'
					}
				]}
			>
				<Input style={{width:'100%'}} placeholder="Ваша страна"/>
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
			<Form.Item
				name="birthDate"
				rules={[
					{
						required: true,
						message: 'Введите вашу дату рождения!'
					}
				]}
			>
				<DatePicker placeholder='Дата своего рождения'  />
			</Form.Item>
			<Form.Item
				name="email"
				rules={[
					{
						type: 'email',
						message: 'Введите корректный E-mail!'
					},
					{
						required: true,
						message: 'Введите ваш E-mail!'
					}
				]}
			>
				<Input placeholder="E-mail" />
			</Form.Item>

			<Form.Item
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
			</Form.Item>

			<Form.Item extra="Согласно нашей политике, регистрация только с помощью рефералов">
				<Row gutter={8}>
					<Col sm={16} xs={10}>
						<Form.Item
							name="referralLink"
							noStyle
							rules={[
								{ required: true, message: 'Пожалуйста укажите реферала!' },
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || 24 === value.length) {
											return Promise.resolve();
										}
										return Promise.reject('Введите корректный id');
									}
								})
							]}
						>
							<Input value={referral} onChange={changeRef}/>
						</Form.Item>
						{/* {(referralInfo?.length)&&<span>имя и фамилия реф-ла: {referralInfo}</span>} */}
					</Col>
					<Col sm={8} xs={14}>
						<Button style={{ width: '100%' }} type="primary" onClick={checkRefferal} loading={loading}>Проверить</Button>
					</Col>
				</Row>
			</Form.Item>

			<Form.Item extra="Мы должны убедиться что Вы человек">
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
					Я согласен с условиями <a href="">соглашения</a>
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