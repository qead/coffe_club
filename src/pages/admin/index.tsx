import { useState,useEffect } from 'react';
import getJson from '../../utils/getJson';
import {Button} from 'antd';
import MainLayout from '../../components/Layout';
import AdminLayout from '../../components/AdminLayout';
export  function getServerSideProps ({ req, res }){
	const isAuth = !!req?.cookies?.token;
	const isAdmin = !!req?.cookies?.isAdmin;
	if (!isAuth||!isAdmin) {
	  return {
			redirect: {
				destination: '/404',
				permanent: false
			}
	  };
	}
	return {
	  props: {isAuth, isAdmin}
	};
}
export default function AdminPanel(ctx:any){
	const [userCount, setUserCount] = useState (0); 
	useEffect (async() => { 
		const response =await getJson('/api/admin/getUsersCount');
		if(response?.result){
			setUserCount(response.result);
		}
	}, [] );
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout>
			<h1>Статистика</h1>
			Количество пользователей: {userCount}
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
