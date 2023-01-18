import { useState } from 'react';
import MainLayout from '../components/Layout';
import {message, Button, Form, Input, Checkbox} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import getJson from '../utils/getJson';

export default function Login(){
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	let onFinish = async(values) => {
		setLoading(true);
		try {
			let response = await getJson('/api/auth/login',values,message);
			if(response.status==200){
				dispatch({type:'LOGIN'});
			}
		} catch (error) {
			console.log('error:', error);
			message.error(error.message||'Непредвиденная ошибка');
		}
		setLoading(false);
	};
	return (
		<MainLayout>
			<Form
				name="normal_login"
				initialValues={{'remember': true}}
				onFinish={onFinish}
			>
				<Form.Item
					name="email"
					rules={[
						{
							'type': 'email',
							'message': 'Введите ваш E-mail корректно!'
						},
						{
							'required': true,
							'message': 'Пожалуйста введите E-mail!'
						}
					]}
				>
					<Input
						prefix={<UserOutlined />}
						placeholder="E-mail" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{'required': true,
						'message': 'Пожалуйста введите пароль!'}]}
				>
					<Input
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
      Или <a href="">Зарегистрироваться!</a>
				</Form.Item>
			</Form>
		</MainLayout>);
}
