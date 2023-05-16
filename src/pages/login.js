import { useState } from 'react';
import MainLayout from '../components/Layout';
import {message, Button, Form, Input, Checkbox, InputNumber} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import getJson from '../utils/getJson';
export default function Login(){
	
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	let onFinish = async(values) => {
		setLoading(true);
		try {
			let response = await getJson('/api/auth/login',values,message);
			if(response.status==200){
				dispatch({type:'LOGIN'});
				router.push('/profile');
			}
		} catch (error) {
			console.log('error:', error);
			message.error(error.message||'Непредвиденная ошибка');
		}
		setLoading(false);
	};
	return (
		<MainLayout>
			<h1>Страница авторизации</h1>
			<Form
				name="normal_login"
				initialValues={{'remember': true}}
				onFinish={onFinish}
				style={{maxWidth:'500px', margin:'25px 0'}}
			>
				<Form.Item
					name="id"
					rules={[
						// {
						// 	'type': 'email',
						// 	'message': 'Введите ваш E-mail корректно!'
						// },
						// {
						// 	'required': true,
						// 	'message': 'Пожалуйста введите E-mail!'
						// },
					]}
					extra="Номер пользователя (id) отправлен на вашу почту после регистрации"
				>
					<InputNumber
						style={{width:'100%'}}
						controls={false}
						prefix={<UserOutlined />}
						placeholder="Id пользователя" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{'required': true,
						'message': 'Пожалуйста введите пароль!'}]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						type="password"
						placeholder="Пароль"
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item name="remember" valuePropName="checked" noStyle>
						<Checkbox>Запомнить меня</Checkbox>
					</Form.Item>
					<a href="">
        Забыли пароль
					</a>
				</Form.Item>
				<Form.Item>
					<Button type="primary" loading={loading} htmlType="submit" className="row-item-m5">
        Войти
					</Button>
      Или <Link href="/register">Зарегистрироваться!</Link>
				</Form.Item>
			</Form>
		</MainLayout>);
}
export const getServerSideProps = async function ({ req }){
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