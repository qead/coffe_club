import { useState } from 'react';
import getJson from '../../utils/getJson';
import {
	Form,
	Input,
	Row,
	Col,
	Checkbox,
	DatePicker,
	Button,
	message
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
export default function RegistrationForm({closeModal}){
	const [loading, setLoading] = useState(false);
	let onFinish = async values => {
		console.log('values', values);
		setLoading(true);
		delete values.agreement;
		delete values.confirm;
		try {
			await getJson('/api/auth/register', values, message);
			closeModal();
		} catch (err) {
			console.error('Ошибка при регистрации пользователя:', err);
		}
		setLoading(false);
	};
	return <Form
		name="register"
		onFinish={onFinish}
		scrollToFirstError
		loading={loading}
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
	</Form>;
}