import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
	Form,
	Input,
	Row,
	Col,
	Checkbox,
	DatePicker,
	Button
} from 'antd';
import MainLayout from '../components/Layout';
export default function Profile(ctx) {
	const isAuth = useSelector((state) => state.isAuth);
	if(isAuth){
		return (
			<MainLayout>
				<h1>Профиль</h1>
				<Form
					name="register"
					scrollToFirstError
				>
					<Row gutter={16}>
						<Col span={12}>
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
						</Col>
						<Col span={12}>
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
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="birthDate"
								rules={[
									{
										required: true,
										message: 'Введите вашу дату рождения!'
									}
								]}
							>
								<DatePicker placeholder='Дата своего рождения' style={{width:'100%'}}/>
							</Form.Item>
						</Col>
						<Col span={12}>
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
						</Col>
					</Row>
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