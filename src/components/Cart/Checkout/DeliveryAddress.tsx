import React from 'react';
import Link from 'next/link';
import { Product } from '../../../actions';
import { useCartSelector } from '../../../selectors';
import { getCartItemCount } from '../../../helpers';
import { Form,Input,Select  } from 'antd';
import ProductInfo from '../ProductInfo';
import countries from '../../../lib/countries.json';
import './DeliveryAddress.less';
// interface CheckoutItemProps {
//   product: Product;
// }
interface FieldData {
	name: string | number | (string | number)[];
	value?: any;
	touched?: boolean;
	validating?: boolean;
	errors?: string[];
  }

interface CustomizedFormProps {
	onChange: (fields: FieldData[]) => void;
	fields: FieldData[];
	layout: string;
  }

const DeliveryAddress: React.FC<CustomizedFormProps> = ({onChange, fields, layout }) => {
	return (
		<>
			<h2>Адрес доставки</h2>
			<Form
				layout={layout||'inline'}
				fields={fields}
				onFieldsChange={(_, allFields) => {
					onChange(allFields);
				}}
			>
				<Form.Item
					name="country"
					label="Страна"
					rules={[{ required: true, message: 'Страна обязательное поле' }]}
				>
					<Select options={countries} showSearch />
				</Form.Item>
				<Form.Item
					name="state"
					label="Регион"
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="city"
					label="Город"
					rules={[{ required: true, message: 'Город обязательное поле' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="zipcode"
					label="Почтовый индекс"
					rules={[{ required: true, message: 'Почтовый индекс обязательное поле' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="street"
					label="Улица"
					rules={[{ required: true, message: 'Улица обязательное поле' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="house"
					label="Дом"
					rules={[{ required: true, message: 'Дом обязательное поле' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="apartment"
					label="Квартира"
				>
					<Input />
				</Form.Item>
			</Form>
		</>
	);
};

export default DeliveryAddress;
