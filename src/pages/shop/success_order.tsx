import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { InferGetStaticPropsType } from 'next';
import MainLayout from '../../components/Layout';
import { Result,Button} from 'antd';
import Link from 'next/link';

function SuccessOrder({products=[]}: InferGetStaticPropsType<typeof GetServerSideProps>) {
	const [company, setCompany] = useState<string>('');
	const [sortCondition, setSortCondition] = useState<string>('');
	const [isListView, setListView] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>('');

	return (
		<MainLayout >
			<Result
				style={{}}
				status="success"
				title="Ваш заказ успешно оформлен!"
				subTitle="Мы благодарим Вас за выбор нашей компании и рады сообщить, что ваш заказ был успешно оформлен. Мы готовы предоставить Вам лучший опыт в обслуживании клиентов и качественный продукт. Посетите страницу заказов, чтобы просмотреть свой заказ, либо наш сайт, чтобы ознакомиться с нашим ассортиментом. Еще раз спасибо за выбор Coffe-Club!"
				extra={[
					<Link href={'/shop/orders'} key="1"><Button type="primary">Страница заказов</Button></Link>,
					<Link href={'/'} key="2"><Button key="buy">Главная</Button></Link>
				]}
			/>
		</MainLayout>
	);
}
export default SuccessOrder;