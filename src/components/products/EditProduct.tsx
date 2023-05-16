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

const dataToForm = (data:Object) =>{
	const dataArr = Object.entries(data);
	const result = [];
	if(dataArr.length){
		for (let i = 0; i < dataArr.length; i++) {
			const el = dataArr[i];
			if(el.length == 2){
				result.push({name:el[0],value:el[1]});
			}
		}
		return result;
	}
};

export default function EditProduct({onCompleate, data}){	
	let formProps:props = {};
	let changedData = {};
	const [form] = Form.useForm();
	if(data){
		const formatedData = dataToForm(data);
		console.log('data', data,formatedData);
		form.setFields(formatedData);
		const onValuesChange = (value: any, allValues) => {
			changedData = {...changedData,...value};
		};
		formProps = {
			form:form,
			onValuesChange
		}; 
	// 	const  insertData='{"topic":"Мессенджер","url":"vkontakte","title":"title","description":"desc","price":10000,"meta_title":"meta_title","meta_description":"meta_desc"}';
	}
	const onFinish = (values: any) => {
		console.log('changedData, values', changedData, values);
		if(data.url&&Object.keys(changedData)){
			changedData.url=data.url;
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
				layout="horizontal"
				onFinish={onFinish}
			>
				<Form.Item label="Адрес" name="url">
					<Input />
				</Form.Item>
				<Form.Item label="Название" name="title">
					<Input />
				</Form.Item>
				<Form.Item label="Описание" name="description">
					<Input />
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
