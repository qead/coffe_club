import React from 'react';
import { Input, Form } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
  
const PhoneInput = () => {
 
	const pattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;

	return (
		<Form.Item
			name="tel"
			label="Телефонный номер"
			validateFirst={true}
			rules={[
				{ required:true, message: 'Номер телефона является обязательным полем' },
				{ pattern, message: 'Введите корректный номер телефона с кодом страны (+79998887766)' },
				{
					validator: (_, value) =>!value.includes(' ')? Promise.resolve(): Promise.reject(new Error('Уберите пустые пробелы из поля для ввода'))
				}
			]}
			hasFeedback
		>
			<Input prefix={<PhoneOutlined />} placeholder="+79997773322" />
		</Form.Item>
	);
};
 
export default PhoneInput;