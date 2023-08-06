import { useState } from 'react';
import {
	Form,
	Input,
	Button,
	Radio,
	message,
	InputNumber,
	Upload,
	Switch
} from 'antd';
import React from 'react';
import{PlusOutlined, DeleteOutlined} from  '@ant-design/icons';
const RenderManyDesc=(descriptionFields)=>{
	return ;
};
const dataToForm = (data) => {
	const result = [];
	for (const [key, value] of Object.entries(data)) {
		if (key === 'description' && Array.isArray(value)) {
			// Если значение является массивом, добавляем каждый элемент массива в состояние descriptionFields
		} else {
			result.push({ name: key, value });
		}
	}
	return result;
};

export default function EditProduct({onCompleate, data}){	
	let formProps = {};
	let changedData = {};
	const [form] = Form.useForm();
	const [descriptionFields, setDescriptionFields] = useState(Array.isArray(data.description)?data.description:[]);
	if(data){
		const formatedData = dataToForm(data);
		form.setFields(formatedData);
		const onValuesChange = (changedValues: any, allValues) => {
			changedData = {...changedData,...changedValues};
			if (changedValues.description) {
				const { name, value } = changedValues.description;
				if (Array.isArray(value)) {
					setDescriptionFields(value.map((item, index) => ({ name, value: item })));
				} else {
					setDescriptionFields([]);
				}
			}
		};
		formProps = {
			form:form,
			onValuesChange
		}; 
	// 	const  insertData='{"topic":"Мессенджер","url":"vkontakte","title":"title","description":"desc","price":10000,"meta_title":"meta_title","meta_description":"meta_desc"}';
	}
	const onFinish = (values: any) => {
		if(data.url&&(Object.keys(changedData)||descriptionFields.length > 0)){
			changedData.url=data.url;
			const descriptionArray = descriptionFields.map((field) => ({
				title: field.title,
				desc: field.value
			}));
			changedData.description = descriptionArray;
			onCompleate(changedData);
		}else{
			onCompleate(values);
		}
	};
	return (
		<>
			<Form
				{...formProps}
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 14 }}
				layout="vertical"
				onFinish={onFinish}
			>
				<Form.Item label="Адрес" name="url">
					<Input />
				</Form.Item>
				<Form.Item label="Название" name="title">
					<Input />
				</Form.Item>
				<Form.Item label="Описание" name="description">
					{descriptionFields.length ? (
						descriptionFields.map((field,i) => (
							<div key={i}>
								<Input.Group style={{marginBottom:'10px'}}>
									<Input style={{ width: '35%' }} placeholder="Название" 
										onChange={(e) => {
											const { value } = e.target;
											setDescriptionFields((prevState) =>
												prevState.map((item) => (item.key === field.key ? { ...item, title: value } : item))
											);
										}}
									/>
									<Input style={{ width: '65%' }} placeholder="Описание" 
										onChange={(e) => {
											const { value } = e.target;
											setDescriptionFields((prevState) =>
												prevState.map((item) => (item.key === field.key ? { ...item, value } : item))
											);
										}}
									/>
								</Input.Group>
							</div>))
					) : (
						<Input defaultValue={data?.description || ''} />
					)}
					<Button 
						type="primary" icon={<PlusOutlined />}
						onClick={() => {
							setDescriptionFields((prevState) => [
								...prevState,
								{ title: '', value: '' }
							]);
						}}
					>Добавить</Button>
					{descriptionFields.length>1?<Button 
						type="primary" icon={<DeleteOutlined />}
						onClick={() => {
							setDescriptionFields((prevState) => prevState.slice(0, -1));
						}}
					>Удалить</Button>:null}
				</Form.Item>
				<Form.Item label="Изображение" name="image">
					<Input />
				</Form.Item>
				<Form.Item label="Цена" name="price">
					<InputNumber />
				</Form.Item>
				<Form.Item label="Маркетинг цена" name="marketing_price">
					<InputNumber />
				</Form.Item>
				<Form.Item label="Вес грамм" name="weight">
					<InputNumber />
				</Form.Item>
				<Form.Item label="Title" name="meta_title">
					<Input />
				</Form.Item>
				<Form.Item label="Description" name="meta_description">
					<Input />
				</Form.Item>
				<Form.Item label="Отключить" valuePropName="checked" name="isOff">
					<Switch />
				</Form.Item>
				<Form.Item label="Скидка" valuePropName="checked" name="isSale">
					<Switch />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">Добавить</Button>
				</Form.Item>
			</Form>
		</>
	);
}
