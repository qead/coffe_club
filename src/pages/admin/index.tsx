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
	const [state, setState] = useState ([]); 
	useEffect (async() => { 
		const response =await getJson('/api/admin/getUsers',{test:'test'});
		if(response?.result){
			setState(response.result);
		}
	}, [] );
	if(ctx?.isAuth&&ctx?.isAdmin){
		return (<AdminLayout>
			<h1>Статистика</h1>
			<ul>
				{state.map((item, i)=><li key={i}>{item.email}</li>)}
			</ul>
		</AdminLayout>);
	}
	return (<MainLayout>
		<h1>Страница для авторизованных пользователей</h1>
	</MainLayout>);
}
